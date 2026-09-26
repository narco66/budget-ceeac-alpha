<?php

namespace App\Http\Resources;

use App\Domain\Referentials\ReferenceFormat;
use App\Models\NumberSequence;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin NumberSequence */
class NumberSequenceResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'domain' => $this->domain,
            'fiscal_year_id' => $this->fiscal_year_id,
            'last_value' => $this->last_value,
            'next_reference' => $this->relationLoaded('fiscalYear')
                ? ReferenceFormat::make($this->domain, $this->fiscalYear->year, $this->last_value + 1)
                : null,
        ];
    }
}
