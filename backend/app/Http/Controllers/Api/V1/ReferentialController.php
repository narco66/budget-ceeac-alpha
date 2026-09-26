<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\FiscalYearResource;
use App\Http\Resources\NomenclatureVersionResource;
use App\Http\Resources\NumberSequenceResource;
use App\Http\Resources\SystemParameterResource;
use App\Http\Resources\WorkflowDefinitionResource;
use App\Models\FiscalYear;
use App\Models\NomenclatureVersion;
use App\Models\NumberSequence;
use App\Models\SystemParameter;
use App\Models\WorkflowDefinition;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class ReferentialController extends Controller
{
    public function fiscalYears(): JsonResponse
    {
        $years = FiscalYear::query()
            ->with('currency')
            ->orderByDesc('year')
            ->get();

        return ApiResponse::success(
            FiscalYearResource::collection($years),
            'Exercices.',
        );
    }

    public function fiscalYear(FiscalYear $fiscalYear): JsonResponse
    {
        $fiscalYear->load(['currency', 'periods' => fn ($query) => $query->orderBy('position')]);

        return ApiResponse::success(
            new FiscalYearResource($fiscalYear),
            'Exercice.',
        );
    }

    public function workflows(): JsonResponse
    {
        $definitions = WorkflowDefinition::query()
            ->with(['steps' => fn ($query) => $query->orderBy('position')])
            ->orderBy('domain')
            ->orderBy('code')
            ->get();

        return ApiResponse::success(
            WorkflowDefinitionResource::collection($definitions),
            'Circuits.',
        );
    }

    public function workflow(WorkflowDefinition $workflowDefinition): JsonResponse
    {
        $workflowDefinition->load([
            'steps' => fn ($query) => $query->orderBy('position'),
            'transitions',
        ]);

        return ApiResponse::success(
            new WorkflowDefinitionResource($workflowDefinition),
            'Circuit.',
        );
    }

    public function parameters(): JsonResponse
    {
        $parameters = SystemParameter::query()
            ->orderBy('code')
            ->orderByDesc('version')
            ->get();

        return ApiResponse::success(
            SystemParameterResource::collection($parameters),
            'Paramètres.',
        );
    }

    public function sequences(): JsonResponse
    {
        $sequences = NumberSequence::query()
            ->with('fiscalYear')
            ->orderBy('domain')
            ->get();

        return ApiResponse::success(
            NumberSequenceResource::collection($sequences),
            'Séquences de numérotation.',
        );
    }

    public function nomenclature(): JsonResponse
    {
        $versions = NomenclatureVersion::query()
            ->withCount('items')
            ->orderBy('code')
            ->get();

        return ApiResponse::success(
            NomenclatureVersionResource::collection($versions),
            'Nomenclatures.',
        );
    }
}
