<?php

namespace App\Domain\Expenditure;

use App\Domain\Identity\SegregationOfDuties;
use App\Domain\Money\IntegerAmount;
use App\Domain\Referentials\AuthorizerResolver;
use App\Domain\Referentials\NumberSequenceAllocator;
use App\Exceptions\OrdonnancementRuleException;
use App\Models\FiscalPeriod;
use App\Models\FiscalYear;
use App\Models\IdempotencyKey;
use App\Models\Liquidation;
use App\Models\Payment;
use App\Models\PaymentOrder;
use App\Models\Task;
use App\Models\User;
use App\Models\WorkflowEvent;
use App\Models\WorkflowInstance;
use App\Models\WorkflowStep;
use App\Models\WorkflowTransition;
use Illuminate\Support\Facades\DB;

class OrdonnancementService
{
    public function __construct(
        private readonly AuthorizerResolver $authorizer,
        private readonly SegregationOfDuties $segregation,
        private readonly NumberSequenceAllocator $allocator,
        private readonly OrdonnancementWorkflow $workflow,
        private readonly PaymentWorkflow $paymentWorkflow,
    ) {}

    public function present(PaymentOrder $order): PaymentOrder
    {
        return DB::transaction(function () use ($order): PaymentOrder {
            $locked = $this->lock($order);
            $liquidation = $this->readyLiquidation($locked);
            $parameter = $this->authorizer->applicable($liquidation->service_done_on?->toDateString());
            $role = $this->authorizer->roleCodeForAmount((string) $locked->amount_xaf, $liquidation->service_done_on?->toDateString());

            $locked->update([
                'authorizer_role_code' => $role,
                'threshold_amount_xaf' => (string) $parameter->amount_xaf,
                'threshold_version' => $parameter->version,
                'status' => $role === 'secretaire_general' ? 'to_sign_sg' : 'to_sign_president',
            ]);
            $this->closeTasks($locked);
            $this->openTask($locked->refresh(), $role);

            return $locked->refresh();
        });
    }

    public function reduce(User $user, PaymentOrder $order, string $amount): PaymentOrder
    {
        return DB::transaction(function () use ($user, $order, $amount): PaymentOrder {
            $locked = $this->lockOnSignature($order);
            $this->assertAuthorizer($user, $locked);
            $next = IntegerAmount::assert($amount);
            if (IntegerAmount::compare($next, '0') === 0 || IntegerAmount::compare($next, (string) $locked->amount_xaf) >= 0) {
                throw new OrdonnancementRuleException('Le montant partiel doit être inférieur au montant actuel et strictement positif.');
            }
            $this->assertWithinLiquidation($locked, $next);
            $locked->update(['amount_xaf' => $next]);

            return $this->present($locked->refresh());
        });
    }

    public function openPartial(User $user, Liquidation $liquidation, string $amount, string $idempotencyKey): PaymentOrder
    {
        return DB::transaction(function () use ($user, $liquidation, $amount, $idempotencyKey): PaymentOrder {
            $lockedLiquidation = Liquidation::query()->whereKey($liquidation->id)->lockForUpdate()->firstOrFail();
            $this->readyLiquidation($lockedLiquidation);
            $value = IntegerAmount::assert($amount);
            $role = $this->authorizer->roleCodeForAmount($value, $lockedLiquidation->service_done_on?->toDateString());
            $this->assertHoldsRole($user, $role);

            $key = IdempotencyKey::query()->where('key', 'ORD-PARTIAL:'.$idempotencyKey)->first();
            if ($key !== null) {
                return PaymentOrder::query()->findOrFail($key->aggregate_id);
            }

            $probe = new PaymentOrder([
                'liquidation_id' => $lockedLiquidation->id,
                'amount_xaf' => '0',
            ]);
            $probe->id = '00000000-0000-0000-0000-000000000000';
            $this->assertWithinLiquidation($probe, $value);

            $lockedLiquidation->load('fiscalYear');
            $rank = PaymentOrder::query()->where('liquidation_id', $lockedLiquidation->id)->count() + 1;
            $order = PaymentOrder::query()->create([
                'liquidation_id' => $lockedLiquidation->id,
                'commitment_id' => $lockedLiquidation->commitment_id,
                'fiscal_year_id' => $lockedLiquidation->fiscal_year_id,
                'reference' => $this->allocator->next('ORD', $lockedLiquidation->fiscalYear),
                'status' => 'generated',
                'rank' => $rank,
                'amount_xaf' => $value,
                'beneficiary_label' => $lockedLiquidation->supplier_label,
            ]);
            $this->workflow->start($order);
            IdempotencyKey::query()->create([
                'key' => 'ORD-PARTIAL:'.$idempotencyKey,
                'aggregate_type' => PaymentOrder::class,
                'aggregate_id' => $order->id,
            ]);

            return $this->present($order->refresh());
        });
    }

