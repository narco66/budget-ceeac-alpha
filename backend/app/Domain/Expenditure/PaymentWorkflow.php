<?php

namespace App\Domain\Expenditure;

use App\Models\Payment;
use App\Models\Task;
use App\Models\WorkflowDefinition;
use App\Models\WorkflowEvent;
use App\Models\WorkflowInstance;
use App\Models\WorkflowStep;

class PaymentWorkflow
{
    public function start(Payment $payment): void
    {
        $definition = WorkflowDefinition::query()
            ->where('code', 'PAI')
            ->where('status', 'active')
            ->orderByDesc('version')
            ->firstOrFail();

        $received = WorkflowStep::query()
            ->where('workflow_definition_id', $definition->id)
            ->where('code', 'prise_en_charge')
            ->firstOrFail();
        $preparation = WorkflowStep::query()
            ->where('workflow_definition_id', $definition->id)
            ->where('code', 'preparation')
            ->firstOrFail();

        $instance = WorkflowInstance::query()->create([
            'workflow_definition_id' => $definition->id,
            'subject_type' => Payment::class,
            'subject_id' => $payment->id,
            'current_step_id' => $preparation->id,
            'status' => 'open',
        ]);

        WorkflowEvent::query()->create([
            'workflow_instance_id' => $instance->id,
            'actor_id' => null,
            'actor_role_code' => null,
            'action' => 'open',
            'from_step_id' => $received->id,
            'to_step_id' => $preparation->id,
            'reason' => null,
        ]);

        $payment->update([
            'workflow_instance_id' => $instance->id,
            'status' => 'in_preparation',
        ]);

        $needRequestId = $payment->paymentOrder()->firstOrFail()->liquidation()->firstOrFail()->need_request_id;
        Task::query()->create([
            'need_request_id' => $needRequestId,
            'workflow_instance_id' => $instance->id,
            'assignee_role_code' => 'comptable',
            'title' => $payment->reference.' — Préparation du paiement',
            'status' => 'open',
        ]);
    }
}
