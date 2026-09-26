<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Commitment extends Model
{
    use HasUuids;

    protected $fillable = [
        'need_request_id',
        'fiscal_year_id',
        'budget_line_id',
        'organization_unit_id',
        'reference',
        'status',
        'circuit_code',
        'object',
        'amount_xaf',
        'workflow_instance_id',
    ];

    protected function casts(): array
    {
        return [
            'amount_xaf' => 'decimal:0',
        ];
    }

    public function needRequest(): BelongsTo
    {
        return $this->belongsTo(NeedRequest::class);
    }

    public function fiscalYear(): BelongsTo
    {
        return $this->belongsTo(FiscalYear::class);
    }

    public function budgetLine(): BelongsTo
    {
        return $this->belongsTo(BudgetLine::class);
    }

    public function workflow(): BelongsTo
    {
        return $this->belongsTo(WorkflowInstance::class, 'workflow_instance_id');
    }

    public function liquidations(): HasMany
    {
        return $this->hasMany(Liquidation::class);
    }
}