    public function transition(User $user, PaymentOrder $order, string $action, ?string $reason): PaymentOrder
    {
        return DB::transaction(function () use ($user, $order, $action, $reason): PaymentOrder {
            $locked = $this->lock($order);
            if (in_array($locked->status, ['taken_in_charge', 'rejected', 'cancelled'], true)) {
                throw new OrdonnancementRuleException('Cet ordonnancement n’accepte plus de transition.');
            }

            $instance = WorkflowInstance::query()->whereKey($locked->workflow_instance_id)->lockForUpdate()->firstOrFail();
            $instance->load('currentStep');
            $transition = WorkflowTransition::query()
                ->where('workflow_definition_id', $instance->workflow_definition_id)
                ->where('from_step_id', $instance->current_step_id)
                ->where('action', $action)
                ->first();

            if ($transition === null) {
                throw new OrdonnancementRuleException('Cette action n’est pas disponible à l’étape actuelle.');
            }
            if ($transition->requires_reason && ($reason === null || trim($reason) === '')) {
                throw new OrdonnancementRuleException('Le retour ou le refus exige un motif.');
            }

            $step = $instance->currentStep;
            $this->assertActor($user, $locked, $step);

            if ($action === 'sign') {
                $this->readyLiquidation($locked);
                $this->assertWithinLiquidation($locked, (string) $locked->amount_xaf);
                $locked->update(['signed_on' => now()->toDateString()]);
            }

            $target = $transition->to_step_id === null
                ? null
                : WorkflowStep::query()->findOrFail($transition->to_step_id);

            WorkflowEvent::query()->create([
                'workflow_instance_id' => $instance->id,
                'actor_id' => $user->id,
                'actor_role_code' => $step->actor_kind === 'threshold' ? $locked->authorizer_role_code : $step->actor_role_code,
                'action' => $action,
                'from_step_id' => $step->id,
                'to_step_id' => $target?->id,
                'reason' => $reason,
            ]);
            $this->closeTasks($locked);

            if ($action === 'reject') {
                $locked->update(['status' => 'rejected']);
                $instance->update(['status' => 'closed']);
                $this->blockPayment($locked);

                return $locked->refresh();
            }

            if ($action === 'take') {
                $locked->update(['status' => 'taken_in_charge']);
                $instance->update(['status' => 'closed']);
                $this->markPaymentReady($locked);

                return $locked->refresh();
            }

            if ($target === null) {
                throw new OrdonnancementRuleException('La transition n’a pas d’étape cible.');
            }

            if ($target->code === 'transmission') {
                return $this->transmit($locked, $instance, $target);
            }

            $instance->update([
                'current_step_id' => $target->id,
                'status' => 'open',
            ]);
            $locked->update(['status' => $action === 'return' ? 'returned' : 'in_control']);

            return $locked->refresh();
        });
    }

    /**
     * @return array{remainder_xaf: string}
     */
    public function figures(PaymentOrder $order): array
    {
        $liquidation = $order->relationLoaded('liquidation')
            ? $order->liquidation
            : $order->liquidation()->firstOrFail();

        return [
            'remainder_xaf' => IntegerAmount::subtract((string) $liquidation->amount_xaf, $this->activeTotal($liquidation, null)),
        ];
    }

