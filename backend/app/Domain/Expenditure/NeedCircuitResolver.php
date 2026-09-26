<?php

namespace App\Domain\Expenditure;

use App\Exceptions\NeedRuleException;
use App\Models\BudgetLine;
use App\Models\OrganizationUnit;

class NeedCircuitResolver
{
    public function resolve(BudgetLine $line, OrganizationUnit $unit): string
    {
        if ($line->nature !== 'expenditure') {
            throw new NeedRuleException('Seule une ligne de dépense peut porter une expression de besoin.');
        }

        if ($line->segment === 'fonctionnement') {
            return 'EB-HORS-PAP';
        }

        if ($line->segment === 'investissement') {
            return match ($this->departmentKind($unit)) {
                'departement_technique' => 'EB-PAP-TECHNIQUE',
                'departement_appui' => 'EB-PAP-APPUI',
                default => throw new NeedRuleException('Aucun circuit PAP n’est défini pour cette structure.'),
            };
        }

        throw new NeedRuleException('Cette ligne n’ouvre ni une expression hors PAP ni une expression PAP.');
    }

    public function initiatorRole(string $circuit): string
    {
        return match ($circuit) {
            'EB-HORS-PAP' => 'moyens_generaux',
            'EB-PAP-TECHNIQUE', 'EB-PAP-APPUI' => 'initiateur',
            default => throw new NeedRuleException('Circuit inconnu.'),
        };
    }

    private function departmentKind(OrganizationUnit $unit): ?string
    {
        $current = $unit;
        $guard = 0;

        while ($current !== null && $guard < 30) {
            if (in_array($current->unit_type, ['departement_technique', 'departement_appui'], true)) {
                return $current->unit_type;
            }
            $current = $current->parent;
            $guard++;
        }

        return null;
    }
}
