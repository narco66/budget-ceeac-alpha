<?php

namespace App\Http\Resources;

use App\Models\FiscalPeriod;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin FiscalPeriod */
class FiscalPeriodResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $labels = [
            'not_opened' => 'non ouverte',
            'open' => 'ouverte',
            'closed' => 'close',
        ];

        return [
            'id' => $this->id,
            'position' => $this->position,
            'code' => $this->code,
            'label' => $this->label,
            'starts_on' => $this->starts_on?->toDateString(),
            'ends_on' => $this->ends_on?->toDateString(),
            'status' => $this->status,
            'status_label' => $labels[$this->status] ?? $this->status,
        ];
    }
}
