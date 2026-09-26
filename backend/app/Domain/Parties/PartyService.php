<?php

namespace App\Domain\Parties;

use App\Exceptions\PartyRuleException;
use App\Models\Party;
use App\Models\PartyBankAccount;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class PartyService
{
    /**
     * @param  array{legal_name: string, party_type: string, country?: string|null, tax_identifier?: string|null}  $payload
     */
    public function register(array $payload): Party
    {
        $name = trim((string) preg_replace('/\s+/', ' ', $payload['legal_name']));
        $key = mb_strtolower($name);
        if (Party::query()->where('name_key', $key)->exists()) {
            throw new PartyRuleException('Un tiers porte déjà cette raison sociale.');
        }

        return Party::query()->create([
            'legal_name' => $name,
            'name_key' => $key,
            'party_type' => $payload['party_type'],
            'country' => $payload['country'] ?? null,
            'tax_identifier' => $payload['tax_identifier'] ?? null,
            'status' => 'active',
        ]);
    }

    public function changeStatus(Party $party, string $status, string $reason): Party
    {
        if (! in_array($status, ['active', 'suspended', 'blocked', 'archived'], true)) {
            throw new PartyRuleException('Statut de tiers inconnu.');
        }
        if ($status !== 'active' && trim($reason) === '') {
            throw new PartyRuleException('Un motif est requis pour suspendre, bloquer ou archiver un tiers.');
        }

        $party->update([
            'status' => $status,
            'status_reason' => $status === 'active' ? null : $reason,
        ]);

        return $party->refresh();
    }

    /**
     * @param  array{bank_name: string, account_number: string}  $payload
     */
    public function addAccount(Party $party, User $author, array $payload): PartyBankAccount
    {
        if ($party->status !== 'active') {
            throw new PartyRuleException('Un compte bancaire se rattache à un tiers actif.');
        }

        return PartyBankAccount::query()->create([
            'party_id' => $party->id,
            'bank_name' => $payload['bank_name'],
            'account_number' => $payload['account_number'],
            'status' => 'pending',
            'created_by' => $author->id,
        ]);
    }

    public function activateAccount(PartyBankAccount $account, User $actor): PartyBankAccount
    {
        if ($account->status !== 'pending') {
            throw new PartyRuleException('Seul un compte en attente peut être activé.');
        }
        if ($account->created_by === $actor->id) {
            throw new PartyRuleException('Le déclarant du compte ne peut pas l’activer.');
        }

        return DB::transaction(function () use ($account, $actor): PartyBankAccount {
            $current = PartyBankAccount::query()
                ->where('party_id', $account->party_id)
                ->where('status', 'active')
                ->lockForUpdate()
                ->first();

            if ($current !== null) {
                $current->update(['status' => 'superseded']);
            }

            $account->update([
                'status' => 'active',
                'activated_by' => $actor->id,
                'supersedes_id' => $current?->id,
            ]);

            return $account->refresh();
        });
    }
}
