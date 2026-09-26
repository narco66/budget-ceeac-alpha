<?php

namespace App\Http\Resources;

use App\Models\WorkflowStep;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin WorkflowStep */
class WorkflowStepResource extends JsonResource
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
            'position' => $this->position,
            'actor_kind' => $this->actor_kind,
            'actor_role_code' => $this->actor_role_code,
            'sla_hours' => $this->sla_hours,
        ];
    }
}
