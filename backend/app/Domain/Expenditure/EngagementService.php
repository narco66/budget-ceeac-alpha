<?php

namespace App\Domain\Expenditure;

use App\Domain\Budget\BudgetBalance;
use App\Domain\Documents\OfficialPdfPublisher;
use App\Domain\Identity\SegregationOfDuties;
use App\Domain\Money\IntegerAmount;
use App\Domain\Referentials\NumberSequenceAllocator;
use App\Exceptions\EngagementRuleException;
use App\Models\BudgetEvent;
use App\Models\BudgetLine;
use App\Models\Commitment;
use App\Models\IdempotencyKey;
use App\Models\Liquidation;
use App\Models\NeedRequest;
use App\Models\Task;
use App\Models\User;
use App\Models\WorkflowEvent;
use App\Models\WorkflowInstance;
use App\Models\WorkflowStep;
use App\Models\WorkflowTransition;
use Illuminate\Support\Facades\DB;

class EngagementService
{
    public function __construct(
        private readonly BudgetBalance $balance,
        private readonly SegregationOfDuties $segregation,
        private readonly NumberSequenceAllocator $allocator,
        private readonly EngagementWorkflow $workflow,
        private readonly LiquidationWorkflow $liquidationWorkflow,
        private readonly OfficialPdfPublisher $pdfs,
    ) {}

    public function reduce(User $user, Commitment $commitment, string $amount): Commitment
    {
        return DB::transaction(function () use ($user, $commitment, $amount): Commitment {
            $locked = $this->lockInstruction($commitment);
            $this->assertHoldsRole($user, 'expert_budget');
            $next = IntegerAmount::assert($amount);
            if (IntegerAmount::compare($next, '0') === 0 || IntegerAmount::compare($next, (string) $locked->amount_xaf) >= 0) {
                throw new EngagementRuleException('Le montant partiel doit être inférieur au montant actuel et strictement positif.');
            }
            $this->assertWithinNeed($locked, $next);
            $locked->update(['amount_xaf' => $next]);

            return $locked->refresh();
        });
    }

    public function openPartial(User $user, NeedRequest $need, string $amount, string $idempotencyKey): Commitment
    {
        return DB::transaction(function () use ($user, $need, $amount, $idempotencyKey): Commitment {
            $this->assertHoldsRole($user, 'expert_budget');
            if ($need->status !== 'validated') {
                throw new EngagementRuleException('Un engagement partiel exige une expression de besoin validée.');
            }

            $key = IdempotencyKey::query()->where('key', 'ENG-PARTIAL:'.$idempotencyKey)->first();
            if ($key !== null) {
                return Commitment::query()->findOrFail($key->aggregate_id);
            }

            $value = IntegerAmount::assert($amount);
            $probe = new Commitment([
                'need_request_id' => $need->id,
                'amount_xaf' => '0',
            ]);
            $probe->id = '00000000-0000-0000-0000-000000000000';
            $this->assertWithinNeed($probe, $value);

            $need->load('fiscalYear');
            $commitment = Commitment::query()->create([
                'need_request_id' => $need->id,
                'fiscal_year_id' => $need->fiscal_year_id,
                'budget_line_id' => $need->budget_line_id,
                'organization_unit_id' => $need->organization_unit_id,
                'reference' => $this->allocator->next('ENG', $need->fiscalYear),
                'status' => 'generated',
                'circuit_code' => $need->circuit_code,
                'object' => $need->object,
                'amount_xaf' => $value,
            ]);
            $this->workflow->start($commitment);
            IdempotencyKey::query()->create([
                'key' => 'ENG-PARTIAL:'.$idempotencyKey,
                'aggregate_type' => Commitment::class,
                'aggregate_id' => $commitment->id,
            ]);

            return $commitment->refresh();
        });
    }

