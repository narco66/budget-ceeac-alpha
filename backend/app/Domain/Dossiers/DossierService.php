<?php

namespace App\Domain\Dossiers;

use App\Domain\Money\IntegerAmount;
use App\Models\BudgetLine;
use App\Models\Commitment;
use App\Models\Contract;
use App\Models\Liquidation;
use App\Models\NeedRequest;
use App\Models\OrganizationUnit;
use App\Models\Payment;
use App\Models\PaymentOrder;
use App\Models\User;
use App\Models\WorkflowEvent;
use App\Support\OfficialDocumentPayload;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Collection;

class DossierService
{
    /**
     * Même périmètre que le tableau de bord : la Commission, ou la structure et ses filles.
     *
     * @var list<string>
     */
    private const INSTITUTIONAL_ROLES = [
        'administrateur',
        'president',
        'secretaire_general',
        'audit_interne',
        'controle_interne',
        'directeur_budget',
        'chef_service_budget',
        'expert_budget',
        'controleur_financier',
        'comptable',
        'chef_comptable',
        'agent_comptable',
        'certificateur_service_fait',
    ];

    /**
     * @return list<array<string, mixed>>
     */
    public function search(User $user, string $term): array
    {
        $like = '%'.addcslashes(trim($term), '%_\\').'%';
        $unitIds = $this->unitIds($user);
        if ($unitIds === []) {
            return [];
        }

        $needIds = $this->matchingNeedIds($like, $term, $unitIds);
        $needs = NeedRequest::query()
            ->whereIn('id', $needIds)
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        $rows = $needs->map(fn (NeedRequest $need): array => [
            'kind' => 'need_request',
            'reference' => $need->reference,
            'label' => $need->object,
            'amount_xaf' => (string) $need->amount_xaf,
            'linked_need' => $need->reference,
        ])->all();

        if ($user->hasPermission('contracts.view')) {
            $contracts = Contract::query()
                ->where(fn (Builder $query) => $query->where('reference', 'like', $like)->orWhere('object', 'like', $like))
                ->orderByDesc('created_at')
                ->limit(20)
                ->get();
            foreach ($contracts as $contract) {
                $rows[] = [
                    'kind' => 'contract',
                    'reference' => $contract->reference,
                    'label' => $contract->object,
                    'amount_xaf' => (string) $contract->amount_xaf,
                    'linked_need' => null,
                ];
            }
        }

        return $rows;
    }

    /**
     * @return array<string, mixed>
     */
    public function show(User $user, string $reference): array
    {
        $need = $this->findNeed($user, $reference);
        $need->load(['budgetLine', 'organizationUnit', 'workflow.events']);
        $commitments = Commitment::query()
            ->where('need_request_id', $need->id)
            ->with([
                'workflow.events',
                'liquidations.workflow.events',
                'liquidations.paymentOrders.workflow.events',
                'liquidations.paymentOrders.payments.workflow.events',
            ])
            ->orderBy('reference')
            ->get();
        $need->setRelation('commitments', $commitments);

        return [
            'reference' => $need->reference,
            'need_request' => [
                'id' => $need->id,
                'reference' => $need->reference,
                'object' => $need->object,
                'status' => $need->status,
                'amount_xaf' => (string) $need->amount_xaf,
                'budget_line' => $need->budgetLine === null ? null : [
                    'code' => $need->budgetLine->code,
                    'label' => $need->budgetLine->label,
                ],
                'structure' => $need->organizationUnit === null ? null : [
                    'code' => $need->organizationUnit->code,
                    'name' => $need->organizationUnit->name,
                ],
                'official_documents' => OfficialDocumentPayload::for($need),
            ],
            'commitments' => $need->commitments->map(fn (Commitment $commitment): array => [
                'reference' => $commitment->reference,
                'status' => $commitment->status,
                'amount_xaf' => (string) $commitment->amount_xaf,
                'official_documents' => OfficialDocumentPayload::for($commitment),
                'liquidations' => $commitment->liquidations->map(fn (Liquidation $liquidation): array => [
                    'reference' => $liquidation->reference,
                    'status' => $liquidation->status,
                    'amount_xaf' => (string) $liquidation->amount_xaf,
                    'supplier_label' => $liquidation->supplier_label,
                    'invoice_number' => $liquidation->invoice_number,
                    'official_documents' => OfficialDocumentPayload::for($liquidation),
                    'payment_orders' => $liquidation->paymentOrders->map(fn (PaymentOrder $order): array => [
                        'reference' => $order->reference,
                        'status' => $order->status,
                        'amount_xaf' => (string) $order->amount_xaf,
                        'beneficiary_label' => $order->beneficiary_label,
                        'official_documents' => OfficialDocumentPayload::for($order),
                        'payments' => $order->payments->map(fn (Payment $payment): array => [
                            'reference' => $payment->reference,
                            'status' => $payment->status,
                            'amount_xaf' => (string) $payment->amount_xaf,
                            'mode' => $payment->mode,
                            'instrument_reference' => $payment->instrument_reference,
                            'official_documents' => OfficialDocumentPayload::for($payment),
                        ])->values()->all(),
                    ])->values()->all(),
                ])->values()->all(),
            ])->values()->all(),
            'events' => $this->events($need),
            'findings' => [],
            'findings_note' => 'Le registre des observations n’est pas rattaché à un dossier.',
            'monitoring' => null,
            'monitoring_note' => 'La chaîne GAR/RBM n’est pas importée. Aucun lien de suivi-évaluation n’est calculé.',
            'contract_note' => 'Aucun contrat n’est rattaché à la dépense.',
        ];
    }