    private function transmit(PaymentOrder $order, WorkflowInstance $instance, WorkflowStep $transmission): PaymentOrder
    {
        $takeover = WorkflowStep::query()
            ->where('workflow_definition_id', $instance->workflow_definition_id)
            ->where('code', 'prise_en_charge')
            ->firstOrFail();

        WorkflowEvent::query()->create([
            'workflow_instance_id' => $instance->id,
            'actor_id' => null,
            'actor_role_code' => null,
            'action' => 'transmit',
            'from_step_id' => $transmission->id,
            'to_step_id' => $takeover->id,
            'reason' => null,
        ]);
        $instance->update([
            'current_step_id' => $takeover->id,
            'status' => 'open',
        ]);
        $order->update(['status' => 'transmitted']);
        $this->openPayment($order);
        $this->openTask($order->refresh(), 'comptable');

        return $order->refresh();
    }

    private function readyLiquidation(PaymentOrder|Liquidation $subject): Liquidation
    {
        $liquidation = $subject instanceof Liquidation
            ? $subject
            : Liquidation::query()->whereKey($subject->liquidation_id)->lockForUpdate()->firstOrFail();

        if ($liquidation->status !== 'vised') {
            throw new OrdonnancementRuleException('Un ordonnancement exige une liquidation visée.');
        }

        $year = FiscalYear::query()->findOrFail($liquidation->fiscal_year_id);
        if ($year->status !== 'execution') {
            throw new OrdonnancementRuleException('L’exercice n’est pas ouvert à l’exécution.');
        }

        $date = $liquidation->service_done_on?->toDateString();
        $periodOpen = $date !== null && FiscalPeriod::query()
            ->where('fiscal_year_id', $liquidation->fiscal_year_id)
            ->where('status', 'open')
            ->whereDate('starts_on', '<=', $date)
            ->whereDate('ends_on', '>=', $date)
            ->exists();
        if (! $periodOpen) {
            throw new OrdonnancementRuleException('La période du service fait n’est pas ouverte.');
        }

        $invoice = $liquidation->documents()->where('kind', 'invoice')->where('is_present', true)->exists();
        $service = $liquidation->documents()->where('kind', 'service_fait')->where('is_present', true)->exists();
        if (! $invoice || ! $service) {
            throw new OrdonnancementRuleException('La facture et l’attestation de service fait doivent être présentes.');
        }

        return $liquidation;
    }

    private function assertWithinLiquidation(PaymentOrder $order, string $amount): void
    {
        $liquidation = Liquidation::query()->whereKey($order->liquidation_id)->lockForUpdate()->firstOrFail();
        $total = IntegerAmount::add($this->activeTotal($liquidation, $order->id), $amount);
        if (IntegerAmount::compare($total, (string) $liquidation->amount_xaf) > 0) {
            throw new OrdonnancementRuleException('Le cumul ordonnancé dépasse la liquidation visée.');
        }
    }

    private function activeTotal(Liquidation $liquidation, ?string $exceptId): string
    {
        $rows = PaymentOrder::query()
            ->where('liquidation_id', $liquidation->id)
            ->whereNotIn('status', ['rejected', 'cancelled'])
            ->when($exceptId !== null, fn ($query) => $query->where('id', '!=', $exceptId))
            ->pluck('amount_xaf');

        $total = '0';
        foreach ($rows as $amount) {
            $total = IntegerAmount::add($total, (string) $amount);
        }

        return $total;
    }

    private function openPayment(PaymentOrder $order): void
    {
        if (Payment::query()->where('payment_order_id', $order->id)->exists()) {
            return;
        }

        $order->load('fiscalYear');
        $payment = Payment::query()->create([
            'payment_order_id' => $order->id,
            'liquidation_id' => $order->liquidation_id,
            'commitment_id' => $order->commitment_id,
            'fiscal_year_id' => $order->fiscal_year_id,
            'reference' => $this->allocator->next('PAI', $order->fiscalYear),
            'status' => 'generated',
            'rank' => 1,
            'amount_xaf' => (string) $order->amount_xaf,
            'beneficiary_label' => $order->beneficiary_label,
        ]);
        IdempotencyKey::query()->create([
            'key' => 'PAI-FROM-ORD:'.$order->id,
            'aggregate_type' => Payment::class,
            'aggregate_id' => $payment->id,
        ]);
    }

