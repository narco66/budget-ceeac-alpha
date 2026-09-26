<?php

namespace App\Domain\Expenditure;

use App\Models\PaymentOrder;
use App\Models\WorkflowDefinition;
use App\Models\WorkflowEvent;
use App\Models\WorkflowInstance;
use App\Models\WorkflowStep;

class OrdonnancementWorkflow
{
    public function start(PaymentOrder $order): void
    {
        $definition = WorkflowDefinition::query()
            ->where('code', 'ORD')
            ->where('status', 'active')
            ->orderByDesc('version')
            ->firstOrFail();

        $generated = $this->step($definition->id, 'genere');
        $control = $this->step($definition->id, 'controle');
        $signature = $this->step($definition->id, 'signature');

        $instance = WorkflowInstance::query()->create([
            'workflow_definition_id' => $definition->id,
            'subject_type' => PaymentOrder::class,
            'subject_id' => $order->id,
            'current_step_id' => $signature->id,
            'status' => 'open',
        ]);

        WorkflowEvent::query()->create([
            'workflow_instance_id' => $instance->id,
            'actor_id' => null,
            'actor_role_code' => null,
            'action' => 'open',
            'from_step_id' => $generated->id,
            'to_step_id' => $control->id,
            'reason' => null,
        ]);
        WorkflowEvent::query()->create([
            'workflow_instance_id' => $instance->id,
            'actor_id' => null,
            'actor_role_code' => null,
            'action' => 'validate',
            'from_step_id' => $control->id,
            'to_step_id' => $signature->id,
            'reason' => 'Contrôle automatique : aucune fonction n’est nommée pour la préparation administrative.',
        ]);

        $order->update(['workflow_instance_id' => $instance->id]);
    }

    private function step(string $definitionId, string $code): WorkflowStep
    {
        return WorkflowStep::query()
            ->where('workflow_definition_id', $definitionId)
            ->where('code', $code)
            ->firstOrFail();
    }
}
