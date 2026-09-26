<?php

namespace App\Domain\Expenditure;

use App\Models\Commitment;
use App\Models\Task;
use App\Models\WorkflowDefinition;
use App\Models\WorkflowEvent;
use App\Models\WorkflowInstance;
use App\Models\WorkflowStep;

class EngagementWorkflow
{
    public function start(Commitment $commitment): void
    {
        $definition = WorkflowDefinition::query()
            ->where('code', 'ENG')
            ->where('status', 'active')
            ->orderByDesc('version')
            ->firstOrFail();

        $generated = WorkflowStep::query()
            ->where('workflow_definition_id', $definition->id)
            ->where('code', 'genere')
            ->firstOrFail();
        $instruction = WorkflowStep::query()
            ->where('workflow_definition_id', $definition->id)
            ->where('code', 'instruction')
            ->firstOrFail();

        $instance = WorkflowInstance::query()->create([
            'workflow_definition_id' => $definition->id,
            'subject_type' => Commitment::class,
            'subject_id' => $commitment->id,
            'current_step_id' => $instruction->id,
            'status' => 'open',
        ]);

        WorkflowEvent::query()->create([
            'workflow_instance_id' => $instance->id,
            'actor_id' => null,
            'actor_role_code' => null,
            'action' => 'open',
            'from_step_id' => $generated->id,
            'to_step_id' => $instruction->id,
            'reason' => null,
        ]);

        $commitment->update([
            'workflow_instance_id' => $instance->id,
            'status' => 'in_instruction',
        ]);

        Task::query()->create([
            'need_request_id' => $commitment->need_request_id,
            'workflow_instance_id' => $instance->id,
            'assignee_role_code' => 'expert_budget',
            'title' => $commitment->reference.' — Instruction de l’expert budget',
            'status' => 'open',
        ]);
    }
}
