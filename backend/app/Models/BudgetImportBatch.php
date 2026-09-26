<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BudgetImportBatch extends Model
{
    use HasUuids;

    protected $fillable = [
        'fiscal_year_id',
        'mode',
        'status',
        'report',
        'budget_version_id',
    ];

    protected function casts(): array
    {
        return [
            'report' => 'array',
        ];
    }

    public function fiscalYear(): BelongsTo
    {
        return $this->belongsTo(FiscalYear::class);
    }

    public function rows(): HasMany
    {
        return $this->hasMany(StgBudgetLine::class);
    }

    public function budgetVersion(): BelongsTo
    {
        return $this->belongsTo(BudgetVersion::class);
    }
}
