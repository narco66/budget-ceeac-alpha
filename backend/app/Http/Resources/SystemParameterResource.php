<?php

namespace App\Http\Resources;

use App\Models\SystemParameter;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin SystemParameter */
class SystemParameterResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'version' => $this->version,
            'amount_xaf' => $this->amount_xaf === null ? null : (string) $this->amount_xaf,
            'text_value' => $this->text_value,
            'status' => $this->status,
            'effective_on' => $this->effective_on?->toDateString(),
            'fiscal_year_id' => $this->fiscal_year_id,
            'note' => $this->note,
        ];
    }
}
