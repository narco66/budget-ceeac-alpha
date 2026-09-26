<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Expenditure\PaymentService;
use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\PaymentOrder;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function __construct(private readonly PaymentService $payments) {}

    public function index(): JsonResponse
    {
        $rows = Payment::query()
            ->with(['paymentOrder', 'workflow.currentStep'])
            ->orderByDesc('created_at')
            ->get();

        return ApiResponse::success(
            $rows->map(fn (Payment $payment): array => $this->payload($payment))->values(),
            'Paiements.',
        );
    }

    public function show(Payment $payment): JsonResponse
    {
        $payment->load(['paymentOrder', 'workflow.currentStep', 'documents']);

        return ApiResponse::success($this->payload($payment), 'Paiement.');
    }

    public function statement(Request $request, Payment $payment): JsonResponse
    {
        $data = $request->validate([
            'mode' => ['required', 'in:virement,cheque,caisse'],
            'instrument_reference' => ['required', 'string', 'max:80'],
            'value_on' => ['required', 'date'],
        ]);

        $updated = $this->payments->state($request->user(), $payment, $data);

        return ApiResponse::success($this->payload($updated->load(['paymentOrder', 'workflow.currentStep', 'documents'])), 'Mode de paiement enregistré.');
    }

    public function reduce(Request $request, Payment $payment): JsonResponse
    {
        $data = $request->validate([
            'amount_xaf' => ['required', 'regex:/^\d+$/'],
        ]);

        $updated = $this->payments->reduce($request->user(), $payment, $data['amount_xaf']);

        return ApiResponse::success($this->payload($updated->load(['paymentOrder', 'workflow.currentStep', 'documents'])), 'Montant à payer enregistré.');
    }

    public function proof(Request $request, Payment $payment): JsonResponse
    {
        $data = $request->validate([
            'documents' => ['required', 'array', 'min:1'],
            'documents.*.kind' => ['required', 'in:proof'],
            'documents.*.label' => ['required', 'string', 'max:180'],
            'documents.*.is_present' => ['required', 'boolean'],
        ]);

        $updated = $this->payments->prove($request->user(), $payment, $data);

        return ApiResponse::success($this->payload($updated->load(['paymentOrder', 'workflow.currentStep', 'documents'])), 'Preuve de règlement enregistrée.');
    }

    public function storePartial(Request $request, PaymentOrder $paymentOrder): JsonResponse
    {
        $data = $request->validate([
            'amount_xaf' => ['required', 'regex:/^\d+$/'],
            'mode' => ['required', 'in:virement,cheque,caisse'],
            'instrument_reference' => ['required', 'string', 'max:80'],
            'value_on' => ['required', 'date'],
            'idempotency_key' => ['required', 'string', 'max:80'],
        ]);

        $payment = $this->payments->openPartial($request->user(), $paymentOrder, $data, $data['idempotency_key']);

        return ApiResponse::success($this->payload($payment->load(['paymentOrder', 'workflow.currentStep', 'documents'])), 'Paiement partiel ouvert.', 201);
    }

    public function transition(Request $request, Payment $payment): JsonResponse
    {
        $data = $request->validate([
            'action' => ['required', 'string', 'max:40'],
            'reason' => ['nullable', 'string'],
        ]);

        $updated = $this->payments->transition($request->user(), $payment, $data['action'], $data['reason'] ?? null);

        return ApiResponse::success($this->payload($updated->load(['paymentOrder', 'workflow.currentStep', 'documents'])), 'Transition de paiement enregistrée.');
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(Payment $payment): array
    {
        $figures = $this->payments->figures($payment);
        $step = $payment->workflow?->currentStep;
        $last = $payment->workflow?->events()->latest('created_at')->first();

        return [
            'id' => $payment->id,
            'reference' => $payment->reference,
            'status' => $payment->status,
            'rank' => $payment->rank,
            'amount_xaf' => (string) $payment->amount_xaf,
            'mode' => $payment->mode,
            'instrument_reference' => $payment->instrument_reference,
            'value_on' => $payment->value_on?->toDateString(),
            'beneficiary_label' => $payment->beneficiary_label,
            'paid_xaf' => $figures['paid_xaf'],
            'remainder_xaf' => $figures['remainder_xaf'],
            'official_pdf' => null,
            'payment_order' => $payment->relationLoaded('paymentOrder') && $payment->paymentOrder !== null ? [
                'id' => $payment->paymentOrder->id,
                'reference' => $payment->paymentOrder->reference,
                'amount_xaf' => (string) $payment->paymentOrder->amount_xaf,
            ] : null,
            'banner' => [
                'current_step' => $step?->label,
                'expected_role' => $step?->actor_role_code,
                'last_action' => $last?->action,
                'reason' => $last?->reason,
            ],
        ];
    }
}
