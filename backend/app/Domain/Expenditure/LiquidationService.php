<?php

namespace App\Domain\Expenditure;

use App\Domain\Identity\SegregationOfDuties;
use App\Domain\Money\IntegerAmount;
use App\Domain\Referentials\NumberSequenceAllocator;
use App\Exceptions\LiquidationRuleException;
use App\Models\Commitment;
use App\Models\IdempotencyKey;
use App\Models\Liquidation;
use App\Models\LiquidationDocument;
use App\Models\PaymentOrder;
use App\Models\Task;
use App\Models\User;
use App\Models\WorkflowEvent;
use App\Models\WorkflowInstance;
use App\Models\WorkflowStep;
use App\Models\WorkflowTransition;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class LiquidationService
{
    public function __construct(
        private readonly EngagementService $engagements,
        private readonly SegregationOfDuties $segregation,
        private readonly NumberSequenceAllocator $allocator,
        private readonly LiquidationWorkflow $workflow,
        private readonly OrdonnancementWorkflow $ordonnancementWorkflow,
        private readonly OrdonnancementService $ordonnancement,
    ) {}

    /**
     * @param  array<string, mixed>  $data
     */
    public function state(User $user, Liquidation $liquidation, array $data): Liquidation
    {
        return DB::transaction(function () use ($user, $liquidation, $data): Liquidation {
            $locked = $this->lock($liquidation);
            $locked->load('workflow.currentStep');
            if ($locked->workflow?->currentStep?->code !== 'preparation') {
                throw new LiquidationRuleException('Le décompte ne se modifie plus après la préparation.');
            }
            $this->assertHoldsRole($user, 'initiateur');

            $amounts = $this->netFrom($data);
            $this->assertWithinCommitment($locked, $amounts['net']);
            $this->assertInvoiceFree($locked, (string) $data['supplier_label'], (string) $data['invoice_number']);

            $locked->update([
                'gross_amount_xaf' => $amounts['gross'],
                'tax_xaf' => $amounts['tax'],
                'withholding_xaf' => $amounts['withholding'],
                'penalty_xaf' => $amounts['penalty'],
                'advance_xaf' => $amounts['advance'],
                'amount_xaf' => $amounts['net'],
                'deduction_reason' => $data['deduction_reason'] ?? null,
                'invoice_number' => trim((string) $data['invoice_number']),
                'invoice_on' => $data['invoice_on'],
                'supplier_label' => trim((string) $data['supplier_label']),
            ]);
            $this->replaceDocuments($locked, $data['documents'] ?? [], ['invoice', 'reception_report']);

            return $locked->refresh();
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function certify(User $user, Liquidation $liquidation, array $data): Liquidation
    {
        return DB::transaction(function () use ($user, $liquidation, $data): Liquidation {
            $locked = $this->lock($liquidation);
            $locked->load('workflow.currentStep');
            if ($locked->workflow?->currentStep?->code !== 'service_fait') {
                throw new LiquidationRuleException('La certification du service fait n’est pas ouverte.');
            }
            $this->assertHoldsRole($user, 'certificateur_service_fait');

            $locked->update([
                'service_done_on' => $data['service_done_on'],
                'certification_note' => trim((string) $data['certification_note']),
            ]);
            $this->replaceDocuments($locked, $data['documents'] ?? [], ['service_fait']);

            return $locked->refresh();
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function openPartial(User $user, Commitment $commitment, array $data, string $idempotencyKey): Liquidation
    {
        return DB::transaction(function () use ($user, $commitment, $data, $idempotencyKey): Liquidation {
            $this->assertHoldsRole($user, 'initiateur');
            $lockedCommitment = Commitment::query()->whereKey($commitment->id)->lockForUpdate()->firstOrFail();
            if ($lockedCommitment->status !== 'vised') {
                throw new LiquidationRuleException('Une liquidation exige un engagement visé.');
            }

            $key = IdempotencyKey::query()->where('key', 'LIQ-PARTIAL:'.$idempotencyKey)->first();
            if ($key !== null) {
                return Liquidation::query()->findOrFail($key->aggregate_id);
            }

            $amounts = $this->netFrom($data);
            $probe = new Liquidation([
                'commitment_id' => $lockedCommitment->id,
                'fiscal_year_id' => $lockedCommitment->fiscal_year_id,
                'amount_xaf' => '0',
            ]);
            $probe->id = '00000000-0000-0000-0000-000000000000';
            $this->assertWithinCommitment($probe, $amounts['net']);
            $this->assertInvoiceFree($probe, (string) $data['supplier_label'], (string) $data['invoice_number']);

            $lockedCommitment->load('fiscalYear');
            $rank = Liquidation::query()->where('commitment_id', $lockedCommitment->id)->count() + 1;
            $liquidation = Liquidation::query()->create([
                'commitment_id' => $lockedCommitment->id,
                'need_request_id' => $lockedCommitment->need_request_id,
                'fiscal_year_id' => $lockedCommitment->fiscal_year_id,
                'reference' => $this->allocator->next('LIQ', $lockedCommitment->fiscalYear),
                'status' => 'generated',
                'rank' => $rank,
                'gross_amount_xaf' => $amounts['gross'],
                'tax_xaf' => $amounts['tax'],
                'withholding_xaf' => $amounts['withholding'],
                'penalty_xaf' => $amounts['penalty'],
                'advance_xaf' => $amounts['advance'],
                'amount_xaf' => $amounts['net'],
                'deduction_reason' => $data['deduction_reason'] ?? null,
                'invoice_number' => trim((string) $data['invoice_number']),
                'invoice_on' => $data['invoice_on'],
                'supplier_label' => trim((string) $data['supplier_label']),
            ]);
            $this->replaceDocuments($liquidation, $data['documents'] ?? [], ['invoice', 'reception_report']);
            $this->workflow->start($liquidation);
            IdempotencyKey::query()->create([
                'key' => 'LIQ-PARTIAL:'.$idempotencyKey,
                'aggregate_type' => Liquidation::class,
                'aggregate_id' => $liquidation->id,
            ]);

            return $liquidation->refresh();
        });
    }

    public function transition(User $user, Liquidation $liquidation, string $action, ?string $reason): Liquidation
    {
        return DB::transaction(function () use ($user, $liquidation, $action, $reason): Liquidation {
            $locked = $this->lock($liquidation);
            if (in_array($locked->status, ['vised', 'visa_refused', 'cancelled'], true)) {
                throw new LiquidationRuleException('Cette liquidation n’accepte plus de transition.');
            }

            $instance = WorkflowInstance::query()->whereKey($locked->workflow_instance_id)->lockForUpdate()->firstOrFail();
            $instance->load('currentStep');
            $transition = WorkflowTransition::query()
                ->where('workflow_definition_id', $instance->workflow_definition_id)
                ->where('from_step_id', $instance->current_step_id)
                ->where('action', $action)
                ->first();

            if ($transition === null) {
                throw new LiquidationRuleException('Cette action n’est pas disponible à l’étape actuelle.');
            }
            if ($transition->requires_reason && ($reason === null || trim($reason) === '')) {
                throw new LiquidationRuleException('Le retour ou le refus exige un motif.');
            }

            $step = $instance->currentStep;
            if ($step->actor_kind === 'role') {
                $this->assertHoldsRole($user, (string) $step->actor_role_code);
                $this->assertSeparation($instance, $user, (string) $step->actor_role_code);
            }

            if ($action === 'validate' && $step->code === 'preparation') {
                $this->assertReadyForService($locked);
            }
            if ($action === 'certify') {
                $this->assertServiceCertified($locked);
            }

            $target = $transition->to_step_id === null
                ? null
                : WorkflowStep::query()->findOrFail($transition->to_step_id);

            if ($transition->effect === 'create_ord') {
                $this->assertWithinCommitment($locked, (string) $locked->amount_xaf);
                $this->openPaymentOrder($locked);
            }

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
                throw new LiquidationRuleException('La transition n’a pas d’étape cible.');
            }

            $instance->update([
                'current_step_id' => $target->id,
                'status' => $target->code === 'cloture' ? 'closed' : 'open',
            ]);
            $locked->update(['status' => $this->statusFor($action, $target)]);
            if ($target->code !== 'cloture') {
                $this->openTask($locked, $instance, $target);
            }

            return $locked->refresh();
        });
    }

    /**
     * @return array{net_xaf: string, liquidated_xaf: string, remainder_xaf: string}
     */
    public function figures(Liquidation $liquidation): array
    {
        $commitment = $liquidation->relationLoaded('commitment')
            ? $liquidation->commitment
            : $liquidation->commitment()->firstOrFail();
        $committed = $this->engagements->figures($commitment)['committed_xaf'];

        return [
            'net_xaf' => (string) $liquidation->amount_xaf,
            'liquidated_xaf' => $this->sum($commitment, true, null),
            'remainder_xaf' => IntegerAmount::subtract($committed, $this->sum($commitment, false, null)),
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     * @return array{gross: string, tax: string, withholding: string, penalty: string, advance: string, net: string}
     */
    private function netFrom(array $data): array
    {
        $gross = IntegerAmount::assert((string) $data['gross_amount_xaf']);
        $tax = IntegerAmount::assert((string) ($data['tax_xaf'] ?? '0'));
        $withholding = IntegerAmount::assert((string) ($data['withholding_xaf'] ?? '0'));
        $penalty = IntegerAmount::assert((string) ($data['penalty_xaf'] ?? '0'));
        $advance = IntegerAmount::assert((string) ($data['advance_xaf'] ?? '0'));
        if (IntegerAmount::compare($gross, '0') === 0) {
            throw new LiquidationRuleException('Le montant brut doit être strictement positif.');
        }

        $deductions = IntegerAmount::add(IntegerAmount::add($tax, $withholding), IntegerAmount::add($penalty, $advance));
        if (IntegerAmount::compare($deductions, '0') > 0 && trim((string) ($data['deduction_reason'] ?? '')) === '') {
            throw new LiquidationRuleException('Toute taxe, retenue, pénalité ou avance doit être justifiée.');
        }

        try {
            $net = IntegerAmount::subtract($gross, $deductions);
        } catch (InvalidArgumentException) {
            throw new LiquidationRuleException('Le montant net ne peut pas être négatif.');
        }

        return [
            'gross' => $gross,
            'tax' => $tax,
            'withholding' => $withholding,
            'penalty' => $penalty,
            'advance' => $advance,
            'net' => $net,
        ];
    }

    private function assertWithinCommitment(Liquidation $liquidation, string $net): void
    {
        $commitment = Commitment::query()->whereKey($liquidation->commitment_id)->lockForUpdate()->firstOrFail();
        if ($commitment->status !== 'vised') {
            throw new LiquidationRuleException('Une liquidation exige un engagement visé.');
        }

        $committed = $this->engagements->figures($commitment)['committed_xaf'];
        $total = IntegerAmount::add($this->sum($commitment, false, $liquidation->id), $net);
        if (IntegerAmount::compare($total, $committed) > 0) {
            throw new LiquidationRuleException('Le cumul liquidé dépasse l’engagement net.');
        }
    }

    private function assertInvoiceFree(Liquidation $liquidation, string $supplier, string $number): void
    {
        $supplier = trim($supplier);
        $number = trim($number);
        $duplicate = Liquidation::query()
            ->where('fiscal_year_id', $liquidation->fiscal_year_id)
            ->where('supplier_label', $supplier)
            ->where('invoice_number', $number)
            ->whereNotIn('status', ['visa_refused', 'cancelled'])
            ->when($liquidation->id !== null, fn ($query) => $query->where('id', '!=', $liquidation->id))
            ->exists();

        if ($duplicate) {
            throw new LiquidationRuleException('Cette facture est déjà rattachée à une liquidation du même fournisseur pour cet exercice.');
        }
    }

    private function assertReadyForService(Liquidation $liquidation): void
    {
        if ($liquidation->invoice_number === null || trim($liquidation->invoice_number) === '' || $liquidation->invoice_on === null || $liquidation->supplier_label === null) {
            throw new LiquidationRuleException('La facture, sa date et le fournisseur sont obligatoires.');
        }
        $this->assertWithinCommitment($liquidation, (string) $liquidation->amount_xaf);
        if (! $this->hasPresentDocument($liquidation, 'invoice')) {
            throw new LiquidationRuleException('La pièce de facture doit être présente.');
        }
    }

    private function assertServiceCertified(Liquidation $liquidation): void
    {
        if ($liquidation->service_done_on === null || trim((string) $liquidation->certification_note) === '') {
            throw new LiquidationRuleException('La date et le commentaire de certification du service fait sont obligatoires.');
        }
        if (! $this->hasPresentDocument($liquidation, 'service_fait')) {
            throw new LiquidationRuleException('L’attestation de service fait doit être présente.');
        }
    }

    private function hasPresentDocument(Liquidation $liquidation, string $kind): bool
    {
        return $liquidation->documents()
            ->where('kind', $kind)
            ->where('is_present', true)
            ->exists();
    }

    private function openPaymentOrder(Liquidation $liquidation): void
    {
        if (PaymentOrder::query()->where('liquidation_id', $liquidation->id)->exists()) {
            return;
        }

        $liquidation->update(['status' => 'vised']);
        $liquidation->load('fiscalYear');
        $order = PaymentOrder::query()->create([
            'liquidation_id' => $liquidation->id,
            'commitment_id' => $liquidation->commitment_id,
            'fiscal_year_id' => $liquidation->fiscal_year_id,
            'reference' => $this->allocator->next('ORD', $liquidation->fiscalYear),
            'status' => 'generated',
            'rank' => 1,
            'amount_xaf' => (string) $liquidation->amount_xaf,
            'beneficiary_label' => $liquidation->supplier_label,
        ]);
        $this->ordonnancementWorkflow->start($order);
        $this->ordonnancement->present($order);
        IdempotencyKey::query()->create([
            'key' => 'ORD-FROM-LIQ:'.$liquidation->id,
            'aggregate_type' => PaymentOrder::class,
            'aggregate_id' => $order->id,
        ]);
    }

    private function sum(Commitment $commitment, bool $visedOnly, ?string $exceptId): string
    {
        $rows = Liquidation::query()
            ->where('commitment_id', $commitment->id)
            ->when($visedOnly, fn ($query) => $query->where('status', 'vised'))
            ->when(! $visedOnly, fn ($query) => $query->whereNotIn('status', ['visa_refused', 'cancelled']))
            ->when($exceptId !== null, fn ($query) => $query->where('id', '!=', $exceptId))
            ->pluck('amount_xaf');

        $total = '0';
        foreach ($rows as $amount) {
            $total = IntegerAmount::add($total, (string) $amount);
        }

        return $total;
    }

    /**
     * @param  list<array<string, mixed>>  $documents
     * @param  list<string>  $kinds
     */
    private function replaceDocuments(Liquidation $liquidation, array $documents, array $kinds): void
    {
        LiquidationDocument::query()
            ->where('liquidation_id', $liquidation->id)
            ->whereIn('kind', $kinds)
            ->delete();

        foreach ($documents as $document) {
            if (! in_array($document['kind'], $kinds, true)) {
                throw new LiquidationRuleException('Ce type de pièce n’est pas attendu à cette étape.');
            }
            LiquidationDocument::query()->create([
                'liquidation_id' => $liquidation->id,
                'kind' => $document['kind'],
                'label' => $document['label'],
                'is_present' => (bool) $document['is_present'],
            ]);
        }
    }

    private function lock(Liquidation $liquidation): Liquidation
    {
        return Liquidation::query()->whereKey($liquidation->id)->lockForUpdate()->firstOrFail();
    }

    private function assertHoldsRole(User $user, string $role): void
    {
        if (! in_array($role, $user->activeRoleCodes(), true)) {
            throw new LiquidationRuleException('Cette étape attend la fonction '.$role.'.');
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
            throw new LiquidationRuleException('Séparation des fonctions : '.implode(', ', $conflicts));
        }
    }

    private function statusFor(string $action, WorkflowStep $target): string
    {
        if ($action === 'return') {
            return 'returned';
        }

        return match ($target->code) {
            'preparation' => 'in_preparation',
            'service_fait' => 'service_to_certify',
            'visa' => 'submitted',
            'cloture' => 'vised',
            default => 'in_validation',
        };
    }

    private function closeTasks(Liquidation $liquidation): void
    {
        Task::query()
            ->where('workflow_instance_id', $liquidation->workflow_instance_id)
            ->where('status', 'open')
            ->update(['status' => 'done', 'completed_at' => now()]);
    }

    private function openTask(Liquidation $liquidation, WorkflowInstance $instance, WorkflowStep $step): void
    {
        if ($step->actor_kind !== 'role' || $step->actor_role_code === null) {
            return;
        }

        Task::query()->create([
            'need_request_id' => $liquidation->need_request_id,
            'workflow_instance_id' => $instance->id,
            'assignee_role_code' => $step->actor_role_code,
            'title' => $liquidation->reference.' — '.$step->label,
            'status' => 'open',
        ]);
    }
}