    public function transition(User $user, Commitment $commitment, string $action, ?string $reason): Commitment
    {
        return DB::transaction(function () use ($user, $commitment, $action, $reason): Commitment {
            $locked = Commitment::query()->whereKey($commitment->id)->lockForUpdate()->firstOrFail();
            if (in_array($locked->status, ['vised', 'visa_refused', 'cancelled'], true)) {
                throw new EngagementRuleException('Cet engagement n’accepte plus de transition.');
            }

            $instance = WorkflowInstance::query()->whereKey($locked->workflow_instance_id)->lockForUpdate()->firstOrFail();
            $instance->load('currentStep');
            $transition = WorkflowTransition::query()
                ->where('workflow_definition_id', $instance->workflow_definition_id)
                ->where('from_step_id', $instance->current_step_id)
                ->where('action', $action)
                ->first();

            if ($transition === null) {
                throw new EngagementRuleException('Cette action n’est pas disponible à l’étape actuelle.');
            }
            if ($transition->requires_reason && ($reason === null || trim($reason) === '')) {
                throw new EngagementRuleException('Le retour ou le refus exige un motif.');
            }

            $step = $instance->currentStep;
            if ($step->actor_kind === 'role') {
                $this->assertHoldsRole($user, (string) $step->actor_role_code);
                $this->assertSeparation($instance, (string) $step->actor_role_code);
            }

            $target = $transition->to_step_id === null
                ? null
                : WorkflowStep::query()->findOrFail($transition->to_step_id);

            match ($transition->effect) {
                'reserve_credit' => $this->reserve($locked),
                'release_reservation' => $this->releaseReserve($locked),
                'firm_commitment_and_liq_shell' => $this->firm($locked),
                default => null,
            };

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
                $locked->update(['status' => 'visa_refused']);
                $instance->update(['status' => 'closed']);

                return $locked->refresh();
            }

            if ($target === null) {
                throw new EngagementRuleException('La transition n’a pas d’étape cible.');
            }

            $instance->update([
                'current_step_id' => $target->id,
                'status' => $target->code === 'cloture' ? 'closed' : 'open',
            ]);
            $locked->update(['status' => $this->statusFor($action, $target)]);
            if ($target->code !== 'cloture') {
                $this->openTask($locked, $instance, $target);
            }
            if ($transition->effect === 'firm_commitment_and_liq_shell') {
                $ready = $locked->refresh();
                $this->pdfs->publish($user, $ready, 'eng_bon', 'Bon d’engagement '.$ready->reference);
                $this->pdfs->publish($user, $ready, 'eng_certificat', 'Certificat d’engagement '.$ready->reference);
            }

            return $locked->refresh();
        });
    }

    public function release(User $user, Commitment $commitment, string $amount, string $reason): Commitment
    {
        return DB::transaction(function () use ($user, $commitment, $amount, $reason): Commitment {
            $this->assertHoldsRole($user, 'directeur_budget');
            if (trim($reason) === '') {
                throw new EngagementRuleException('Le dégagement exige un motif.');
            }

            $locked = Commitment::query()->whereKey($commitment->id)->lockForUpdate()->firstOrFail();
            if ($locked->status !== 'vised') {
                throw new EngagementRuleException('Seul un engagement visé peut être dégagé.');
            }

            $value = IntegerAmount::assert($amount);
            $net = $this->netCommitted($locked);
            if (IntegerAmount::compare($value, '0') === 0 || IntegerAmount::compare($value, $net) > 0) {
                throw new EngagementRuleException('Le dégagement dépasse le montant encore engagé.');
            }
            $unliquidated = IntegerAmount::subtract($net, $this->visedLiquidationTotal($locked));
            if (IntegerAmount::compare($value, $unliquidated) > 0) {
                throw new EngagementRuleException('Le dégagement dépasse le montant non encore liquidé.');
            }

            $line = BudgetLine::query()->whereKey($locked->budget_line_id)->lockForUpdate()->firstOrFail();
            BudgetEvent::query()->create([
                'budget_line_id' => $line->id,
                'event_type' => 'release_commit',
                'amount_xaf' => $value,
                'source_type' => Commitment::class,
                'source_id' => $locked->id,
            ]);

            return $locked->refresh();
        });
    }

    /**
     * @return array{reserved_xaf: string, committed_xaf: string, eb_remainder_xaf: string}
     */
    public function figures(Commitment $commitment): array
    {
        $reserved = '0';
        $released = '0';
        $committed = '0';
        $uncommitted = '0';
        $events = $commitment->relationLoaded('sourceBudgetEvents')
            ? $commitment->getRelation('sourceBudgetEvents')
            : BudgetEvent::query()
                ->where('source_type', Commitment::class)
                ->where('source_id', $commitment->id)
                ->get();

        foreach ($events as $event) {
            $amount = IntegerAmount::assert((string) $event->amount_xaf);
            match ($event->event_type) {
                'reserve' => $reserved = IntegerAmount::add($reserved, $amount),
                'release_reserve' => $released = IntegerAmount::add($released, $amount),
                'commit' => $committed = IntegerAmount::add($committed, $amount),
                'release_commit' => $uncommitted = IntegerAmount::add($uncommitted, $amount),
                default => null,
            };
        }

        $need = $commitment->relationLoaded('needRequest')
            ? $commitment->needRequest
            : $commitment->needRequest()->firstOrFail();

        return [
            'reserved_xaf' => IntegerAmount::subtract($reserved, $released),
            'committed_xaf' => IntegerAmount::subtract($committed, $uncommitted),
            'eb_remainder_xaf' => IntegerAmount::subtract((string) $need->amount_xaf, $this->activeTotal($need, null)),
        ];
    }

    private function reserve(Commitment $commitment): void
    {
        $line = BudgetLine::query()->whereKey($commitment->budget_line_id)->lockForUpdate()->firstOrFail();
        $line->load('events');
        $available = $this->balance->forLine($line)['available_xaf'];
        $amount = IntegerAmount::assert((string) $commitment->amount_xaf);
        if (IntegerAmount::compare($amount, $available) > 0) {
            throw new EngagementRuleException('Le montant dépasse le crédit disponible de la ligne.');
        }
        $commitment->load('needRequest');
        $this->assertWithinNeed($commitment, $amount);

        BudgetEvent::query()->create([
            'budget_line_id' => $line->id,
            'event_type' => 'reserve',
            'amount_xaf' => $amount,
            'source_type' => Commitment::class,
            'source_id' => $commitment->id,
        ]);
    }

    private function releaseReserve(Commitment $commitment): void
    {
        $active = $this->figures($commitment)['reserved_xaf'];
        if (IntegerAmount::compare($active, '0') === 0) {
            return;
        }

        BudgetEvent::query()->create([
            'budget_line_id' => $commitment->budget_line_id,
            'event_type' => 'release_reserve',
            'amount_xaf' => $active,
            'source_type' => Commitment::class,
            'source_id' => $commitment->id,
        ]);
    }

    private function firm(Commitment $commitment): void
    {
        $line = BudgetLine::query()->whereKey($commitment->budget_line_id)->lockForUpdate()->firstOrFail();
        $active = $this->figures($commitment)['reserved_xaf'];
        $amount = IntegerAmount::assert((string) $commitment->amount_xaf);
        if (IntegerAmount::compare($active, $amount) !== 0) {
            throw new EngagementRuleException('Le visa exige une réservation égale au montant de l’engagement.');
        }

        BudgetEvent::query()->create([
            'budget_line_id' => $line->id,
            'event_type' => 'release_reserve',
            'amount_xaf' => $active,
            'source_type' => Commitment::class,
            'source_id' => $commitment->id,
        ]);
        BudgetEvent::query()->create([
            'budget_line_id' => $line->id,
            'event_type' => 'commit',
            'amount_xaf' => $amount,
            'source_type' => Commitment::class,
            'source_id' => $commitment->id,
        ]);

        if (Liquidation::query()->where('commitment_id', $commitment->id)->exists()) {
            return;
        }

        $commitment->load('fiscalYear');
        $liquidation = Liquidation::query()->create([
            'commitment_id' => $commitment->id,
            'need_request_id' => $commitment->need_request_id,
            'fiscal_year_id' => $commitment->fiscal_year_id,
            'reference' => $this->allocator->next('LIQ', $commitment->fiscalYear),
            'status' => 'generated',
            'rank' => 1,
            'gross_amount_xaf' => $amount,
            'tax_xaf' => '0',
            'withholding_xaf' => '0',
            'penalty_xaf' => '0',
            'advance_xaf' => '0',
            'amount_xaf' => $amount,
        ]);
        $this->liquidationWorkflow->start($liquidation);
    }

    private function visedLiquidationTotal(Commitment $commitment): string
    {
        $total = '0';
        $rows = Liquidation::query()
            ->where('commitment_id', $commitment->id)
            ->where('status', 'vised')
            ->pluck('amount_xaf');
        foreach ($rows as $amount) {
            $total = IntegerAmount::add($total, (string) $amount);
        }

        return $total;
    }

    private function lockInstruction(Commitment $commitment): Commitment
    {
        $locked = Commitment::query()->whereKey($commitment->id)->lockForUpdate()->firstOrFail();
        $locked->load('workflow.currentStep');
        if ($locked->workflow?->currentStep?->code !== 'instruction') {
            throw new EngagementRuleException('Le montant hérité ne se modifie plus après l’instruction.');
        }

        return $locked;
    }

    private function assertWithinNeed(Commitment $commitment, string $amount): void
    {
        $need = NeedRequest::query()->whereKey($commitment->need_request_id)->lockForUpdate()->firstOrFail();
        $total = IntegerAmount::add($this->activeTotal($need, $commitment->id), $amount);
        if (IntegerAmount::compare($total, (string) $need->amount_xaf) > 0) {
            throw new EngagementRuleException('Le cumul des engagements dépasse le montant de l’expression de besoin.');
        }
    }

    private function activeTotal(NeedRequest $need, ?string $exceptId): string
    {
        if ($exceptId === null && $need->relationLoaded('siblingCommitments')) {
            $rows = $need->getRelation('siblingCommitments')
                ->whereNotIn('status', ['visa_refused', 'cancelled'])
                ->pluck('amount_xaf');
        } else {
            $rows = Commitment::query()
                ->where('need_request_id', $need->id)
                ->whereNotIn('status', ['visa_refused', 'cancelled'])
                ->when($exceptId !== null, fn ($query) => $query->where('id', '!=', $exceptId))
                ->pluck('amount_xaf');
        }

        $total = '0';
        foreach ($rows as $amount) {
            $total = IntegerAmount::add($total, (string) $amount);
        }

        return $total;
    }

    private function netCommitted(Commitment $commitment): string
    {
        return $this->figures($commitment)['committed_xaf'];
    }

    private function assertHoldsRole(User $user, string $role): void
    {
        if (! in_array($role, $user->activeRoleCodes(), true)) {
            throw new EngagementRuleException('Cette étape attend la fonction '.$role.'.');
        }
    }

    private function assertSeparation(WorkflowInstance $instance, string $role): void
    {
        $previous = WorkflowEvent::query()
            ->where('workflow_instance_id', $instance->id)
            ->pluck('actor_role_code')
            ->filter()
            ->all();
        $conflicts = $this->segregation->dossierConflicts([...$previous, $role]);
        if ($conflicts !== []) {
            throw new EngagementRuleException('Séparation des fonctions : '.implode(', ', $conflicts));
        }
    }

    private function statusFor(string $action, WorkflowStep $target): string
    {
        if ($action === 'return') {
            return 'returned';
        }

        return match ($target->code) {
            'instruction' => 'in_instruction',
            'validation_n1' => 'at_n1',
            'validation_budget' => 'at_director',
            'visa' => 'reserved',
            'cloture' => 'vised',
            default => 'in_validation',
        };
    }

    private function closeTasks(Commitment $commitment): void
    {
        Task::query()
            ->where('workflow_instance_id', $commitment->workflow_instance_id)
            ->where('status', 'open')
            ->update(['status' => 'done', 'completed_at' => now()]);
    }

    private function openTask(Commitment $commitment, WorkflowInstance $instance, WorkflowStep $step): void
    {
        if ($step->actor_kind !== 'role' || $step->actor_role_code === null) {
            return;
        }

        Task::query()->create([
            'need_request_id' => $commitment->need_request_id,
            'workflow_instance_id' => $instance->id,
            'assignee_role_code' => $step->actor_role_code,
            'title' => $commitment->reference.' — '.$step->label,
            'status' => 'open',
        ]);
    }
}
