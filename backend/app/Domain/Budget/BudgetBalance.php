<?php

namespace App\Domain\Budget;

use App\Domain\Money\IntegerAmount;
use App\Models\BudgetLine;
use App\Models\BudgetVersion;
use Illuminate\Support\Collection;

class BudgetBalance
{
    /**
     * @return array{initial_xaf: string, revised_xaf: string, frozen_xaf: string, reserved_xaf: string, committed_xaf: string, available_xaf: string}
     */
    public function forLine(BudgetLine $line): array
    {
        $initial = '0';
        $increase = '0';
        $decrease = '0';
        $freeze = '0';
        $unfreeze = '0';
        $reserve = '0';
        $releaseReserve = '0';
        $commit = '0';
        $releaseCommit = '0';

        foreach ($line->events as $event) {
            $amount = IntegerAmount::assert((string) $event->amount_xaf);
            match ($event->event_type) {
                'initial' => $initial = IntegerAmount::add($initial, $amount),
                'increase' => $increase = IntegerAmount::add($increase, $amount),
                'decrease' => $decrease = IntegerAmount::add($decrease, $amount),
                'freeze' => $freeze = IntegerAmount::add($freeze, $amount),
                'unfreeze' => $unfreeze = IntegerAmount::add($unfreeze, $amount),
                'reserve' => $reserve = IntegerAmount::add($reserve, $amount),
                'release_reserve' => $releaseReserve = IntegerAmount::add($releaseReserve, $amount),
                'commit' => $commit = IntegerAmount::add($commit, $amount),
                'release_commit' => $releaseCommit = IntegerAmount::add($releaseCommit, $amount),
                default => null,
            };
        }

        $revised = IntegerAmount::subtract(IntegerAmount::add($initial, $increase), $decrease);
        $frozen = IntegerAmount::subtract($freeze, $unfreeze);
        $reserved = IntegerAmount::subtract($reserve, $releaseReserve);
        $committed = IntegerAmount::subtract($commit, $releaseCommit);
        $available = IntegerAmount::subtract($revised, IntegerAmount::add($frozen, IntegerAmount::add($reserved, $committed)));

        return [
            'initial_xaf' => $initial,
            'revised_xaf' => $revised,
            'frozen_xaf' => $frozen,
            'reserved_xaf' => $reserved,
            'committed_xaf' => $committed,
            'available_xaf' => $available,
        ];
    }

    /**
     * Somme des révisés de dépense, chaque ligne une seule fois.
     * L'investissement (PAP) est un segment, il n'est pas ajouté au total.
     */
    public function expenditureTotal(BudgetVersion $version): string
    {
        return $this->sumRevised($version->lines->where('nature', 'expenditure'));
    }

    public function segmentTotal(BudgetVersion $version, string $segment): string
    {
        return $this->sumRevised(
            $version->lines->where('nature', 'expenditure')->where('segment', $segment),
        );
    }

    /**
     * @param  Collection<int, BudgetLine>  $lines
     */
    private function sumRevised(Collection $lines): string
    {
        $total = '0';
        foreach ($lines as $line) {
            $total = IntegerAmount::add($total, $this->forLine($line)['revised_xaf']);
        }

        return $total;
    }
}
