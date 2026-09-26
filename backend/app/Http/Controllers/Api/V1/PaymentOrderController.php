<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Expenditure\ChainListPreloader;
use App\Domain\Expenditure\OrdonnancementService;
use App\Http\Controllers\Controller;
use App\Models\Liquidation;
use App\Models\PaymentOrder;
use App\Support\ApiResponse;
use App\Support\OfficialDocumentPayload;
use App\Support\WorkflowCursor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentOrderController extends Controller
{
    public function __construct(
        private readonly OrdonnancementService $orders,
        private readonly ChainListPreloader $lists,
    ) {}

    public function index(): JsonResponse
    {
        $rows = PaymentOrder::query()
            ->with(['liquidation', 'workflow.currentStep', 'payments'])
            ->orderByDesc('created_at')
            ->get();
        $this->lists->orders($rows);

        return ApiResponse::success(
            $rows->map(fn (PaymentOrder $order): array => $this->payload($order))->values(),
            'Ordonnancements.',
        );
    }

    public function show(PaymentOrder $paymentOrder): JsonResponse
    {
        $paymentOrder->load(['liquidation', 'workflow.currentStep', 'payments']);

        return ApiResponse::success($this->payload($paymentOrder), 'Ordonnancement.');
    }

    public function storePartial(Request $request, Liquidation $liquidation): JsonResponse
    {
        $data = $request->validate([
            'amount_xaf' => ['required', 'regex:/^\d+$/'],
            'idempotency_key' => ['required', 'string', 'max:80'],
        ]);

        $order = $this->orders->openPartial($request->user(), $liquidation, $data['amount_xaf'], $data['idempotency_key']);

        return ApiResponse::success($this->payload($order->load(['liquidation', 'workflow.currentStep', 'payments'])), 'Ordonnancement partiel ouvert.', 201);
    }

    public function reduce(Request $request, PaymentOrder $paymentOrder): JsonResponse
    {
        $data = $request->validate([
            'amount_xaf' => ['required', 'regex:/^\d+$/'],
        ]);

        $updated = $this->orders->reduce($request->user(), $paymentOrder, $data['amount_xaf']);

        return ApiResponse::success($this->payload($updated->load(['liquidation', 'workflow.currentStep', 'payments'])), 'Montant à ordonnancer enregistré.');
    }

    public function transition(Request $request, PaymentOrder $paymentOrder): JsonResponse
    {
        $data = $request->validate([
            'action' => ['required', 'string', 'max:40'],
            'reason' => ['nullable', 'string'],
        ]);

        $updated = $this->orders->transition($request->user(), $paymentOrder, $data['action'], $data['reason'] ?? null);

        return ApiResponse::success($this->payload($updated->load(['liquidation', 'workflow.currentStep', 'payments'])), 'Transition d’ordonnancement enregistrée.');
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(PaymentOrder $order): array
    {
        $figures = $this->orders->figures($order);
        $step = $order->workflow?->currentStep;
        $last = WorkflowCursor::last($order->workflow);

        return [
            'id' => $order->id,
            'reference' => $order->reference,
            'status' => $order->status,
            'rank' => $order->rank,
            'amount_xaf' => (string) $order->amount_xaf,
            'beneficiary_label' => $order->beneficiary_label,
            'authorizer_role_code' => $order->authorizer_role_code,
            'threshold_amount_xaf' => $order->threshold_amount_xaf === null ? null : (string) $order->threshold_amount_xaf,
            'threshold_version' => $order->threshold_version,
            'signed_on' => $order->signed_on?->toDateString(),
            'remainder_xaf' => $figures['remainder_xaf'],
            'official_documents' => OfficialDocumentPayload::for($order),
            'liquidation' => $order->relationLoaded('liquidation') && $order->liquidation !== null ? [
                'id' => $order->liquidation->id,
                'reference' => $order->liquidation->reference,
                'amount_xaf' => (string) $order->liquidation->amount_xaf,
            ] : null,
            'payments' => $order->relationLoaded('payments')
                ? $order->payments->map(fn ($payment): array => [
                    'id' => $payment->id,
                    'reference' => $payment->reference,
                    'status' => $payment->status,
                ])->values()->all()
                : [],
            'banner' => [
                'current_step' => $step?->label,
                'expected_role' => $step?->actor_kind === 'threshold' ? $order->authorizer_role_code : $step?->actor_role_code,
                'last_action' => $last?->action,
                'reason' => $last?->reason,
            ],
        ];
    }
}
