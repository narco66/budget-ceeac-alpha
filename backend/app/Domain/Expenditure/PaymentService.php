<?php

namespace App\Domain\Expenditure;

use App\Domain\Identity\SegregationOfDuties;
use App\Domain\Money\IntegerAmount;
use App\Domain\Referentials\NumberSequenceAllocator;
use App\Exceptions\PaymentRuleException;
use App\Models\IdempotencyKey;
use App\Models\Payment;
use App\Models\PaymentDocument;
use App\Models\PaymentOrder;
use App\Models\Task;
use App\Models\User;
use App\Models\WorkflowEvent;
use App\Models\WorkflowInstance;
use App\Models\WorkflowStep;
use App\Models\WorkflowTransition;
use Illuminate\Support\Facades\DB;

class PaymentService
{
    public function __construct(
        private readonly SegregationOfDuties $segregation,
        private readonly NumberSequenceAllocator $allocator,
        private readonly PaymentWorkflow $workflow,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function state(User $user, Payment $payment, array $data): Payment
    {
        return DB::transaction(function () use ($user, $payment, $data): Payment {
            $locked = $this->lockOnPreparation($payment);
            $this->assertHoldsRole($user, 'comptable');
            $this->takenOrder($locked);
            $this->assertInstrumentFree($locked, (string) $data['mode'], (string) $data['instrument_reference']);
            $locked->update([
                'mode' => $data['mode'],
                'instrument_reference' => trim((string) $data['instrument_reference']),
                'value_on' => $data['value_on'],
            ]);

            return $locked->refresh();
        });
    }

    public function reduce(User $user, Payment $payment, string $amount): Payment
    {
        return DB::transaction(function () use ($user, $payment, $amount): Payment {
            $locked = $this->lockOnPreparation($payment);
            $this->assertHoldsRole($user, 'comptable');
            $this->takenOrder($locked);
            $next = IntegerAmount::assert($amount);
            if (IntegerAmount::compare($next, '0') === 0 || IntegerAmount::compare($next, (string) $locked->amount_xaf) >= 0) {
                throw new PaymentRuleException('Le montant partiel doit être inférieur au montant actuel et strictement positif.');
            }
            $this->assertWithinOrder($locked, $next);
            $locked->update(['amount_xaf' => $next]);

            return $locked->refresh();
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function prove(User $user, Payment $payment, array $data): Payment
    {
        return DB::transaction(function () use ($user, $payment, $data): Payment {
            $locked = $this->lock($payment);
            $locked->load('workflow.currentStep');
            if ($locked->workflow?->currentStep?->code !== 'execution') {
                throw new PaymentRuleException('La preuve se rattache au moment de l’exécution.');
            }
            $this->assertHoldsRole($user, 'agent_comptable');
            $this->replaceProofs($locked, $data['documents'] ?? []);

            return $locked->refresh();
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function openPartial(User $user, PaymentOrder $order, array $data, string $idempotencyKey): Payment
    {
        return DB::transaction(function () use ($user, $order, $data, $idempotencyKey): Payment {
            $this->assertHoldsRole($user, 'comptable');
            $lockedOrder = PaymentOrder::query()->whereKey($order->id)->lockForUpdate()->firstOrFail();
            if ($lockedOrder->status !== 'taken_in_charge') {
                throw new PaymentRuleException('Un paiement exige un ordonnancement pris en charge.');
            }

            $key = IdempotencyKey::query()->where('key', 'PAI-PARTIAL:'.$idempotencyKey)->first();
            if ($key !== null) {
                return Payment::query()->findOrFail($key->aggregate_id);
            }

            $amount = IntegerAmount::assert((string) $data['amount_xaf']);
            $probe = new Payment([
                'payment_order_id' => $lockedOrder->id,
                'amount_xaf' => '0',
            ]);
            $probe->id = '00000000-0000-0000-0000-000000000000';
            $this->assertWithinOrder($probe, $amount);
            $this->assertInstrumentFree($probe, (string) $data['mode'], (string) $data['instrument_reference']);

            $lockedOrder->load('fiscalYear');
            $rank = Payment::query()->where('payment_order_id', $lockedOrder->id)->count() + 1;
            $payment = Payment::query()->create([
                'payment_order_id' => $lockedOrder->id,
                'liquidation_id' => $lockedOrder->liquidation_id,
                'commitment_id' => $lockedOrder->commitment_id,
                'fiscal_year_id' => $lockedOrder->fiscal_year_id,
                'reference' => $this->allocator->next('PAI', $lockedOrder->fiscalYear),
                'status' => 'generated',
                'rank' => $rank,
                'amount_xaf' => $amount,
                'mode' => $data['mode'],
                'instrument_reference' => trim((string) $data['instrument_reference']),
                'value_on' => $data['value_on'],
                'beneficiary_label' => $lockedOrder->beneficiary_label,
            ]);
            $this->workflow->start($payment);
            IdempotencyKey::query()->create([
                'key' => 'PAI-PARTIAL:'.$idempotencyKey,
                'aggregate_type' => Payment::class,
                'aggregate_id' => $payment->id,
            ]);

            return $payment->refresh();
        });
    }

    public function transition(User $user, Payment $payment, string $action, ?string $reason): Payment
    {
        return DB::transaction(function () use ($user, $payment, $action, $reason): Payment {
            $locked = $this->lock($payment);
            if (in_array($locked->status, ['executed', 'rejected', 'blocked', 'cancelled'], true)) {
                throw new PaymentRuleException('Ce paiement n’accepte plus de transition.');
            }
            $this->takenOrder($locked);

            $instance = WorkflowInstance::query()->whereKey($locked->workflow_instance_id)->lockForUpdate()->firstOrFail();
            $instance->load('currentStep');
            $transition = WorkflowTransition::query()
                ->where('workflow_definition_id', $instance->workflow_definition_id)
                ->where('from_step_id', $instance->current_step_id)
                ->where('action', $action)
                ->first();

            if ($transition === null) {
                throw new PaymentRuleException('Cette action n’est pas disponible à l’étape actuelle.');
            }
            if ($transition->requires_reason && ($reason === null || trim($reason) === '')) {
                throw new PaymentRuleException('Le retour ou le rejet exige un motif.');
            }

            $step = $instance->currentStep;
            if ($step->actor_kind === 'role') {
                $this->assertHoldsRole($user, (string) $step->actor_role_code);
                $this->assertSeparation($instance, $user, (string) $step->actor_role_code);
            }
            if ($step->actor_kind === 'system') {
                throw new PaymentRuleException('Cette étape est exécutée par le système.');
            }

            if ($action === 'validate' && $step->code === 'preparation') {
                $this->assertReady($locked);
            }
            if ($action === 'execute') {
                $this->assertWithinOrder($locked, (string) $locked->amount_xaf);
                if (! $locked->documents()->where('kind', 'proof')->where('is_present', true)->exists()) {
                    throw new PaymentRuleException('La preuve de règlement est obligatoire avant l’exécution.');
                }
            }

            $target = $transition->to_step_id === null
                ? null
                : WorkflowStep::query()->findOrFail($transition->to_step_id);

            WorkflowEvent::query()->create([
                'workflow_instance_id' => $instance->id,
                'actor_id' => $user->id,
                'actor_role_code' => $step->actor_role_code,
                'action' => $action,
                'from_step_id' => $step->id,
                'to_step_id' => $target?->id,
                'reason' => $reason,
            ]);
            $this->closeTasks($locked);

            if ($action === 'reject') {
                $locked->update(['status' => 'rejected']);
                $instance->update(['status' => 'closed']);

                return $locked->refresh();
            }

            if ($target === null) {
                throw new PaymentRuleException('La transition n’a pas d’étape cible.');
            }

            $instance->update([
                'current_step_id' => $target->id,
                'status' => $target->code === 'resultat' ? 'closed' : 'open',
            ]);
            $locked->update(['status' => $this->statusFor($action, $target)]);
            if ($target->code !== 'resultat') {
                $this->openTask($locked, $instance, $target);
            }

            return $locked->refresh();
        });
    }

    /**
     * @return array{paid_xaf: string, remainder_xaf: string}
     */
    public function figures(Payment $payment): array
    {
        $order = $payment->relationLoaded('paymentOrder')
            ? $payment->paymentOrder
            : $payment->paymentOrder()->firstOrFail();

        return [
            'paid_xaf' => $this->sum($order, true, null),
            'remainder_xaf' => IntegerAmount::subtract((string) $order->amount_xaf, $this->sum($order, false, null)),
        ];
    }

    private function assertReady(Payment $payment): void
    {
        if (! in_array($payment->mode, ['virement', 'cheque', 'caisse'], true) || $payment->instrument_reference === null || trim($payment->instrument_reference) === '' || $payment->value_on === null) {
            throw new PaymentRuleException('Le mode, la référence d’instrument et la date de valeur sont obligatoires.');
        }
        $this->assertWithinOrder($payment, (string) $payment->amount_xaf);
        $this->assertInstrumentFree($payment, (string) $payment->mode, (string) $payment->instrument_reference);
    }

    private function assertWithinOrder(Payment $payment, string $amount): void
    {
        $order = PaymentOrder::query()->whereKey($payment->payment_order_id)->lockForUpdate()->firstOrFail();
        $total = IntegerAmount::add($this->sum($order, false, $payment->id), $amount);
        if (IntegerAmount::compare($total, (string) $order->amount_xaf) > 0) {
            throw new PaymentRuleException('Le cumul payé dépasse l’ordonnancement pris en charge.');
        }
    }

    private function assertInstrumentFree(Payment $payment, string $mode, string $reference): void
    {
        $duplicate = Payment::query()
            ->where('mode', $mode)
            ->where('instrument_reference', trim($reference))
            ->whereNotIn('status', ['cancelled'])
            ->when($payment->id !== null, fn ($query) => $query->where('id', '!=', $payment->id))
            ->exists();

        if ($duplicate) {
            throw new PaymentRuleException('Cette référence de virement, de chèque ou de caisse est déjà utilisée.');
        }
    }

    private function sum(PaymentOrder $order, bool $executedOnly, ?string $exceptId): string
    {
        $rows = Payment::query()
            ->where('payment_order_id', $order->id)
            ->when($executedOnly, fn ($query) => $query->where('status', 'executed'))
            ->when(! $executedOnly, fn ($query) => $query->whereNotIn('status', ['rejected', 'blocked', 'cancelled']))
            ->when($exceptId !== null, fn ($query) => $query->where('id', '!=', $exceptId))
            ->pluck('amount_xaf');

        $total = '0';
        foreach ($rows as $amount) {
            $total = IntegerAmount::add($total, (string) $amount);
        }

        return $total;
    }

    private function takenOrder(Payment $payment): PaymentOrder
    {
        $order = PaymentOrder::query()->whereKey($payment->payment_order_id)->lockForUpdate()->firstOrFail();
        if ($order->status !== 'taken_in_charge') {
            throw new PaymentRuleException('Un paiement exige un ordonnancement pris en charge.');
        }

        return $order;
    }

    /**
     * @param  list<array<string, mixed>>  $documents
     */
    private function replaceProofs(Payment $payment, array $documents): void
    {
        PaymentDocument::query()->where('payment_id', $payment->id)->where('kind', 'proof')->delete();
        foreach ($documents as $document) {
            if ($document['kind'] !== 'proof') {
                throw new PaymentRuleException('Seule la preuve de règlement est attendue à l’exécution.');
            }
            PaymentDocument::query()->create([
                'payment_id' => $payment->id,
                'kind' => 'proof',
                'label' => $document['label'],
                'is_present' => (bool) $document['is_present'],
            ]);
        }
    }

    private function lock(Payment $payment): Payment
    {
        return Payment::query()->whereKey($payment->id)->lockForUpdate()->firstOrFail();
    }

    private function lockOnPreparation(Payment $payment): Payment
    {
        $locked = $this->lock($payment);
        $locked->load('workflow.currentStep');
        if ($locked->workflow?->currentStep?->code !== 'preparation') {
            throw new PaymentRuleException('Le paiement ne se prépare plus à cette étape.');
        }

        return $locked;
    }

    private function assertHoldsRole(User $user, string $role): void
    {
        if (! in_array($role, $user->activeRoleCodes(), true)) {
            throw new PaymentRuleException('Cette étape attend la fonction '.$role.'.');
        }
    }

    private function assertSeparation(WorkflowInstance $instance, User $user, string $role): void
    {
        $previous = WorkflowEvent::query()
            ->where('workflow_instance_id', $instance->id)
            ->where('actor_id', $user->id)
            ->pluck('actor_role_code')
            ->filter()
            ->all();
        $conflicts = $this->segregation->dossierConflicts([...$previous, $role]);
        if ($conflicts !== []) {
            throw new PaymentRuleException('Séparation des fonctions : '.implode(', ', $conflicts));
        }
    }

    private function statusFor(string $action, WorkflowStep $target): string
    {
        if ($action === 'return') {
            return 'returned';
        }

        return match ($target->code) {
            'preparation' => 'in_preparation',
            'controle' => 'at_chief',
            'autorisation' => 'to_authorize',
            'execution' => 'authorized',
            'resultat' => 'executed',
            default => 'in_validation',
        };
    }

    private function closeTasks(Payment $payment): void
    {
        Task::query()
            ->where('workflow_instance_id', $payment->workflow_instance_id)
            ->where('status', 'open')
            ->update(['status' => 'done', 'completed_at' => now()]);
    }

    private function openTask(Payment $payment, WorkflowInstance $instance, WorkflowStep $step): void
    {
        if ($step->actor_kind !== 'role' || $step->actor_role_code === null) {
            return;
        }

        $needRequestId = $payment->paymentOrder()->firstOrFail()->liquidation()->firstOrFail()->need_request_id;
        Task::query()->create([
            'need_request_id' => $needRequestId,
            'workflow_instance_id' => $instance->id,
            'assignee_role_code' => $step->actor_role_code,
            'title' => $payment->reference.' — '.$step->label,
            'status' => 'open',
        ]);
    }
}
