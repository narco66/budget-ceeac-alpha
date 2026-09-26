<?php

namespace App\Http\Resources;

use App\Models\NomenclatureVersion;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin NomenclatureVersion */
class NomenclatureVersionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'label' => $this->label,
            'status' => $this->status,
            'note' => $this->note,
            'fiscal_year_id' => $this->fiscal_year_id,
            'items_count' => $this->whenCounted('items'),
        ];
    }
}
