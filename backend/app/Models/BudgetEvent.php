<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BudgetEvent extends Model
{
    use HasUuids;

    public const UPDATED_AT = null;

    protected $fillable = [
        'budget_line_id',
        'event_type',
        'amount_xaf',
        'source_type',
        'source_id',
    ];

    protected function casts(): array
    {
        return [
            'amount_xaf' => 'decimal:0',
            'created_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::updating(function (): void {
            throw new \LogicException('Le journal budgétaire ne peut pas être modifié.');
        });

        static::deleting(function (): void {
            throw new \LogicException('Le journal budgétaire ne peut pas être supprimé.');
        });
    }

    public function line(): BelongsTo
    {
        return $this->belongsTo(BudgetLine::class, 'budget_line_id');
    }
}
