<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Expenditure\ChainListPreloader;
use App\Domain\Expenditure\EngagementService;
use App\Http\Controllers\Controller;
use App\Models\Commitment;
use App\Models\NeedRequest;
use App\Support\ApiResponse;
use App\Support\OfficialDocumentPayload;
use App\Support\WorkflowCursor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommitmentController extends Controller
{
    public function __construct(
        private readonly EngagementService $engagements,
        private readonly ChainListPreloader $lists,
    ) {}

    public function index(): JsonResponse
    {
        $commitments = Commitment::query()
            ->with(['needRequest', 'workflow.currentStep', 'liquidations'])
            ->orderByDesc('created_at')
            ->get();
        $this->lists->commitments($commitments);

        return ApiResponse::success(
            $commitments->map(fn (Commitment $commitment): array => $this->payload($commitment))->values(),
            'Engagements.',
        );
    }

    public function show(Commitment $commitment): JsonResponse
    {
        $commitment->load(['needRequest', 'workflow.currentStep', 'liquidations']);

        return ApiResponse::success($this->payload($commitment), 'Engagement.');
    }

    public function storePartial(Request $request, NeedRequest $needRequest): JsonResponse
    {
        $data = $request->validate([
            'amount_xaf' => ['required', 'regex:/^\d+$/'],
            'idempotency_key' => ['required', 'string', 'max:80'],
        ]);

        $commitment = $this->engagements->openPartial(
            $request->user(),
            $needRequest,
            $data['amount_xaf'],
            $data['idempotency_key'],
        );

        return ApiResponse::success($this->payload($commitment->load(['needRequest', 'workflow.currentStep', 'liquidations'])), 'Engagement partiel ouvert.', 201);
    }

    public function reduce(Request $request, Commitment $commitment): JsonResponse
    {
        $data = $request->validate([
            'amount_xaf' => ['required', 'regex:/^\d+$/'],
        ]);

        $updated = $this->engagements->reduce($request->user(), $commitment, $data['amount_xaf']);

        return ApiResponse::success($this->payload($updated->load(['needRequest', 'workflow.currentStep', 'liquidations'])), 'Montant partiel enregistré.');
    }

    public function transition(Request $request, Commitment $commitment): JsonResponse
    {
        $data = $request->validate([
            'action' => ['required', 'string', 'max:40'],
            'reason' => ['nullable', 'string'],
        ]);

        $updated = $this->engagements->transition(
            $request->user(),
            $commitment,
            $data['action'],
            $data['reason'] ?? null,
        );

        return ApiResponse::success($this->payload($updated->load(['needRequest', 'workflow.currentStep', 'liquidations'])), 'Transition d’engagement enregistrée.');
    }

    public function release(Request $request, Commitment $commitment): JsonResponse
    {
        $data = $request->validate([
            'amount_xaf' => ['required', 'regex:/^\d+$/'],
            'reason' => ['required', 'string'],
        ]);

        $updated = $this->engagements->release($request->user(), $commitment, $data['amount_xaf'], $data['reason']);

        return ApiResponse::success($this->payload($updated->load(['needRequest', 'workflow.currentStep', 'liquidations'])), 'Dégagement enregistré.');
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(Commitment $commitment): array
    {
        $figures = $this->engagements->figures($commitment);
        $step = $commitment->workflow?->currentStep;
        $last = WorkflowCursor::last($commitment->workflow);

        return [
            'id' => $commitment->id,
            'reference' => $commitment->reference,
            'status' => $commitment->status,
            'object' => $commitment->object,
            'circuit_code' => $commitment->circuit_code,
            'amount_xaf' => (string) $commitment->amount_xaf,
            'reserved_xaf' => $figures['reserved_xaf'],
            'committed_xaf' => $figures['committed_xaf'],
            'eb_remainder_xaf' => $figures['eb_remainder_xaf'],
            'official_documents' => OfficialDocumentPayload::for($commitment),
            'need_request' => $commitment->relationLoaded('needRequest') && $commitment->needRequest !== null ? [
                'id' => $commitment->needRequest->id,
                'reference' => $commitment->needRequest->reference,
                'amount_xaf' => (string) $commitment->needRequest->amount_xaf,
            ] : null,
            'liquidations' => $commitment->relationLoaded('liquidations')
                ? $commitment->liquidations->map(fn ($liquidation): array => [
                    'id' => $liquidation->id,
                    'reference' => $liquidation->reference,
                    'status' => $liquidation->status,
                ])->values()
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
