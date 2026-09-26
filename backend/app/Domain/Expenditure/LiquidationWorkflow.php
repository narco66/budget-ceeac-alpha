<?php

namespace App\Domain\Expenditure;

use App\Models\Liquidation;
use App\Models\Task;
use App\Models\WorkflowDefinition;
use App\Models\WorkflowEvent;
use App\Models\WorkflowInstance;
use App\Models\WorkflowStep;

class LiquidationWorkflow
{
    public function start(Liquidation $liquidation): void
    {
        $definition = WorkflowDefinition::query()
            ->where('code', 'LIQ')
            ->where('status', 'active')
            ->orderByDesc('version')
            ->firstOrFail();

        $generated = WorkflowStep::query()
            ->where('workflow_definition_id', $definition->id)
            ->where('code', 'generee')
            ->firstOrFail();
        $preparation = WorkflowStep::query()
            ->where('workflow_definition_id', $definition->id)
            ->where('code', 'preparation')
            ->firstOrFail();

        $instance = WorkflowInstance::query()->create([
            'workflow_definition_id' => $definition->id,
            'subject_type' => Liquidation::class,
            'subject_id' => $liquidation->id,
            'current_step_id' => $preparation->id,
            'status' => 'open',
        ]);

        WorkflowEvent::query()->create([
            'workflow_instance_id' => $instance->id,
            'actor_id' => null,
            'actor_role_code' => null,
            'action' => 'open',
            'from_step_id' => $generated->id,
            'to_step_id' => $preparation->id,
            'reason' => null,
        ]);

        $liquidation->update([
            'workflow_instance_id' => $instance->id,
            'status' => 'in_preparation',
        ]);

        Task::query()->create([
            'need_request_id' => $liquidation->need_request_id,
            'workflow_instance_id' => $instance->id,
            'assignee_role_code' => 'initiateur',
            'title' => $liquidation->reference.' — Préparation de la liquidation',
            'status' => 'open',
        ]);
    }
}