    /**
     * @param  list<string>|null  $unitIds
     * @return Collection<int, string>
     */
    private function matchingNeedIds(string $like, string $term, ?array $unitIds): Collection
    {
        $ids = $this->needs($unitIds)
            ->where(fn (Builder $query) => $query->where('reference', 'like', $like)->orWhere('object', 'like', $like))
            ->pluck('id');

        $ids = $ids->merge(
            Commitment::query()
                ->where(fn (Builder $query) => $query->where('reference', 'like', $like)->orWhere('object', 'like', $like))
                ->whereHas('needRequest', fn (Builder $query) => $this->constrain($query, $unitIds))
                ->pluck('need_request_id'),
        );

        $ids = $ids->merge(
            Liquidation::query()
                ->where(fn (Builder $query) => $query
                    ->where('reference', 'like', $like)
                    ->orWhere('supplier_label', 'like', $like)
                    ->orWhere('invoice_number', 'like', $like))
                ->whereHas('commitment.needRequest', fn (Builder $query) => $this->constrain($query, $unitIds))
                ->pluck('need_request_id'),
        );

        $liquidationIds = PaymentOrder::query()
            ->where(fn (Builder $query) => $query->where('reference', 'like', $like)->orWhere('beneficiary_label', 'like', $like))
            ->whereHas('liquidation.commitment.needRequest', fn (Builder $query) => $this->constrain($query, $unitIds))
            ->pluck('liquidation_id');

        $liquidationIds = $liquidationIds->merge(
            Payment::query()
                ->where(fn (Builder $query) => $query->where('reference', 'like', $like)->orWhere('instrument_reference', 'like', $like))
                ->whereHas('paymentOrder.liquidation.commitment.needRequest', fn (Builder $query) => $this->constrain($query, $unitIds))
                ->pluck('liquidation_id'),
        );

        if ($liquidationIds->isNotEmpty()) {
            $ids = $ids->merge(
                Liquidation::query()->whereIn('id', $liquidationIds->filter()->unique()->all())->pluck('need_request_id'),
            );
        }

        $lineIds = BudgetLine::query()
            ->where(fn (Builder $query) => $query->where('code', 'like', $like)->orWhere('label', 'like', $like))
            ->pluck('id');
        if ($lineIds->isNotEmpty()) {
            $ids = $ids->merge($this->needs($unitIds)->whereIn('budget_line_id', $lineIds)->pluck('id'));
        }

        $structureIds = OrganizationUnit::query()
            ->where(fn (Builder $query) => $query->where('code', 'like', $like)->orWhere('name', 'like', $like))
            ->pluck('id');
        if ($structureIds->isNotEmpty()) {
            $allowed = $unitIds === null ? $structureIds : $structureIds->intersect($unitIds);
            $ids = $ids->merge($this->needs($unitIds)->whereIn('organization_unit_id', $allowed)->pluck('id'));
        }

        if (preg_match('/^\d+$/', trim($term)) === 1) {
            $amount = IntegerAmount::assert(trim($term));
            $ids = $ids->merge($this->needs($unitIds)->where('amount_xaf', $amount)->pluck('id'));
        }

        return $ids->filter()->unique()->values();
    }

