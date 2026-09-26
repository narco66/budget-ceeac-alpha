<?php

namespace App\Domain\Budget;

use App\Domain\Money\IntegerAmount;
use App\Domain\Referentials\NumberSequenceAllocator;
use App\Exceptions\BudgetRuleException;
use App\Models\BudgetEvent;
use App\Models\BudgetLine;
use App\Models\BudgetMovement;
use App\Models\BudgetVersion;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class BudgetMovementService
{
    public function __construct(
        private readonly NumberSequenceAllocator $allocator,
        private readonly BudgetBalance $balance,
    ) {}

    /**
     * @param  list<array{budget_line_id: string, direction: string, amount_xaf: string}>  $lines
     */
    public function draft(BudgetVersion $version, string $type, string $reason, array $lines): BudgetMovement
    {
        if (! $version->isImmutable()) {
            throw new BudgetRuleException('Un mouvement ne s’applique qu’à une version publiée ou exécutoire.');
        }
        if (trim($reason) === '') {
            throw new BudgetRuleException('Un mouvement exige un motif.');
        }

        $this->assertShape($type, $lines);

        return DB::transaction(function () use ($version, $type, $reason, $lines): BudgetMovement {
            $version->load('fiscalYear');
            $reference = $this->allocator->next('MOV', $version->fiscalYear);

            $movement = BudgetMovement::query()->create([
                'budget_version_id' => $version->id,
                'reference' => $reference,
                'movement_type' => $type,
                'status' => 'draft',
                'reason' => $reason,
            ]);

            foreach ($lines as $line) {
                $budgetLine = BudgetLine::query()->whereKey($line['budget_line_id'])->firstOrFail();
                if ($budgetLine->budget_version_id !== $version->id) {
                    throw new BudgetRuleException('La ligne n’appartient pas à cette version.');
                }
                $movement->lines()->create([
                    'budget_line_id' => $budgetLine->id,
                    'direction' => $line['direction'],
                    'amount_xaf' => IntegerAmount::assert($line['amount_xaf']),
                ]);
            }

            return $movement->load('lines');
        });
    }

    public function validate(BudgetMovement $movement): BudgetMovement
    {
        if ($movement->status !== 'draft') {
            throw new BudgetRuleException('Ce mouvement est déjà traité.');
        }

        return DB::transaction(function () use ($movement): BudgetMovement {
            $locked = BudgetMovement::query()->whereKey($movement->id)->lockForUpdate()->firstOrFail();
            $locked->load('lines.budgetLine.events');

            foreach ($locked->lines as $movementLine) {
                $budgetLine = BudgetLine::query()->whereKey($movementLine->budget_line_id)->lockForUpdate()->firstOrFail();
                $budgetLine->load('events');
                $amounts = $this->balance->forLine($budgetLine);
                $amount = IntegerAmount::assert((string) $movementLine->amount_xaf);

                try {
                    match ($movementLine->direction) {
                        'decrease' => IntegerAmount::subtract($amounts['revised_xaf'], $amount),
                        'unfreeze' => IntegerAmount::subtract($amounts['frozen_xaf'], $amount),
                        'freeze' => IntegerAmount::subtract($amounts['available_xaf'], $amount),
                        'increase' => $amount,
                        default => throw new BudgetRuleException('Direction de mouvement inconnue.'),
                    };
                } catch (InvalidArgumentException) {
                    throw new BudgetRuleException('Le mouvement dépasse le solde de la ligne '.$budgetLine->code.'.');
                }

                $eventType = match ($movementLine->direction) {
                    'increase' => 'increase',
                    'decrease' => 'decrease',
                    'freeze' => 'freeze',
                    'unfreeze' => 'unfreeze',
                    default => throw new BudgetRuleException('Direction de mouvement inconnue.'),
                };

                BudgetEvent::query()->create([
                    'budget_line_id' => $budgetLine->id,
                    'event_type' => $eventType,
                    'amount_xaf' => $amount,
                    'source_type' => BudgetMovement::class,
                    'source_id' => $locked->id,
                ]);
            }

            $locked->update([
                'status' => 'validated',
                'validated_at' => now(),
            ]);

            return $locked->refresh();
        });
    }

    /**
     * @param  list<array{budget_line_id: string, direction: string, amount_xaf: string}>  $lines
     */
    private function assertShape(string $type, array $lines): void
    {
        if ($lines === []) {
            throw new BudgetRuleException('Un mouvement contient au moins une ligne.');
        }

        $decrease = '0';
        $increase = '0';
        foreach ($lines as $line) {
            $amount = IntegerAmount::assert($line['amount_xaf']);
            if (IntegerAmount::compare($amount, '0') === 0) {
                throw new BudgetRuleException('Un montant nul n’est pas un mouvement.');
            }
            match ($line['direction']) {
                'decrease' => $decrease = IntegerAmount::add($decrease, $amount),
                'increase' => $increase = IntegerAmount::add($increase, $amount),
                'freeze', 'unfreeze' => null,
                default => throw new BudgetRuleException('Direction de mouvement inconnue.'),
            };
        }

        $directions = array_unique(array_column($lines, 'direction'));

        match ($type) {
            'virement', 'transfert' => $this->assertBalanced($decrease, $increase, $directions),
            'annulation' => $this->assertOnly($directions, ['decrease']),
            'ouverture' => $this->assertOnly($directions, ['increase']),
            'gel' => $this->assertOnly($directions, ['freeze']),
            'degel' => $this->assertOnly($directions, ['unfreeze']),
            default => throw new BudgetRuleException('Type de mouvement inconnu.'),
        };
    }

    /**
     * @param  list<string>  $directions
     */
    private function assertBalanced(string $decrease, string $increase, array $directions): void
    {
        $this->assertOnly($directions, ['decrease', 'increase']);
        if (! in_array('decrease', $directions, true) || ! in_array('increase', $directions, true)) {
            throw new BudgetRuleException('Un virement ou un transfert a une origine et une destination.');
        }
        if (IntegerAmount::compare($decrease, $increase) !== 0) {
            throw new BudgetRuleException('L’origine et la destination d’un virement doivent être égales.');
        }
    }

    /**
     * @param  list<string>  $directions
     * @param  list<string>  $allowed
     */
    private function assertOnly(array $directions, array $allowed): void
    {
        foreach ($directions as $direction) {
            if (! in_array($direction, $allowed, true)) {
                throw new BudgetRuleException('La direction ne correspond pas au type de mouvement.');
            }
        }
    }
}
