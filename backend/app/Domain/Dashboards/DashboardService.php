<?php

namespace App\Domain\Dashboards;

use App\Domain\Budget\BudgetBalance;
use App\Domain\Money\IntegerAmount;
use App\Models\BudgetLine;
use App\Models\Commitment;
use App\Models\FiscalYear;
use App\Models\Liquidation;
use App\Models\NeedRequest;
use App\Models\OrganizationUnit;
use App\Models\Payment;
use App\Models\PaymentOrder;
use App\Models\Task;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class DashboardService
{
    /**
     * Fonctions qui voient toute la Commission. Les autres sont limitées à leur structure et à ses filles.
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

    public function __construct(private readonly BudgetBalance $balances) {}

    /**
     * @return array<string, mixed>
     */
    public function forUser(User $user): array
    {
        $scope = $this->scope($user);
        $unitIds = $scope['unit_ids'];
        $lines = $this->lines($unitIds);

        $revised = '0';
        $reserved = '0';
        $committed = '0';
        $available = '0';
        $segments = [];
        $structures = [];
        $alerts = [];

        foreach ($lines as $line) {
            $figures = $this->balances->forLine($line);
            $revised = IntegerAmount::add($revised, $figures['revised_xaf']);
            $reserved = IntegerAmount::add($reserved, $figures['reserved_xaf']);
            $committed = IntegerAmount::add($committed, $figures['committed_xaf']);
            $available = IntegerAmount::add($available, $figures['available_xaf']);

            $segment = (string) $line->segment;
            $segments[$segment] ??= ['revised_xaf' => '0', 'paid_xaf' => '0'];
            $segments[$segment]['revised_xaf'] = IntegerAmount::add($segments[$segment]['revised_xaf'], $figures['revised_xaf']);

            $unitKey = $line->organization_unit_id ?? 'unassigned';
            $structures[$unitKey] ??= [
                'name' => $line->organizationUnit?->name ?? 'Non rattachée',
                'revised_xaf' => '0',
                'paid_xaf' => '0',
            ];
            $structures[$unitKey]['revised_xaf'] = IntegerAmount::add($structures[$unitKey]['revised_xaf'], $figures['revised_xaf']);

            if (IntegerAmount::compare($figures['revised_xaf'], '0') > 0 && IntegerAmount::compare($figures['available_xaf'], '0') === 0) {
                $alerts[] = [
                    'kind' => 'exhausted',
                    'line_code' => $line->code,
                    'label' => $line->label,
                ];
            }
        }

        $paidByLine = $this->paidByLine($unitIds);
        $paid = '0';
        foreach ($paidByLine as $lineId => $amount) {
            $paid = IntegerAmount::add($paid, $amount);
            $line = $lines->firstWhere('id', $lineId);
            if ($line === null) {
                continue;
            }
            $segment = (string) $line->segment;
            if (isset($segments[$segment])) {
                $segments[$segment]['paid_xaf'] = IntegerAmount::add($segments[$segment]['paid_xaf'], $amount);
            }
            $unitKey = $line->organization_unit_id ?? 'unassigned';
            if (isset($structures[$unitKey])) {
                $structures[$unitKey]['paid_xaf'] = IntegerAmount::add($structures[$unitKey]['paid_xaf'], $amount);
            }
        }

        $liquidated = $this->sumMoney($this->liquidations($unitIds), 'amount_xaf');
        $ordered = $this->sumMoney($this->orders($unitIds), 'amount_xaf');
        $year = FiscalYear::query()->where('is_current', true)->first();
        $tasks = $this->openTasks($unitIds);

        return [
            'as_of' => now()->toIso8601String(),
            'scope' => [
                'mode' => $scope['mode'],
                'unit_count' => $unitIds === null ? null : count($unitIds),
            ],
            'exercise' => [
                'year' => $year?->year,
                'status' => $year?->status,
            ],
            'budget' => [
                'has_executable' => $lines->isNotEmpty(),
                'revised_xaf' => $revised,
                'reserved_xaf' => $reserved,
                'committed_xaf' => $committed,
                'liquidated_xaf' => $liquidated,
                'ordered_xaf' => $ordered,
                'paid_xaf' => $paid,
                'available_xaf' => $available,
                'execution_percent' => $this->percent($paid, $revised),
            ],
            'remainders' => [
                'to_liquidate_xaf' => IntegerAmount::subtract($committed, $liquidated),
                'to_order_xaf' => IntegerAmount::subtract($liquidated, $ordered),
                'to_pay_xaf' => IntegerAmount::subtract($ordered, $paid),
            ],
            'segments' => collect($segments)->map(fn (array $row, string $code): array => [
                'code' => $code,
                'label' => match ($code) {
                    'fonctionnement' => 'Hors PAP',
                    'investissement' => 'PAP',
                    'equipement' => 'Équipement',
                    default => $code,
                },
                'revised_xaf' => $row['revised_xaf'],
                'paid_xaf' => $row['paid_xaf'],
                'execution_percent' => $this->percent($row['paid_xaf'], $row['revised_xaf']),
            ])->values(),
            'structures' => collect($structures)->map(fn (array $row): array => [
                'name' => $row['name'],
                'revised_xaf' => $row['revised_xaf'],
                'paid_xaf' => $row['paid_xaf'],
                'execution_percent' => $this->percent($row['paid_xaf'], $row['revised_xaf']),
            ])->values(),
            'alerts' => $alerts,
            'waiting' => [
                'open_tasks' => $tasks->count(),
                'oldest_age_days' => $this->oldestAgeDays($tasks),
                'by_role' => $tasks->groupBy('assignee_role_code')->map(fn ($group, string $code): array => [
                    'role_code' => $code,
                    'count' => $group->count(),
                ])->values(),
            ],
            'pipeline' => [
                'need_requests' => $this->inScope(NeedRequest::query(), $unitIds)->count(),
                'commitments' => $this->inScope(Commitment::query(), $unitIds)->count(),
                'liquidations' => $this->liquidations($unitIds, false)->count(),
                'payment_orders' => $this->orders($unitIds, false)->count(),
                'payments' => $this->payments($unitIds, false)->count(),
                'returned' => $this->statusCount($unitIds, 'returned'),
                'rejected' => $this->statusCount($unitIds, 'rejected'),
            ],
            'physical' => null,
            'formulas' => [
                'revised' => 'Somme des révisés des lignes de dépense de la version exécutoire, dans le périmètre.',
                'available' => 'Révisé − gelé − réservé − engagé ferme.',
                'liquidated' => 'Somme des nets des liquidations visées.',
                'ordered' => 'Somme des ordonnancements ni rejetés ni annulés.',
                'paid' => 'Somme des paiements exécutés.',
                'execution_percent' => 'Payé × 100 ÷ révisé, quotient entier. Absent lorsque le révisé est nul.',
                'alert' => 'Crédit épuisé seulement si le disponible est nul et le révisé est positif. Aucun seuil de proximité n’est paramétré.',
                'physical' => 'Avancement physique non calculé : la chaîne GAR/RBM n’est pas importée.',
            ],
        ];
    }

    /**
     * @return array{mode: string, unit_ids: list<string>|null}
     */
    private function scope(User $user): array
    {
        if (array_intersect($user->activeRoleCodes(), self::INSTITUTIONAL_ROLES) !== []) {
            return ['mode' => 'institution', 'unit_ids' => null];
        }

        $roots = $user->roles()
            ->wherePivotNotNull('organization_unit_id')
            ->pluck('role_user.organization_unit_id')
            ->filter()
            ->unique()
            ->values()
            ->all();

        if ($roots === []) {
            return ['mode' => 'none', 'unit_ids' => []];
        }

        return ['mode' => 'structures', 'unit_ids' => $this->descendants($roots)];
    }

    /**
     * @param  list<string>  $roots
     * @return list<string>
     */
    private function descendants(array $roots): array
    {
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

    /**
     * @param  list<string>|null  $unitIds
     */
    private function lines(?array $unitIds)
    {
        return BudgetLine::query()
            ->where('nature', 'expenditure')
            ->whereHas('version', fn (Builder $query) => $query->where('status', 'executable'))
            ->with(['events', 'organizationUnit'])
            ->when($unitIds !== null, fn (Builder $query) => $query->whereIn('organization_unit_id', $unitIds))
            ->get();
    }

    /**
     * @param  list<string>|null  $unitIds
     * @return array<string, string>
     */
    private function paidByLine(?array $unitIds): array
    {
        $totals = [];
        $payments = $this->payments($unitIds)
            ->with('paymentOrder.liquidation.commitment')
            ->get();

        foreach ($payments as $payment) {
            $lineId = $payment->paymentOrder?->liquidation?->commitment?->budget_line_id;
            if ($lineId === null) {
                continue;
            }
            $totals[$lineId] = IntegerAmount::add($totals[$lineId] ?? '0', $this->money($payment->amount_xaf));
        }

        return $totals;
    }

    /**
     * @param  list<string>|null  $unitIds
     */
    private function liquidations(?array $unitIds, bool $visedOnly = true): Builder
    {
        return Liquidation::query()
            ->when($visedOnly, fn (Builder $query) => $query->where('status', 'vised'))
            ->whereHas('commitment', fn (Builder $query) => $this->inScope($query, $unitIds));
    }

    /**
     * @param  list<string>|null  $unitIds
     */
    private function orders(?array $unitIds, bool $activeOnly = true): Builder
    {
        return PaymentOrder::query()
            ->when($activeOnly, fn (Builder $query) => $query->whereNotIn('status', ['rejected', 'cancelled']))
            ->whereHas('liquidation.commitment', fn (Builder $query) => $this->inScope($query, $unitIds));
    }

    /**
     * @param  list<string>|null  $unitIds
     */
    private function payments(?array $unitIds, bool $executedOnly = true): Builder
    {
        return Payment::query()
            ->when($executedOnly, fn (Builder $query) => $query->where('status', 'executed'))
            ->whereHas('paymentOrder.liquidation.commitment', fn (Builder $query) => $this->inScope($query, $unitIds));
    }

    /**
     * @param  list<string>|null  $unitIds
     */
    private function inScope(Builder $query, ?array $unitIds): Builder
    {
        if ($unitIds === null) {
            return $query;
        }

        return $query->whereIn('organization_unit_id', $unitIds);
    }

    private function sumMoney(Builder $query, string $column): string
    {
        $total = '0';
        foreach ($query->pluck($column) as $amount) {
            $total = IntegerAmount::add($total, $this->money($amount));
        }

        return $total;
    }

    private function money(mixed $amount): string
    {
        $text = (string) $amount;
        if (str_contains($text, '.')) {
            $text = explode('.', $text, 2)[0];
        }

        return IntegerAmount::assert($text === '' ? '0' : $text);
    }

    private function percent(string $part, string $whole): ?string
    {
        if (IntegerAmount::compare($whole, '0') === 0) {
            return null;
        }

        return IntegerAmount::quotient(IntegerAmount::multiply($part, '100'), $whole);
    }

    /**
     * @param  list<string>|null  $unitIds
     */
    private function openTasks(?array $unitIds)
    {
        return Task::query()
            ->where('status', 'open')
            ->whereHas('needRequest', fn (Builder $query) => $this->inScope($query, $unitIds))
            ->get();
    }

    /**
     * @param  Collection<int, Task>  $tasks
     */
    private function oldestAgeDays($tasks): ?int
    {
        $oldest = $tasks->sortBy('created_at')->first();
        if ($oldest?->created_at === null) {
            return null;
        }

        return (int) floor($oldest->created_at->diffInSeconds(now()) / 86400);
    }

    /**
     * @param  list<string>|null  $unitIds
     */
    private function statusCount(?array $unitIds, string $status): int
    {
        return $this->inScope(NeedRequest::query(), $unitIds)->where('status', $status)->count()
            + $this->inScope(Commitment::query(), $unitIds)->where('status', $status)->count()
            + $this->liquidations($unitIds, false)->where('status', $status)->count()
            + $this->orders($unitIds, false)->where('status', $status)->count()
            + $this->payments($unitIds, false)->where('status', $status)->count();
    }
}
