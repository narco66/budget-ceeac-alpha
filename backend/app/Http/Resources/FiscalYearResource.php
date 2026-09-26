<?php

namespace App\Http\Resources;

use App\Models\FiscalYear;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin FiscalYear */
class FiscalYearResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $labels = [
            'preparation' => 'préparation',
            'execution' => 'exécution',
            'closed' => 'clos',
        ];

        return [
            'id' => $this->id,
            'year' => $this->year,
            'label' => $this->label,
            'status' => $this->status,
            'status_label' => $labels[$this->status] ?? $this->status,
            'starts_on' => $this->starts_on?->toDateString(),
            'ends_on' => $this->ends_on?->toDateString(),
            'is_current' => $this->is_current,
            'note' => $this->note,
            'currency' => $this->whenLoaded('currency', fn () => [
                'code' => $this->currency->code,
                'name' => $this->currency->name,
                'minor_units' => $this->currency->minor_units,
            ]),
            'periods' => FiscalPeriodResource::collection($this->whenLoaded('periods')),
        ];
    }
}
