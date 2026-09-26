<?php

namespace App\Domain\Expenditure;

use App\Domain\Referentials\NumberSequenceAllocator;
use App\Models\Commitment;
use App\Models\IdempotencyKey;
use App\Models\NeedRequest;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;

class CommitmentFromNeed
{
    public function __construct(
        private readonly NumberSequenceAllocator $allocator,
        private readonly EngagementWorkflow $workflow,
    ) {}

    public function generate(NeedRequest $need): Commitment
    {
        return DB::transaction(function () use ($need): Commitment {
            $existing = Commitment::query()
                ->where('need_request_id', $need->id)
                ->lockForUpdate()
                ->first();

            if ($existing !== null) {
                return $existing;
            }

            IdempotencyKey::query()->firstOrCreate(
                ['key' => 'ENG-FROM-EB:'.$need->id],
                [
                    'aggregate_type' => NeedRequest::class,
                    'aggregate_id' => $need->id,
                ],
            );

            $need->loadMissing('fiscalYear');

            try {
                $commitment = Commitment::query()->create([
                    'need_request_id' => $need->id,
                    'fiscal_year_id' => $need->fiscal_year_id,
                    'budget_line_id' => $need->budget_line_id,
                    'organization_unit_id' => $need->organization_unit_id,
                    'reference' => $this->allocator->next('ENG', $need->fiscalYear),
                    'status' => 'generated',
                    'circuit_code' => $need->circuit_code,
                    'object' => $need->object,
                    'amount_xaf' => $need->amount_xaf,
                ]);
                $this->workflow->start($commitment);

                return $commitment->refresh();
            } catch (QueryException) {
                $found = Commitment::query()->where('need_request_id', $need->id)->first();
                if ($found !== null) {
                    return $found;
                }

                throw new \RuntimeException('La création idempotente de l’engagement a échoué.');
            }
        });
    }
}
