<?php

namespace App\Domain\Contracts;

use App\Domain\Money\IntegerAmount;
use App\Domain\Referentials\NumberSequenceAllocator;
use App\Exceptions\ContractRuleException;
use App\Models\Contract;
use App\Models\ContractAmendment;
use App\Models\FiscalYear;
use App\Models\Party;

class ContractService
{
    public function __construct(private readonly NumberSequenceAllocator $sequences) {}

    /**
     * @param  array{party_id: string, fiscal_year_id: string, contract_type: string, object: string, amount_xaf: string}  $payload
     */
    public function open(array $payload): Contract
    {
        $party = Party::query()->findOrFail($payload['party_id']);
        if ($party->status !== 'active') {
            throw new ContractRuleException('Le contrat exige un tiers actif.');
        }
        $year = FiscalYear::query()->findOrFail($payload['fiscal_year_id']);
        $amount = IntegerAmount::assert($payload['amount_xaf']);
        if (IntegerAmount::compare($amount, '0') <= 0) {
            throw new ContractRuleException('Le montant initial du contrat doit être positif.');
        }

        return Contract::query()->create([
            'party_id' => $party->id,
            'fiscal_year_id' => $year->id,
            'reference' => $this->sequences->next('CTR', $year),
            'contract_type' => $payload['contract_type'],
            'object' => $payload['object'],
            'amount_xaf' => $amount,
            'status' => 'open',
        ]);
    }

    public function amend(Contract $contract, string $direction, string $amount, string $reason): ContractAmendment
    {
        if (! in_array($direction, ['increase', 'decrease'], true)) {
            throw new ContractRuleException('L’avenant augmente ou diminue le montant.');
        }
        if (trim($reason) === '') {
            throw new ContractRuleException('L’avenant exige un motif.');
        }
        $delta = IntegerAmount::assert($amount);
        if (IntegerAmount::compare($delta, '0') <= 0) {
            throw new ContractRuleException('Le montant de l’avenant doit être positif.');
        }
        if ($direction === 'decrease' && IntegerAmount::compare($this->revised($contract), $delta) < 0) {
            throw new ContractRuleException('L’avenant ramènerait le montant révisé sous zéro.');
        }

        return ContractAmendment::query()->create([
            'contract_id' => $contract->id,
            'direction' => $direction,
            'amount_xaf' => $delta,
            'reason' => $reason,
        ]);
    }

    public function revised(Contract $contract): string
    {
        $total = IntegerAmount::assert((string) $contract->amount_xaf);
        foreach ($contract->amendments()->get() as $amendment) {
            $amount = IntegerAmount::assert((string) $amendment->amount_xaf);
            $total = $amendment->direction === 'increase'
                ? IntegerAmount::add($total, $amount)
                : IntegerAmount::subtract($total, $amount);
        }

        return $total;
    }
}
