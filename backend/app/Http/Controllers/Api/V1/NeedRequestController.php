<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Expenditure\ChainListPreloader;
use App\Domain\Expenditure\NeedRequestService;
use App\Http\Controllers\Controller;
use App\Models\NeedRequest;
use App\Models\Task;
use App\Support\ApiResponse;
use App\Support\OfficialDocumentPayload;
use App\Support\WorkflowCursor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NeedRequestController extends Controller
{
    public function __construct(
        private readonly NeedRequestService $needs,
        private readonly ChainListPreloader $lists,
    ) {}

    public function readiness(Request $request): JsonResponse
    {
        return ApiResponse::success(
            $this->needs->readiness($request->user()),
            'Conditions d’ouverture.',
        );
    }

    public function index(): JsonResponse
    {
        $requests = NeedRequest::query()
            ->with(['workflow.currentStep', 'commitment'])
            ->orderByDesc('created_at')
            ->get();
        $this->lists->needRequests($requests);

        return ApiResponse::success(
            $requests->map(fn (NeedRequest $need): array => $this->payload($need))->values(),
            'Expressions de besoin.',
        );
    }

    public function show(NeedRequest $needRequest): JsonResponse
    {
        $needRequest->load(['lines', 'documents', 'workflow.currentStep', 'commitment', 'budgetLine']);

        return ApiResponse::success($this->payload($needRequest, true), 'Expression de besoin.');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'budget_line_id' => ['required', 'uuid'],
            'organization_unit_id' => ['required', 'uuid'],
            'object' => ['required', 'string', 'max:200'],
            'justification' => ['required', 'string'],
            'need_on' => ['required', 'date'],
            'amount_xaf' => ['nullable', 'regex:/^\d+$/'],
            'lines' => ['required', 'array', 'min:1'],
            'lines.*.designation' => ['required', 'string', 'max:200'],
            'lines.*.quantity' => ['required', 'regex:/^\d+$/'],
            'lines.*.unit' => ['required', 'string', 'max:40'],
            'lines.*.unit_price_xaf' => ['required', 'regex:/^\d+$/'],
            'lines.*.amount_xaf' => ['nullable', 'regex:/^\d+$/'],
            'documents' => ['nullable', 'array'],
            'documents.*.kind' => ['required', 'string', 'max:40'],
            'documents.*.label' => ['required', 'string', 'max:200'],
            'documents.*.is_present' => ['required', 'boolean'],
        ]);

        $need = $this->needs->create($request->user(), $data);

        return ApiResponse::success($this->payload($need, true), 'Expression de besoin créée.', 201);
    }

    public function transition(Request $request, NeedRequest $needRequest): JsonResponse
    {
        $data = $request->validate([
            'action' => ['required', 'string', 'max:40'],
            'reason' => ['nullable', 'string'],
        ]);

        $need = $this->needs->transition(
            $request->user(),
            $needRequest,
            $data['action'],
            $data['reason'] ?? null,
        );

        return ApiResponse::success($this->payload($need, true), 'Transition enregistrée.');
    }

    public function revise(Request $request, NeedRequest $needRequest): JsonResponse
    {
        $need = $this->needs->revise($request->user(), $needRequest);

        return ApiResponse::success($this->payload($need, true), 'Nouvelle version créée.', 201);
    }

    public function tasks(Request $request): JsonResponse
    {
        $roles = $request->user()->activeRoleCodes();
        $tasks = Task::query()
            ->with('needRequest')
            ->where('status', 'open')
            ->whereIn('assignee_role_code', $roles === [] ? ['__none__'] : $roles)
            ->orderByDesc('created_at')
            ->get();

        return ApiResponse::success(
            $tasks->map(fn (Task $task): array => [
                'id' => $task->id,
                'title' => $task->title,
                'assignee_role_code' => $task->assignee_role_code,
                'need_request_id' => $task->need_request_id,
                'reference' => $task->needRequest?->reference,
                'created_at' => $task->created_at?->toIso8601String(),
            ])->values(),
            'Tâches.',
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(NeedRequest $need, bool $detailed = false): array
    {
        $step = $need->workflow?->currentStep;
        $last = WorkflowCursor::last($need->workflow);

        $payload = [
            'id' => $need->id,
            'reference' => $need->reference,
            'version_number' => $need->version_number,
            'parent_id' => $need->parent_id,
            'circuit_code' => $need->circuit_code,
            'object' => $need->object,
            'status' => $need->status,
            'amount_xaf' => (string) $need->amount_xaf,
            'need_on' => $need->need_on?->toDateString(),
            'program_chain' => null,
            'official_documents' => OfficialDocumentPayload::for($need),
            'commitment' => $need->relationLoaded('commitment') && $need->commitment !== null ? [
                'id' => $need->commitment->id,
                'reference' => $need->commitment->reference,
                'status' => $need->commitment->status,
            ] : null,
            'banner' => [
                'current_step' => $step?->label,
                'expected_role' => $step?->actor_role_code,
                'last_action' => $last?->action,
                'last_actor_id' => $last?->actor_id,
                'last_at' => $last?->created_at?->toIso8601String(),
                'reason' => $last?->reason,
            ],
        ];

        if ($detailed) {
            $payload['justification'] = $need->justification;
            $payload['program_chain_note'] = str_starts_with($need->circuit_code, 'EB-PAP')
                ? 'La chaîne GAR/RBM n’est pas importée. Elle n’est pas ressaisie ici.'
                : null;
            $payload['lines'] = $need->relationLoaded('lines') ? $need->lines->map(fn ($line): array => [
                'designation' => $line->designation,
                'quantity' => $line->quantity,
                'unit' => $line->unit,
                'unit_price_xaf' => (string) $line->unit_price_xaf,
                'amount_xaf' => (string) $line->amount_xaf,
            ])->values() : [];
            $payload['documents'] = $need->relationLoaded('documents') ? $need->documents->map(fn ($document): array => [
                'kind' => $document->kind,
                'label' => $document->label,
                'is_present' => $document->is_present,
            ])->values() : [];
        }

        return $payload;
    }
}
