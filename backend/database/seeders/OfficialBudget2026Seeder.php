<?php

namespace Database\Seeders;

use App\Domain\Budget\BudgetImportService;
use App\Models\BudgetVersion;
use App\Models\FiscalYear;
use Illuminate\Database\Seeder;
use RuntimeException;

class OfficialBudget2026Seeder extends Seeder
{
    public function run(): void
    {
        if (BudgetVersion::query()->where('code', 'BUD-2026-ANNEXE')->exists()) {
            return;
        }

        $year = FiscalYear::query()->where('year', 2026)->first();
        if ($year === null) {
            return;
        }

        $path = database_path('data/official-budget-2026.json');
        /** @var list<array<string, mixed>> $lines */
        $lines = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        $imports = app(BudgetImportService::class);
        $batch = $imports->stage($year, 'official_2026', $lines);
        if ($batch->status !== 'accepted') {
            $errors = $batch->report['errors'] ?? [];
            throw new RuntimeException('Import officiel 2026 rejeté : '.implode(' ', $errors));
        }

        $version = $imports->promote($batch);
        $version->update([
            'code' => 'BUD-2026-ANNEXE',
            'label' => 'Annexe Budget exercice 2026',
            'note' => 'Brouillon issu de l’annexe. Chaque ligne est le dernier niveau dont les fils additionnent le parent. Les piliers du PAP exprimés en milliers de francs sont convertis en francs. Les recettes sont prises aux totaux de titre, le détail des États et des partenaires ne refermant pas ces totaux. Cette version n’ouvre pas les crédits.',
        ]);
    }
}
