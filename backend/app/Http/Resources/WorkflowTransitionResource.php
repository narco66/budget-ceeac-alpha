<?php

namespace App\Http\Resources;

use App\Models\WorkflowTransition;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin WorkflowTransition */
class WorkflowTransitionResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'action' => $this->action,
            'from_step_id' => $this->from_step_id,
            'to_step_id' => $this->to_step_id,
            'requires_reason' => $this->requires_reason,
            'effect' => $this->effect,
        ];
    }
}
