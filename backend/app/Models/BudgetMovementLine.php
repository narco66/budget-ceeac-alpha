<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BudgetMovementLine extends Model
{
    use HasUuids;

    protected $fillable = [
        'budget_movement_id',
        'budget_line_id',
        'direction',
        'amount_xaf',
    ];

    protected function casts(): array
    {
        return [
            'amount_xaf' => 'decimal:0',
        ];
    }

    public function movement(): BelongsTo
    {
        return $this->belongsTo(BudgetMovement::class, 'budget_movement_id');
    }

    public function budgetLine(): BelongsTo
    {
        return $this->belongsTo(BudgetLine::class);
    }
}