    private function markPaymentReady(PaymentOrder $order): void
    {
        $payment = Payment::query()->where('payment_order_id', $order->id)->where('status', 'generated')->first();
        if ($payment === null) {
            throw new OrdonnancementRuleException('La prise en charge exige un dossier de paiement ouvert à la signature.');
        }
        $this->paymentWorkflow->start($payment);
    }

    private function blockPayment(PaymentOrder $order): void
    {
        Payment::query()->where('payment_order_id', $order->id)->update(['status' => 'blocked']);
    }

    private function assertActor(User $user, PaymentOrder $order, WorkflowStep $step): void
    {
        if ($step->actor_kind === 'pending_assignment') {
            throw new OrdonnancementRuleException('Aucune fonction n’est affectée à la préparation administrative.');
        }
        if ($step->actor_kind === 'system') {
            throw new OrdonnancementRuleException('Cette étape est exécutée par le système.');
        }
        if ($step->actor_kind === 'threshold') {
            $this->assertAuthorizer($user, $order);
            $this->assertSeparation($order, $user, (string) $order->authorizer_role_code);

            return;
        }
        if ($step->actor_kind === 'role') {
            $this->assertHoldsRole($user, (string) $step->actor_role_code);
            $this->assertSeparation($order, $user, (string) $step->actor_role_code);
        }
    }

    private function assertAuthorizer(User $user, PaymentOrder $order): void
    {
        $this->assertHoldsRole($user, (string) $order->authorizer_role_code);
    }

    private function assertHoldsRole(User $user, string $role): void
    {
        if (! in_array($role, $user->activeRoleCodes(), true)) {
            throw new OrdonnancementRuleException('Cette étape attend la fonction '.$role.'.');
        }
    }

    private function assertSeparation(PaymentOrder $order, User $user, string $role): void
    {
        $previous = WorkflowEvent::query()
            ->where('workflow_instance_id', $order->workflow_instance_id)
            ->where('actor_id', $user->id)
            ->pluck('actor_role_code')
            ->filter()
            ->all();
        $conflicts = $this->segregation->dossierConflicts([...$previous, $role]);
        if ($conflicts !== []) {
            throw new OrdonnancementRuleException('Séparation des fonctions : '.implode(', ', $conflicts));
        }
    }

    private function lock(PaymentOrder $order): PaymentOrder
    {
        return PaymentOrder::query()->whereKey($order->id)->lockForUpdate()->firstOrFail();
    }

    private function lockOnSignature(PaymentOrder $order): PaymentOrder
    {
        $locked = $this->lock($order);
        $locked->load('workflow.currentStep');
        if ($locked->workflow?->currentStep?->code !== 'signature') {
            throw new OrdonnancementRuleException('Le montant ne se modifie plus après la signature.');
        }

        return $locked;
    }

    private function closeTasks(PaymentOrder $order): void
    {
        if ($order->workflow_instance_id === null) {
            return;
        }

        Task::query()
            ->where('workflow_instance_id', $order->workflow_instance_id)
            ->where('status', 'open')
            ->update(['status' => 'done', 'completed_at' => now()]);
    }

    private function openTask(PaymentOrder $order, string $role): void
    {
        $liquidation = $order->liquidation()->firstOrFail();
        Task::query()->create([
            'need_request_id' => $liquidation->need_request_id,
            'workflow_instance_id' => $order->workflow_instance_id,
            'assignee_role_code' => $role,
            'title' => $order->reference.' — '.($role === 'comptable' ? 'Prise en charge' : 'Signature de l’ordonnateur'),
            'status' => 'open',
        ]);
    }
}
