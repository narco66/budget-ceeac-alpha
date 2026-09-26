<?php

namespace App\Domain\Budget;

use App\Exceptions\BudgetRuleException;
use App\Models\BudgetEvent;
use App\Models\BudgetLine;
use App\Models\BudgetVersion;
use App\Models\FiscalYear;
use Illuminate\Support\Facades\DB;

class BudgetVersionService
{
    public function createDraft(FiscalYear $year, string $code, string $label, ?string $note = null): BudgetVersion
    {
        return BudgetVersion::query()->create([
            'fiscal_year_id' => $year->id,
            'code' => $code,
            'label' => $label,
            'status' => 'draft',
            'note' => $note,
        ]);
    }

    /**
     * @param  array{nature: string, segment: string, funding_source: string, code: string, label: string, amount_xaf: string}  $attributes
     */
    public function addLine(BudgetVersion $version, array $attributes): BudgetLine
    {
        if ($version->isImmutable()) {
            throw new BudgetRuleException('Une version publiée n’accepte plus de nouvelle ligne.');
        }

        return $version->lines()->create([
            'nature' => $attributes['nature'],
            'segment' => $attributes['segment'],
            'funding_source' => $attributes['funding_source'],
            'code' => $attributes['code'],
            'label' => $attributes['label'],
            'initial_amount_xaf' => $attributes['amount_xaf'],
        ]);
    }

    public function publish(BudgetVersion $version): BudgetVersion
    {
        if (! in_array($version->status, ['draft', 'arbitrated'], true)) {
            throw new BudgetRuleException('Seule une version brouillon ou arbitrée peut être publiée.');
        }

        return DB::transaction(function () use ($version): BudgetVersion {
            $locked = BudgetVersion::query()->whereKey($version->id)->lockForUpdate()->firstOrFail();
            $lines = $locked->lines()->lockForUpdate()->get();
            if ($lines->isEmpty()) {
                throw new BudgetRuleException('Une version sans ligne ne peut pas être publiée.');
            }

            foreach ($lines as $line) {
                BudgetEvent::query()->create([
                    'budget_line_id' => $line->id,
                    'event_type' => 'initial',
                    'amount_xaf' => $line->initial_amount_xaf,
                    'source_type' => BudgetVersion::class,
                    'source_id' => $locked->id,
                ]);
            }

            $locked->update([
                'status' => 'published',
                'published_at' => now(),
            ]);

            return $locked->refresh();
        });
    }

    public function markExecutable(BudgetVersion $version): BudgetVersion
    {
        if ($version->status !== 'published') {
            throw new BudgetRuleException('Seule une version publiée peut devenir exécutoire.');
        }

        $version->update(['status' => 'executable']);

        return $version->refresh();
    }
}
