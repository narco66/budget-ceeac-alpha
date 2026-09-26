<?php

namespace App\Domain\Expenditure;

use App\Models\BudgetEvent;
use App\Models\Commitment;
use App\Support\OfficialDocumentPayload;
use Illuminate\Support\Collection;

class ChainListPreloader
{
    /**
     * @param  Collection<int, mixed>  $rows
     */
    public function needRequests(Collection $rows): void
    {
        $rows->load('workflow.events');
        OfficialDocumentPayload::preload($rows);
    }

    /**
     * @param  Collection<int, Commitment>  $rows
     */
    public function commitments(Collection $rows): void
    {
        $rows->load('workflow.events');
        OfficialDocumentPayload::preload($rows);
        $this->attachCommitmentFigures($rows);
    }

    /**
     * @param  Collection<int, mixed>  $rows
     */
    public function liquidations(Collection $rows): void
    {
        $rows->load(['workflow.events', 'commitment.liquidations', 'commitment.needRequest']);
        OfficialDocumentPayload::preload($rows);
        $commitments = $rows->map(fn ($row) => $row->commitment)->filter()->unique('id')->values();
        $this->attachCommitmentFigures($commitments);
    }

    /**
     * @param  Collection<int, mixed>  $rows
     */
    public function orders(Collection $rows): void
    {
        $rows->load(['workflow.events', 'liquidation.paymentOrders']);
        OfficialDocumentPayload::preload($rows);
    }

    /**
     * @param  Collection<int, mixed>  $rows
     */
    public function payments(Collection $rows): void
    {
        $rows->load(['workflow.events', 'paymentOrder.payments']);
        OfficialDocumentPayload::preload($rows);
    }

    /**
     * @param  Collection<int, Commitment>  $commitments
     */
    private function attachCommitmentFigures(Collection $commitments): void
    {
        if ($commitments->isEmpty()) {
            return;
        }

        $events = BudgetEvent::query()
            ->where('source_type', Commitment::class)
            ->whereIn('source_id', $commitments->modelKeys())
            ->get()
            ->groupBy('source_id');
        $siblings = Commitment::query()
            ->whereIn('need_request_id', $commitments->pluck('need_request_id')->filter()->unique()->all())
            ->get()
            ->groupBy('need_request_id');

        foreach ($commitments as $commitment) {
            $commitment->setRelation('sourceBudgetEvents', $events->get($commitment->id, collect()));
            $commitment->needRequest?->setRelation(
                'siblingCommitments',
                $siblings->get($commitment->need_request_id, collect()),
            );
        }
    }
}
