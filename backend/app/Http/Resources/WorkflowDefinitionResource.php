<?php

namespace App\Http\Resources;

use App\Models\WorkflowDefinition;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin WorkflowDefinition */
class WorkflowDefinitionResource extends JsonResource
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
            'label' => $this->label,
            'domain' => $this->domain,
            'variant' => $this->variant,
            'status' => $this->status,
            'effective_on' => $this->effective_on?->toDateString(),
            'note' => $this->note,
            'steps' => WorkflowStepResource::collection($this->whenLoaded('steps')),
            'transitions' => WorkflowTransitionResource::collection($this->whenLoaded('transitions')),
        ];
    }
}
