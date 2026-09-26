<?php

namespace App\Domain\Budget;

use App\Domain\Money\IntegerAmount;
use App\Exceptions\BudgetRuleException;
use App\Models\BudgetImportBatch;
use App\Models\BudgetVersion;
use App\Models\FiscalYear;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class BudgetImportService
{
    public function __construct(private readonly BudgetVersionService $versions) {}

    /**
     * @param  list<array<string, mixed>>  $lines
     */
    public function stage(FiscalYear $year, string $mode, array $lines): BudgetImportBatch
    {
        if (! in_array($mode, ['official_2026', 'draft'], true)) {
            throw new BudgetRuleException('Mode d’import inconnu.');
        }
        if ($mode === 'official_2026' && $year->year !== OfficialBudgetControls::YEAR) {
            throw new BudgetRuleException('Le contrôle officiel 2026 ne s’applique qu’à l’exercice 2026.');
        }

        $errors = [];
        $actual = [
            'fonctionnement' => '0',
            'investissement' => '0',
            'equipement' => '0',
            'investissement_ceeac' => '0',
            'investissement_ptf' => '0',
            'revenue' => '0',
        ];
        $clean = [];

        foreach ($lines as $index => $line) {
            $rowError = $this->rowError($line);
            $clean[] = [
                'row_number' => $index + 1,
                'nature' => $line['nature'] ?? null,
                'segment' => $line['segment'] ?? null,
                'funding_source' => $line['funding_source'] ?? null,
                'code' => $line['code'] ?? null,
                'label' => $line['label'] ?? null,
                'amount_xaf' => isset($line['amount_xaf']) ? (string) $line['amount_xaf'] : null,
                'error' => $rowError,
            ];
            if ($rowError !== null) {
                $errors[] = 'Ligne '.($index + 1).' : '.$rowError;

                continue;
            }
            $amount = IntegerAmount::assert((string) $line['amount_xaf']);
            if ($line['nature'] === 'revenue') {
                $actual['revenue'] = IntegerAmount::add($actual['revenue'], $amount);

                continue;
            }
            $actual[$line['segment']] = IntegerAmount::add($actual[$line['segment']], $amount);
            if ($line['segment'] === 'investissement') {
                $key = $line['funding_source'] === 'ptf' ? 'investissement_ptf' : 'investissement_ceeac';
                $actual[$key] = IntegerAmount::add($actual[$key], $amount);
            }
        }

        $actual['total'] = IntegerAmount::add(
            $actual['fonctionnement'],
            IntegerAmount::add($actual['investissement'], $actual['equipement']),
        );

        if ($mode === 'official_2026') {
            $expected = OfficialBudgetControls::expenditure();
            foreach (['fonctionnement', 'investissement', 'equipement', 'total', 'investissement_ceeac', 'investissement_ptf'] as $key) {
                if (IntegerAmount::compare($actual[$key], $expected[$key]) !== 0) {
                    $errors[] = 'Écart sur '.$key.' : reçu '.$actual[$key].', attendu '.$expected[$key].'.';
                }
            }
            if (IntegerAmount::compare($actual['revenue'], '0') !== 0
                && IntegerAmount::compare($actual['revenue'], OfficialBudgetControls::TOTAL_REVENUE) !== 0) {
                $errors[] = 'Écart sur les recettes : reçu '.$actual['revenue'].', attendu '.OfficialBudgetControls::TOTAL_REVENUE.'.';
            }
        }

        $status = $errors === [] ? 'accepted' : 'rejected';

        return DB::transaction(function () use ($year, $mode, $status, $actual, $errors, $clean): BudgetImportBatch {
            $batch = BudgetImportBatch::query()->create([
                'fiscal_year_id' => $year->id,
                'mode' => $mode,
                'status' => $status,
                'report' => [
                    'actual' => $actual,
                    'expected' => $mode === 'official_2026' ? OfficialBudgetControls::expenditure() : null,
                    'errors' => $errors,
                    'promoted' => false,
                ],
            ]);
            $batch->rows()->createMany($clean);

            return $batch->load('rows');
        });
    }

    public function promote(BudgetImportBatch $batch): BudgetVersion
    {
        if ($batch->status !== 'accepted') {
            throw new BudgetRuleException('Un lot rejeté ne peut pas être promu.');
        }
        if ($batch->budget_version_id !== null) {
            throw new BudgetRuleException('Ce lot est déjà promu.');
        }

        return DB::transaction(function () use ($batch): BudgetVersion {
            $locked = BudgetImportBatch::query()->whereKey($batch->id)->lockForUpdate()->firstOrFail();
            $locked->load(['rows', 'fiscalYear']);
            $version = $this->versions->createDraft(
                $locked->fiscalYear,
                'IMP-'.$locked->id,
                'Import '.$locked->mode,
                'Version brouillon issue d’un lot accepté. Publication séparée.',
            );

            foreach ($locked->rows as $row) {
                if ($row->error !== null) {
                    continue;
                }
                $this->versions->addLine($version, [
                    'nature' => (string) $row->nature,
                    'segment' => (string) $row->segment,
                    'funding_source' => (string) $row->funding_source,
                    'code' => (string) $row->code,
                    'label' => (string) $row->label,
                    'amount_xaf' => IntegerAmount::assert((string) $row->amount_xaf),
                ]);
            }

            $report = $locked->report;
            $report['promoted'] = true;
            $locked->update([
                'budget_version_id' => $version->id,
                'report' => $report,
            ]);

            return $version->load('lines');
        });
    }

    /**
     * @param  array<string, mixed>  $line
     */
    private function rowError(array $line): ?string
    {
        foreach (['nature', 'segment', 'funding_source', 'code', 'label', 'amount_xaf'] as $key) {
            if (! isset($line[$key]) || $line[$key] === '') {
                return 'Champ '.$key.' manquant.';
            }
        }
        if (! in_array($line['nature'], ['expenditure', 'revenue'], true)) {
            return 'Nature inconnue.';
        }
        if ($line['nature'] === 'expenditure' && ! in_array($line['segment'], ['fonctionnement', 'investissement', 'equipement'], true)) {
            return 'Segment de dépense inconnu.';
        }
        if ($line['nature'] === 'revenue' && $line['segment'] !== 'recette') {
            return 'Les recettes utilisent le segment recette.';
        }
        if (! in_array($line['funding_source'], ['ceeac', 'ptf'], true)) {
            return 'Source de financement inconnue.';
        }
        try {
            IntegerAmount::assert((string) $line['amount_xaf']);
        } catch (InvalidArgumentException) {
            return 'Montant non entier.';
        }

        return null;
    }
}
