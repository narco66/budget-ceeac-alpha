<?php

namespace App\Domain\Budget;

/**
 * Totaux de contrôle de l'annexe Budget 2026, en XAF entiers.
 * Ils servent de barrière d'import. Ils ne sont pas des crédits ouverts.
 */
final class OfficialBudgetControls
{
    public const YEAR = 2026;

    public const TOTAL_REVENUE = '40305795803';

    public const TOTAL_EXPENDITURE = '40305795803';

    public const FONCTIONNEMENT = '13677514803';

    public const INVESTISSEMENT = '25887281000';

    public const EQUIPEMENT = '741000000';

    public const INVESTISSEMENT_CEEAC = '11857000000';

    public const INVESTISSEMENT_PTF = '14030281000';

    /**
     * @return array<string, string>
     */
    public static function expenditure(): array
    {
        return [
            'fonctionnement' => self::FONCTIONNEMENT,
            'investissement' => self::INVESTISSEMENT,
            'equipement' => self::EQUIPEMENT,
            'total' => self::TOTAL_EXPENDITURE,
            'investissement_ceeac' => self::INVESTISSEMENT_CEEAC,
            'investissement_ptf' => self::INVESTISSEMENT_PTF,
        ];
    }
}
