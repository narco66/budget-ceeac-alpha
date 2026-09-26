<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BudgetMovement extends Model
{
    use HasUuids;

    protected $fillable = [
        'budget_version_id',
        'reference',
        'movement_type',
        'status',
        'reason',
        'validated_at',
    ];

    protected function casts(): array
    {
        return [
            'validated_at' => 'datetime',
        ];
    }

    public function version(): BelongsTo
    {
        return $this->belongsTo(BudgetVersion::class, 'budget_version_id');
    }

    public function lines(): HasMany
    {
        return $this->hasMany(BudgetMovementLine::class);
    }
}
