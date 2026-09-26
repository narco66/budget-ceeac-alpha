<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Expenditure\ChainListPreloader;
use App\Domain\Expenditure\LiquidationService;
use App\Http\Controllers\Controller;
use App\Models\Commitment;
use App\Models\Liquidation;
use App\Support\ApiResponse;
use App\Support\OfficialDocumentPayload;
use App\Support\WorkflowCursor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LiquidationController extends Controller
{
    public function __construct(
        private readonly LiquidationService $liquidations,
        private readonly ChainListPreloader $lists,
    ) {}

    public function index(): JsonResponse
    {
        $rows = Liquidation::query()
            ->with(['commitment', 'workflow.currentStep', 'paymentOrders'])
            ->orderByDesc('created_at')
            ->get();
        $this->lists->liquidations($rows);

        return ApiResponse::success(
            $rows->map(fn (Liquidation $liquidation): array => $this->payload($liquidation))->values(),
            'Liquidations.',
        );
    }

    public function show(Liquidation $liquidation): JsonResponse
    {
        $liquidation->load(['commitment', 'workflow.currentStep', 'paymentOrders', 'documents']);

        return ApiResponse::success($this->payload($liquidation), 'Liquidation.');
    }

    public function storePartial(Request $request, Commitment $commitment): JsonResponse
    {
        $data = $this->statementInput($request);
        $data['idempotency_key'] = $request->validate([
            'idempotency_key' => ['required', 'string', 'max:80'],
        ])['idempotency_key'];

        $liquidation = $this->liquidations->openPartial($request->user(), $commitment, $data, $data['idempotency_key']);

        return ApiResponse::success($this->payload($liquidation->load(['commitment', 'workflow.currentStep', 'paymentOrders', 'documents'])), 'Liquidation partielle ouverte.', 201);
    }

    public function statement(Request $request, Liquidation $liquidation): JsonResponse
    {
        $updated = $this->liquidations->state($request->user(), $liquidation, $this->statementInput($request));

        return ApiResponse::success($this->payload($updated->load(['commitment', 'workflow.currentStep', 'paymentOrders', 'documents'])), 'Décompte de liquidation enregistré.');
    }

    public function certification(Request $request, Liquidation $liquidation): JsonResponse
    {
        $data = $request->validate([
            'service_done_on' => ['required', 'date'],
            'certification_note' => ['required', 'string'],
            'documents' => ['required', 'array', 'min:1'],
            'documents.*.kind' => ['required', 'in:service_fait'],
            'documents.*.label' => ['required', 'string', 'max:180'],
            'documents.*.is_present' => ['required', 'boolean'],
        ]);

        $updated = $this->liquidations->certify($request->user(), $liquidation, $data);

        return ApiResponse::success($this->payload($updated->load(['commitment', 'workflow.currentStep', 'paymentOrders', 'documents'])), 'Service fait enregistré.');
    }

    public function transition(Request $request, Liquidation $liquidation): JsonResponse
    {
        $data = $request->validate([
            'action' => ['required', 'string', 'max:40'],
            'reason' => ['nullable', 'string'],
        ]);

        $updated = $this->liquidations->transition($request->user(), $liquidation, $data['action'], $data['reason'] ?? null);

        return ApiResponse::success($this->payload($updated->load(['commitment', 'workflow.currentStep', 'paymentOrders', 'documents'])), 'Transition de liquidation enregistrée.');
    }

    /**
     * @return array<string, mixed>
     */
    private function statementInput(Request $request): array
    {
        return $request->validate([
            'gross_amount_xaf' => ['required', 'regex:/^\d+$/'],
            'tax_xaf' => ['nullable', 'regex:/^\d+$/'],
            'withholding_xaf' => ['nullable', 'regex:/^\d+$/'],
            'penalty_xaf' => ['nullable', 'regex:/^\d+$/'],
            'advance_xaf' => ['nullable', 'regex:/^\d+$/'],
            'deduction_reason' => ['nullable', 'string'],
            'invoice_number' => ['required', 'string', 'max:80'],
            'invoice_on' => ['required', 'date'],
            'supplier_label' => ['required', 'string', 'max:180'],
            'documents' => ['required', 'array', 'min:1'],
            'documents.*.kind' => ['required', 'in:invoice,reception_report'],
            'documents.*.label' => ['required', 'string', 'max:180'],
            'documents.*.is_present' => ['required', 'boolean'],
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(Liquidation $liquidation): array
    {
        $figures = $this->liquidations->figures($liquidation);
        $step = $liquidation->workflow?->currentStep;
        $last = WorkflowCursor::last($liquidation->workflow);

        return [
            'id' => $liquidation->id,
            'reference' => $liquidation->reference,
            'status' => $liquidation->status,
            'rank' => $liquidation->rank,
            'gross_amount_xaf' => (string) $liquidation->gross_amount_xaf,
            'tax_xaf' => (string) $liquidation->tax_xaf,
            'withholding_xaf' => (string) $liquidation->withholding_xaf,
            'penalty_xaf' => (string) $liquidation->penalty_xaf,
            'advance_xaf' => (string) $liquidation->advance_xaf,
            'amount_xaf' => (string) $liquidation->amount_xaf,
            'deduction_reason' => $liquidation->deduction_reason,
            'invoice_number' => $liquidation->invoice_number,
            'invoice_on' => $liquidation->invoice_on?->toDateString(),
            'supplier_label' => $liquidation->supplier_label,
            'service_done_on' => $liquidation->service_done_on?->toDateString(),
            'certification_note' => $liquidation->certification_note,
            'liquidated_xaf' => $figures['liquidated_xaf'],
            'remainder_xaf' => $figures['remainder_xaf'],
            'official_documents' => OfficialDocumentPayload::for($liquidation),
            'commitment' => $liquidation->relationLoaded('commitment') && $liquidation->commitment !== null ? [
                'id' => $liquidation->commitment->id,
                'reference' => $liquidation->commitment->reference,
                'object' => $liquidation->commitment->object,
                'amount_xaf' => (string) $liquidation->commitment->amount_xaf,
            ] : null,
            'payment_orders' => $liquidation->relationLoaded('paymentOrders')
                ? $liquidation->paymentOrders->map(fn ($order): array => [
                    'id' => $order->id,
                    'reference' => $order->reference,
                    'status' => $order->status,
                    'amount_xaf' => (string) $order->amount_xaf,
                ])->values()->all()
                : [],
            'banner' => [
                'current_step' => $step?->label,
                'expected_role' => $step?->actor_role_code,
                'last_action' => $last?->action,
                'reason' => $last?->reason,
            ],
        ];
    }
}
