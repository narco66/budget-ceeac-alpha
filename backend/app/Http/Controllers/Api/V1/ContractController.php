<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Contracts\ContractService;
use App\Http\Controllers\Controller;
use App\Models\Contract;
use App\Models\ProcurementThreshold;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    public function __construct(private readonly ContractService $contracts) {}

    public function index(): JsonResponse
    {
        $rows = Contract::query()->with('party')->orderByDesc('created_at')->get();

        return ApiResponse::success(
            $rows->map(fn (Contract $contract): array => $this->payload($contract))->values(),
            'Contrats.',
        );
    }

    public function show(Contract $contract): JsonResponse
    {
        $contract->load('party');

        return ApiResponse::success($this->payload($contract), 'Contrat.');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'party_id' => ['required', 'uuid', 'exists:parties,id'],
            'fiscal_year_id' => ['required', 'uuid', 'exists:fiscal_years,id'],
            'contract_type' => ['required', 'in:marche,contrat,bon_commande,convention'],
            'object' => ['required', 'string', 'max:255'],
            'amount_xaf' => ['required', 'regex:/^[0-9]+$/'],
        ]);

        $contract = $this->contracts->open($data);
        $contract->load('party');

        return ApiResponse::success($this->payload($contract), 'Contrat ouvert.', 201);
    }

    public function amend(Request $request, Contract $contract): JsonResponse
    {
        $data = $request->validate([
            'direction' => ['required', 'in:increase,decrease'],
            'amount_xaf' => ['required', 'regex:/^[0-9]+$/'],
            'reason' => ['required', 'string', 'max:1000'],
        ]);

        $this->contracts->amend($contract, $data['direction'], $data['amount_xaf'], $data['reason']);
        $contract->load('party');

        return ApiResponse::success($this->payload($contract), 'Avenant enregistré.');
    }

    public function thresholds(): JsonResponse
    {
        $rows = ProcurementThreshold::query()->where('status', 'active')->orderBy('procedure_code')->get();

        return ApiResponse::success(
            $rows->map(fn (ProcurementThreshold $row): array => [
                'procedure_code' => $row->procedure_code,
                'amount_xaf' => (string) $row->amount_xaf,
                'effective_on' => $row->effective_on,
            ])->values(),
            $rows->isEmpty()
                ? 'Aucun seuil de procédure n’est configuré.'
                : 'Seuils de procédure.',
        );
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(Contract $contract): array
    {
        return [
            'id' => $contract->id,
            'reference' => $contract->reference,
            'contract_type' => $contract->contract_type,
            'object' => $contract->object,
            'party' => [
                'id' => $contract->party_id,
                'legal_name' => $contract->party?->legal_name,
            ],
            'amount_xaf' => (string) $contract->amount_xaf,
            'revised_xaf' => $this->contracts->revised($contract),
            'status' => $contract->status,
            'linked_spend' => null,
        ];
    }
}
