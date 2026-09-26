<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Parties\PartyService;
use App\Http\Controllers\Controller;
use App\Models\Party;
use App\Models\PartyBankAccount;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PartyController extends Controller
{
    public function __construct(private readonly PartyService $parties) {}

    public function index(): JsonResponse
    {
        $rows = Party::query()->orderBy('legal_name')->get();

        return ApiResponse::success(
            $rows->map(fn (Party $party): array => $this->payload($party))->values(),
            'Tiers.',
        );
    }

    public function show(Party $party): JsonResponse
    {
        return ApiResponse::success($this->payload($party, true), 'Tiers.');
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'legal_name' => ['required', 'string', 'max:255'],
            'party_type' => ['required', 'in:enterprise,supplier,consultant,beneficiary'],
            'country' => ['nullable', 'string', 'max:80'],
            'tax_identifier' => ['nullable', 'string', 'max:80'],
        ]);

        $party = $this->parties->register($data);

        return ApiResponse::success($this->payload($party), 'Tiers enregistré.', 201);
    }

    public function status(Request $request, Party $party): JsonResponse
    {
        $data = $request->validate([
            'status' => ['required', 'in:active,suspended,blocked,archived'],
            'reason' => ['nullable', 'string', 'max:1000'],
        ]);

        $party = $this->parties->changeStatus($party, $data['status'], (string) ($data['reason'] ?? ''));

        return ApiResponse::success($this->payload($party), 'Statut du tiers.');
    }

    public function storeAccount(Request $request, Party $party): JsonResponse
    {
        $data = $request->validate([
            'bank_name' => ['required', 'string', 'max:160'],
            'account_number' => ['required', 'string', 'max:80'],
        ]);

        $account = $this->parties->addAccount($party, $request->user(), $data);

        return ApiResponse::success($this->accountPayload($account), 'Compte déclaré, en attente d’activation.', 201);
    }

    public function activateAccount(Request $request, PartyBankAccount $account): JsonResponse
    {
        $account = $this->parties->activateAccount($account, $request->user());

        return ApiResponse::success($this->accountPayload($account), 'Compte activé.');
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(Party $party, bool $withAccounts = false): array
    {
        $payload = [
            'id' => $party->id,
            'legal_name' => $party->legal_name,
            'party_type' => $party->party_type,
            'country' => $party->country,
            'tax_identifier' => $party->tax_identifier,
            'status' => $party->status,
            'status_reason' => $party->status_reason,
        ];

        if ($withAccounts) {
            $payload['bank_accounts'] = $party->bankAccounts()
                ->orderBy('created_at')
                ->get()
                ->map(fn (PartyBankAccount $account): array => $this->accountPayload($account))
                ->values();
        }

        return $payload;
    }

    /**
     * @return array<string, mixed>
     */
    private function accountPayload(PartyBankAccount $account): array
    {
        return [
            'id' => $account->id,
            'party_id' => $account->party_id,
            'bank_name' => $account->bank_name,
            'account_number' => $account->account_number,
            'status' => $account->status,
            'supersedes_id' => $account->supersedes_id,
            'created_by' => $account->created_by,
            'activated_by' => $account->activated_by,
        ];
    }
}
