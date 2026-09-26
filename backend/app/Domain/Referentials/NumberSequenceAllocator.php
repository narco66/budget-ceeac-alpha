<?php

namespace App\Domain\Referentials;

use App\Models\FiscalYear;
use App\Models\NumberSequence;
use Illuminate\Support\Facades\DB;

class NumberSequenceAllocator
{
    public function next(string $domain, FiscalYear $year): string
    {
        return DB::transaction(function () use ($domain, $year): string {
            $sequence = NumberSequence::query()
                ->where('domain', $domain)
                ->where('fiscal_year_id', $year->id)
                ->lockForUpdate()
                ->firstOrFail();

            $sequence->last_value = $sequence->last_value + 1;
            $sequence->save();

            return ReferenceFormat::make($domain, $year->year, $sequence->last_value);
        });
    }
}
