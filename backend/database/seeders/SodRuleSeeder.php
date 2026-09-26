<?php

namespace Database\Seeders;

use App\Models\SodRule;
use Illuminate\Database\Seeder;

class SodRuleSeeder extends Seeder
{
    public function run(): void
    {
        $assignment = [
            ['agent_comptable', 'controleur_financier', 'Le contrôleur financier ne paie pas.'],
            ['agent_comptable', 'directeur_budget', 'Le validateur budgétaire ne paie pas le dossier.'],
            ['agent_comptable', 'expert_budget', 'L’instructeur budgétaire ne paie pas.'],
            ['agent_comptable', 'initiateur', 'L’initiateur ne paie pas son dossier.'],
            ['agent_comptable', 'moyens_generaux', 'Le service initiateur Hors PAP ne paie pas.'],
            ['agent_comptable', 'president', 'L’ordonnateur principal n’est pas l’agent comptable.'],
            ['agent_comptable', 'secretaire_general', 'L’ordonnateur délégué n’est pas l’agent comptable.'],
            ['controleur_financier', 'president', 'Le visa et l’ordonnancement principal sont séparés.'],
            ['controleur_financier', 'secretaire_general', 'Le visa et l’ordonnancement délégué sont séparés.'],
        ];

        $dossierOnly = [
            ['controleur_financier', 'initiateur', 'Préparation et visa financier sur le même dossier.'],
            ['controleur_financier', 'moyens_generaux', 'Initiation Hors PAP et visa sur le même dossier.'],
            ['directeur_budget', 'initiateur', 'Initiation et validation budgétaire sur le même dossier.'],
        ];

        foreach ($assignment as [$left, $right, $description]) {
            $this->store($left, $right, 'assignment', $description);
            $this->store($left, $right, 'dossier', $description);
        }

        foreach ($dossierOnly as [$left, $right, $description]) {
            $this->store($left, $right, 'dossier', $description);
        }
    }

    private function store(string $left, string $right, string $scope, string $description): void
    {
        [$roleA, $roleB] = strcmp($left, $right) <= 0 ? [$left, $right] : [$right, $left];

        SodRule::query()->updateOrCreate(
            ['role_a' => $roleA, 'role_b' => $roleB, 'scope' => $scope],
            ['description' => $description],
        );
    }
}
