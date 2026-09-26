<?php

namespace App\Domain\Expenditure;

use App\Domain\Budget\BudgetBalance;
use App\Domain\Identity\SegregationOfDuties;
use App\Domain\Money\IntegerAmount;
use App\Domain\Referentials\NumberSequenceAllocator;
use App\Exceptions\NeedRuleException;
use App\Models\BudgetLine;
use App\Models\FiscalPeriod;
use App\Models\FiscalYear;
use App\Models\NeedRequest;
use App\Models\OrganizationUnit;
use App\Models\Task;
use App\Models\User;
use App\Models\WorkflowDefinition;
use App\Models\WorkflowEvent;
use App\Models\WorkflowInstance;
use App\Models\WorkflowStep;
use App\Models\WorkflowTransition;
use Illuminate\Support\Facades\DB;

class NeedRequestService
{
    public function __construct(
        private readonly NeedCircuitResolver $circuits,
        private readonly NumberSequenceAllocator $allocator,
        private readonly BudgetBalance $balance,
        private readonly SegregationOfDuties $segregation,
        private readonly CommitmentFromNeed $commitments,
    ) {}

    /**
     * @return array{can_open: bool, reasons: list<string>}
     */
    public function readiness(User $user): array
    {
        $reasons = [];
        $year = FiscalYear::query()->where('is_current', true)->first();

        if ($year === null || $year->status !== 'execution') {
            $reasons[] = 'L’exercice '.($year->year ?? 'courant').' n’est pas ouvert à l’exécution.';
        }

        $executable = BudgetLine::query()
            ->whereHas('version', fn ($query) => $query->where('status', 'executable'))
            ->exists();

        if (! $executable) {
            $reasons[] = 'Aucune ligne budgétaire exécutoire.';
        }

        $roles = $user->activeRoleCodes();
        if (! array_intersect($roles, ['moyens_generaux', 'initiateur'])) {
            $reasons[] = 'Ce compte ne porte pas la fonction d’initiation : Service des moyens généraux, ou initiateur PAP.';
        }

        return [
            'can_open' => $reasons === [],
            'reasons' => $reasons,
        ];
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(User $user, array $data): NeedRequest
    {
        return DB::transaction(function () use ($user, $data): NeedRequest {
            $line = BudgetLine::query()->with('version.fiscalYear')->findOrFail($data['budget_line_id']);
            $unit = OrganizationUnit::query()->findOrFail($data['organization_unit_id']);
            $year = $this->assertLineReady($line, $data['need_on']);
            $circuit = $this->circuits->resolve($line, $unit);
            $this->assertHoldsRole($user, $this->circuits->initiatorRole($circuit));
            $this->assertStructure($line, $unit);

            $normalized = $this->normalizeLines($data['lines'] ?? [], $data['amount_xaf'] ?? null);
            if ($normalized['lines'] === []) {
                throw new NeedRuleException('Une expression de besoin comporte au moins une sous-ligne.');
            }

            $request = NeedRequest::query()->create([
                'fiscal_year_id' => $year->id,
                'budget_line_id' => $line->id,
                'organization_unit_id' => $unit->id,
                'reference' => $this->allocator->next('EB', $year),
                'version_number' => 1,
                'circuit_code' => $circuit,
                'object' => $data['object'],
                'justification' => $data['justification'],
                'amount_xaf' => $normalized['amount'],
                'need_on' => $data['need_on'],
                'status' => 'draft',
            ]);

            $request->lines()->createMany($normalized['lines']);
            $this->storeDocuments($request, $data['documents'] ?? []);
            $this->openInstance($request, $circuit);

            return $request->load(['lines', 'documents', 'workflow.currentStep']);
        });
    }

    public function transition(User $user, NeedRequest $request, string $action, ?string $reason): NeedRequest
    {
        return DB::transaction(function () use ($user, $request, $action, $reason): NeedRequest {
            $locked = NeedRequest::query()->whereKey($request->id)->lockForUpdate()->firstOrFail();
            if (in_array($locked->status, ['validated', 'rejected', 'replaced', 'cancelled'], true)) {
                throw new NeedRuleException('Ce dossier n’accepte plus de transition.');
            }

            $instance = WorkflowInstance::query()->whereKey($locked->workflow_instance_id)->lockForUpdate()->firstOrFail();
            $instance->load('currentStep');
            $transition = WorkflowTransition::query()
                ->where('workflow_definition_id', $instance->workflow_definition_id)
                ->where('from_step_id', $instance->current_step_id)
                ->where('action', $action)
                ->first();

            if ($transition === null) {
                throw new NeedRuleException('Cette action n’est pas disponible à l’étape actuelle.');
            }
            if ($transition->requires_reason && ($reason === null || trim($reason) === '')) {
                throw new NeedRuleException('Le retour ou le rejet exige un motif.');
            }

            $step = $instance->currentStep;
            if ($step->actor_kind === 'role') {
                $this->assertHoldsRole($user, (string) $step->actor_role_code);
                $this->assertSeparation($instance, (string) $step->actor_role_code);
            }

            if ($action === 'submit') {
                $this->assertReadyToSubmit($locked);
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

                return $locked->refresh()->load(['lines', 'documents', 'workflow.currentStep', 'commitment']);
            }

            if ($target === null) {
                throw new NeedRuleException('La transition n’a pas d’étape cible.');
            }

            $instance->update(['current_step_id' => $target->id]);

            if ($target->code === 'cloture') {
                $this->commitments->generate($locked->refresh());
                $locked->update(['status' => 'validated']);
                $instance->update(['status' => 'closed']);
            } elseif ($action === 'return') {
                $locked->update(['status' => 'returned']);
                $this->openTask($locked, $instance, $target);
            } else {
                $locked->update(['status' => 'in_validation']);
                $this->openTask($locked, $instance, $target);
            }

            return $locked->refresh()->load(['lines', 'documents', 'workflow.currentStep', 'commitment']);
        });
    }

    public function revise(User $user, NeedRequest $request): NeedRequest
    {
        return DB::transaction(function () use ($user, $request): NeedRequest {
            $locked = NeedRequest::query()->whereKey($request->id)->lockForUpdate()->firstOrFail();
            if ($locked->status !== 'validated') {
                throw new NeedRuleException('Seule une expression validée peut faire l’objet d’une nouvelle version.');
            }

            $this->assertHoldsRole($user, $this->circuits->initiatorRole($locked->circuit_code));
            $locked->load(['lines', 'documents', 'fiscalYear']);

            $copy = NeedRequest::query()->create([
                'fiscal_year_id' => $locked->fiscal_year_id,
                'budget_line_id' => $locked->budget_line_id,
                'organization_unit_id' => $locked->organization_unit_id,
                'parent_id' => $locked->id,
                'reference' => $this->allocator->next('EB', $locked->fiscalYear),
                'version_number' => $locked->version_number + 1,
                'circuit_code' => $locked->circuit_code,
                'object' => $locked->object,
                'justification' => $locked->justification,
                'amount_xaf' => $locked->amount_xaf,
                'need_on' => $locked->need_on,
                'status' => 'draft',
            ]);

            foreach ($locked->lines as $line) {
                $copy->lines()->create([
                    'position' => $line->position,
                    'designation' => $line->designation,
                    'quantity' => $line->quantity,
                    'unit' => $line->unit,
                    'unit_price_xaf' => $line->unit_price_xaf,
                    'amount_xaf' => $line->amount_xaf,
                ]);
            }
            foreach ($locked->documents as $document) {
                $copy->documents()->create([
                    'kind' => $document->kind,
                    'label' => $document->label,
                    'is_present' => $document->is_present,
                ]);
            }

            $locked->update(['status' => 'replaced']);
            $this->closeTasks($locked);
            $this->openInstance($copy, $copy->circuit_code);

            return $copy->load(['lines', 'documents', 'workflow.currentStep']);
        });
    }

    private function assertLineReady(BudgetLine $line, string $needOn): FiscalYear
    {
        if ($line->version?->status !== 'executable') {
            throw new NeedRuleException('La ligne budgétaire n’est pas exécutoire.');
        }

        $year = $line->version->fiscalYear;
        if ($year === null || $year->status !== 'execution') {
            throw new NeedRuleException('L’exercice n’est pas ouvert à l’exécution.');
        }

        $period = FiscalPeriod::query()
            ->where('fiscal_year_id', $year->id)
            ->whereDate('starts_on', '<=', $needOn)
            ->whereDate('ends_on', '>=', $needOn)
            ->first();

        if ($period === null || $period->status !== 'open') {
            throw new NeedRuleException('La période de ce besoin n’est pas ouverte.');
        }

        return $year;
    }

    private function assertHoldsRole(User $user, string $role): void
    {
        if (! in_array($role, $user->activeRoleCodes(), true)) {
            throw new NeedRuleException('Cette étape attend la fonction '.$role.'.');
        }
    }

    private function assertStructure(BudgetLine $line, OrganizationUnit $unit): void
    {
        if (! $unit->is_active) {
            throw new NeedRuleException('La structure n’est pas active.');
        }
        if ($line->organization_unit_id === null) {
            return;
        }

        $current = $unit;
        $guard = 0;
        while ($current !== null && $guard < 30) {
            if ($current->id === $line->organization_unit_id) {
                return;
            }
            $current = $current->parent;
            $guard++;
        }

        throw new NeedRuleException('Cette structure n’est pas autorisée à consommer la ligne.');
    }

    /**
     * @param  list<array<string, mixed>>  $lines
     * @return array{lines: list<array<string, mixed>>, amount: string}
     */
    private function normalizeLines(array $lines, mixed $declaredTotal): array
    {
        $normalized = [];
        $sum = '0';

        foreach ($lines as $index => $line) {
            $quantity = IntegerAmount::assert((string) ($line['quantity'] ?? ''));
            $price = IntegerAmount::assert((string) ($line['unit_price_xaf'] ?? ''));
            if (IntegerAmount::compare($quantity, '0') === 0) {
                throw new NeedRuleException('Une sous-ligne a une quantité nulle.');
            }
            $amount = IntegerAmount::multiply($quantity, $price);
            if (isset($line['amount_xaf']) && $line['amount_xaf'] !== ''
                && IntegerAmount::compare((string) $line['amount_xaf'], $amount) !== 0) {
                throw new NeedRuleException('Le montant de la sous-ligne '.($index + 1).' n’est pas égal à la quantité multipliée par le prix.');
            }
            $sum = IntegerAmount::add($sum, $amount);
            $normalized[] = [
                'position' => $index + 1,
                'designation' => $line['designation'],
                'quantity' => (int) $quantity,
                'unit' => $line['unit'],
                'unit_price_xaf' => $price,
                'amount_xaf' => $amount,
            ];
        }

        if ($declaredTotal !== null && $declaredTotal !== ''
            && IntegerAmount::compare((string) $declaredTotal, $sum) !== 0) {
            throw new NeedRuleException('Le total des sous-lignes n’est pas égal au montant de l’activité.');
        }

        return ['lines' => $normalized, 'amount' => $sum];
    }

    /**
     * @param  list<array<string, mixed>>  $documents
     */
    private function storeDocuments(NeedRequest $request, array $documents): void
    {
        foreach ($documents as $document) {
            $request->documents()->create([
                'kind' => $document['kind'],
                'label' => $document['label'],
                'is_present' => (bool) ($document['is_present'] ?? false),
            ]);
        }
    }

    private function openInstance(NeedRequest $request, string $circuit): void
    {
        $definition = WorkflowDefinition::query()
            ->where('code', $circuit)
            ->where('status', 'active')
            ->orderByDesc('version')
            ->firstOrFail();
        $first = WorkflowStep::query()
            ->where('workflow_definition_id', $definition->id)
            ->orderBy('position')
            ->firstOrFail();

        $instance = WorkflowInstance::query()->create([
            'workflow_definition_id' => $definition->id,
            'subject_type' => NeedRequest::class,
            'subject_id' => $request->id,
            'current_step_id' => $first->id,
            'status' => 'open',
        ]);

        $request->update(['workflow_instance_id' => $instance->id]);
    }

    private function assertReadyToSubmit(NeedRequest $request): void
    {
        $request->load('lines', 'documents', 'budgetLine.events');
        if ($request->lines->isEmpty() || IntegerAmount::compare((string) $request->amount_xaf, '0') === 0) {
            throw new NeedRuleException('Le total des sous-lignes n’est pas égal au montant de l’activité.');
        }

        $justified = $request->documents->contains(
            fn ($document): bool => $document->kind === 'justification' && $document->is_present,
        );
        if (! $justified) {
            throw new NeedRuleException('La pièce de justification est obligatoire.');
        }

        $available = $this->balance->forLine($request->budgetLine)['available_xaf'];
        if (IntegerAmount::compare((string) $request->amount_xaf, $available) > 0) {
            throw new NeedRuleException('Le montant dépasse le disponible de la ligne.');
        }

        $duplicate = NeedRequest::query()
            ->where('fiscal_year_id', $request->fiscal_year_id)
            ->where('organization_unit_id', $request->organization_unit_id)
            ->whereDate('need_on', $request->need_on->toDateString())
            ->where('amount_xaf', $request->amount_xaf)
            ->whereRaw('lower(object) = ?', [mb_strtolower($request->object)])
            ->whereNotIn('status', ['draft', 'rejected', 'cancelled', 'replaced'])
            ->where('id', '!=', $request->id)
            ->exists();

        if ($duplicate) {
            throw new NeedRuleException('Un dossier ouvert porte déjà le même objet, le même montant et la même date.');
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
            throw new NeedRuleException('Séparation des fonctions : '.implode(', ', $conflicts));
        }
    }

    private function closeTasks(NeedRequest $request): void
    {
        Task::query()
            ->where('need_request_id', $request->id)
            ->where('status', 'open')
            ->update([
                'status' => 'done',
                'completed_at' => now(),
            ]);
    }

    private function openTask(NeedRequest $request, WorkflowInstance $instance, WorkflowStep $step): void
    {
        if ($step->actor_kind !== 'role' || $step->actor_role_code === null) {
            return;
        }

        Task::query()->create([
            'need_request_id' => $request->id,
            'workflow_instance_id' => $instance->id,
            'assignee_role_code' => $step->actor_role_code,
            'title' => $request->reference.' — '.$step->label,
            'status' => 'open',
        ]);
    }
}
