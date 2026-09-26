<?php

namespace App\Domain\Referentials;

use App\Domain\Money\IntegerAmount;
use App\Models\SystemParameter;

class AuthorizerResolver
{
    public const THRESHOLD_CODE = 'ord.authorizer_threshold_xaf';

    public function roleCodeForAmount(string $amountXaf, ?string $on = null): string
    {
        $parameter = $this->applicable($on);
        $comparison = IntegerAmount::compare($amountXaf, (string) $parameter->amount_xaf);

        return $comparison <= 0 ? 'secretaire_general' : 'president';
    }

    public function applicable(?string $on = null): SystemParameter
    {
        return SystemParameter::query()
            ->where('code', self::THRESHOLD_CODE)
            ->where('status', 'active')
            ->whereDate('effective_on', '<=', $on ?? now()->toDateString())
            ->orderByDesc('version')
            ->firstOrFail();
    }
}
