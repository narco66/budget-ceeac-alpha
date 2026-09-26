<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Budget\BudgetBalance;
use App\Domain\Budget\BudgetImportService;
use App\Domain\Budget\BudgetMovementService;
use App\Domain\Budget\BudgetVersionService;
use App\Domain\Budget\OfficialBudgetControls;
use App\Http\Controllers\Controller;
use App\Models\BudgetImportBatch;
use App\Models\BudgetMovement;
use App\Models\BudgetVersion;
use App\Models\FiscalYear;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class BudgetController extends Controller
{
    public function __construct(
        private readonly BudgetVersionService $versions,
        private readonly BudgetMovementService $movements,
        private readonly BudgetImportService $imports,
        private readonly BudgetBalance $balance,
    ) {}

    public function controls(): JsonResponse
    {
        $promoted = BudgetImportBatch::query()
            ->where('mode', 'official_2026')
            ->whereNotNull('budget_version_id')
            ->exists();

        return ApiResponse::success([
            'year' => OfficialBudgetControls::YEAR,
            'role' => 'control_checkpoint',
            'official_import_promoted' => $promoted,
            'amounts_xaf' => [
                'revenue' => OfficialBudgetControls::TOTAL_REVENUE,
                'expenditure' => OfficialBudgetControls::TOTAL_EXPENDITURE,
                'fonctionnement' => OfficialBudgetControls::FONCTIONNEMENT,
                'investissement' => OfficialBudgetControls::INVESTISSEMENT,
                'equipement' => OfficialBudgetControls::EQUIPEMENT,
            ],
        ], 'Totaux de contrôle.');
    }

    public function index(): JsonResponse
    {
        $versions = BudgetVersion::query()
            ->with('fiscalYear')
            ->withCount('lines')
            ->orderByDesc('created_at')
            ->get();

        return ApiResponse::success(
            $versions->map(fn (BudgetVersion $version): array => $this->versionPayload($version))->values(),
            'Versions budgétaires.',
        );
    }

    public function show(BudgetVersion $budgetVersion): JsonResponse
    {
        $budgetVersion->load(['fiscalYear', 'lines.events']);

        return ApiResponse::success($this->versionPayload($budgetVersion, true), 'Version budgétaire.');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'fiscal_year_id' => ['required', 'uuid', 'exists:fiscal_years,id'],
            'code' => ['required', 'string', 'max:40'],
            'label' => ['required', 'string', 'max:200'],
            'note' => ['nullable', 'string'],
        ]);

        $version = $this->versions->createDraft(
            FiscalYear::query()->findOrFail($data['fiscal_year_id']),
            $data['code'],
            $data['label'],
            $data['note'] ?? null,
        );

        return ApiResponse::success($this->versionPayload($version), 'Version créée.', 201);
    }

    public function addLine(Request $request, BudgetVersion $budgetVersion): JsonResponse
    {
        $data = $request->validate([
            'nature' => ['required', Rule::in(['expenditure', 'revenue'])],
            'segment' => ['required', 'string'],
            'funding_source' => ['required', Rule::in(['ceeac', 'ptf'])],
            'code' => ['required', 'string', 'max:40'],
            'label' => ['required', 'string', 'max:200'],
            'amount_xaf' => ['required', 'regex:/^\d+$/'],
        ]);

        $line = $this->versions->addLine($budgetVersion, $data);

        return ApiResponse::success([
            'id' => $line->id,
            'code' => $line->code,
            'initial_amount_xaf' => (string) $line->initial_amount_xaf,
        ], 'Ligne ajoutée.', 201);
    }

    public function publish(BudgetVersion $budgetVersion): JsonResponse
    {
        $version = $this->versions->publish($budgetVersion);

        return ApiResponse::success($this->versionPayload($version), 'Version publiée.');
    }

    public function execute(BudgetVersion $budgetVersion): JsonResponse
    {
        $version = $this->versions->markExecutable($budgetVersion);

        return ApiResponse::success($this->versionPayload($version), 'Version exécutoire.');
    }

    public function storeMovement(Request $request): JsonResponse
    {
        $data = $request->validate([
            'budget_version_id' => ['required', 'uuid', 'exists:budget_versions,id'],
            'movement_type' => ['required', Rule::in(['virement', 'transfert', 'annulation', 'ouverture', 'gel', 'degel'])],
            'reason' => ['required', 'string'],
            'lines' => ['required', 'array', 'min:1'],
            'lines.*.budget_line_id' => ['required', 'uuid'],
            'lines.*.direction' => ['required', Rule::in(['increase', 'decrease', 'freeze', 'unfreeze'])],
            'lines.*.amount_xaf' => ['required', 'regex:/^\d+$/'],
        ]);

        $movement = $this->movements->draft(
            BudgetVersion::query()->findOrFail($data['budget_version_id']),
            $data['movement_type'],
            $data['reason'],
            $data['lines'],
        );

        return ApiResponse::success([
            'id' => $movement->id,
            'reference' => $movement->reference,
            'status' => $movement->status,
        ], 'Mouvement préparé.', 201);
    }

    public function validateMovement(BudgetMovement $budgetMovement): JsonResponse
    {
        $movement = $this->movements->validate($budgetMovement);

        return ApiResponse::success([
            'id' => $movement->id,
            'reference' => $movement->reference,
            'status' => $movement->status,
        ], 'Mouvement appliqué.');
    }

    public function import(Request $request): JsonResponse
    {
        $data = $request->validate([
            'fiscal_year_id' => ['required', 'uuid', 'exists:fiscal_years,id'],
            'mode' => ['required', Rule::in(['official_2026', 'draft'])],
            'lines' => ['required', 'array', 'min:1'],
            'lines.*.nature' => ['required', 'string'],
            'lines.*.segment' => ['required', 'string'],
            'lines.*.funding_source' => ['required', 'string'],
            'lines.*.code' => ['required', 'string'],
            'lines.*.label' => ['required', 'string'],
            'lines.*.amount_xaf' => ['required', 'string'],
        ]);

        $batch = $this->imports->stage(
            FiscalYear::query()->findOrFail($data['fiscal_year_id']),
            $data['mode'],
            $data['lines'],
        );

        return ApiResponse::success($this->batchPayload($batch), 'Lot d’import examiné.', 201);
    }

    public function promote(BudgetImportBatch $budgetImportBatch): JsonResponse
    {
        $version = $this->imports->promote($budgetImportBatch);

        return ApiResponse::success($this->versionPayload($version->loadCount('lines')), 'Lot promu en brouillon.', 201);
    }

    /**
     * @return array<string, mixed>
     */
    private function versionPayload(BudgetVersion $version, bool $withLines = false): array
    {
        $payload = [
            'id' => $version->id,
            'code' => $version->code,
            'label' => $version->label,
            'status' => $version->status,
            'fiscal_year' => $version->relationLoaded('fiscalYear') ? $version->fiscalYear->year : null,
            'published_at' => $version->published_at?->toIso8601String(),
            'lines_count' => $version->lines_count ?? $version->lines()->count(),
            'note' => $version->note,
        ];

        if ($withLines) {
            $payload['lines'] = $version->lines->map(function ($line): array {
                $amounts = $line->relationLoaded('events') ? $this->balance->forLine($line) : null;

                return [
                    'id' => $line->id,
                    'code' => $line->code,
                    'label' => $line->label,
                    'nature' => $line->nature,
                    'segment' => $line->segment,
                    'funding_source' => $line->funding_source,
                    'initial_amount_xaf' => (string) $line->initial_amount_xaf,
                    'balance' => $amounts,
                ];
            })->values();
            $payload['expenditure_total_xaf'] = $this->balance->expenditureTotal($version);
            $payload['investissement_xaf'] = $this->balance->segmentTotal($version, 'investissement');
        }

        return $payload;
    }

    /**
     * @return array<string, mixed>
     */
    private function batchPayload(BudgetImportBatch $batch): array
    {
        return [
            'id' => $batch->id,
            'status' => $batch->status,
            'mode' => $batch->mode,
            'report' => $batch->report,
            'budget_version_id' => $batch->budget_version_id,
        ];
    }
}