    private function findNeed(User $user, string $reference): NeedRequest
    {
        $unitIds = $this->unitIds($user);
        $need = $this->needs($unitIds)->where('reference', $reference)->first();
        if ($need === null) {
            $needId = Commitment::query()->where('reference', $reference)->value('need_request_id')
                ?? Liquidation::query()->where('reference', $reference)->value('need_request_id')
                ?? Liquidation::query()->whereIn(
                    'id',
                    PaymentOrder::query()->where('reference', $reference)->pluck('liquidation_id'),
                )->value('need_request_id')
                ?? Liquidation::query()->whereIn(
                    'id',
                    Payment::query()->where('reference', $reference)->pluck('liquidation_id'),
                )->value('need_request_id');
            $need = $needId === null ? null : $this->needs($unitIds)->whereKey($needId)->first();
        }

        if ($need === null) {
            throw (new ModelNotFoundException)->setModel(NeedRequest::class);
        }

        return $need;
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function events(NeedRequest $need): array
    {
        $acts = collect([$need]);
        foreach ($need->commitments as $commitment) {
            $acts->push($commitment);
            foreach ($commitment->liquidations as $liquidation) {
                $acts->push($liquidation);
                foreach ($liquidation->paymentOrders as $order) {
                    $acts->push($order);
                    foreach ($order->payments as $payment) {
                        $acts->push($payment);
                    }
                }
            }
        }

        $rows = [];
        foreach ($acts as $act) {
            $workflow = $act->workflow;
            if ($workflow === null || ! $workflow->relationLoaded('events')) {
                continue;
            }
            foreach ($workflow->events->sortBy('created_at') as $event) {
                $rows[] = $this->eventRow($act, $event);
            }
        }

        return $rows;
    }

    /**
     * @return array{act: string, action: string, reason: ?string, at: ?string}
     */
    private function eventRow(Model $act, WorkflowEvent $event): array
    {
        return [
            'act' => (string) $act->getAttribute('reference'),
            'action' => $event->action,
            'reason' => $event->reason,
            'at' => $event->created_at?->toIso8601String(),
        ];
    }

    /**
     * @param  list<string>|null  $unitIds
     */
    private function needs(?array $unitIds): Builder
    {
        return $this->constrain(NeedRequest::query(), $unitIds);
    }

    /**
     * @param  list<string>|null  $unitIds
     */
    private function constrain(Builder $query, ?array $unitIds): Builder
    {
        if ($unitIds === null) {
            return $query;
        }

        return $query->whereIn('organization_unit_id', $unitIds === [] ? ['__none__'] : $unitIds);
    }

    /**
     * @return list<string>|null
     */
    private function unitIds(User $user): ?array
    {
        if (array_intersect($user->activeRoleCodes(), self::INSTITUTIONAL_ROLES) !== []) {
            return null;
        }

        $roots = $user->roles()
            ->wherePivotNotNull('organization_unit_id')
            ->pluck('role_user.organization_unit_id')
            ->filter()
            ->unique()
            ->values()
            ->all();

        if ($roots === []) {
            return [];
        }

        $children = [];
        foreach (OrganizationUnit::query()->get(['id', 'parent_id']) as $unit) {
            $children[$unit->parent_id ?? ''][] = $unit->id;
        }

        $seen = [];
        $stack = $roots;
        while ($stack !== []) {
            $id = array_pop($stack);
            if (isset($seen[$id])) {
                continue;
            }
            $seen[$id] = true;
            foreach ($children[$id] ?? [] as $child) {
                $stack[] = $child;
            }
        }

        return array_keys($seen);
    }
}
