<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StgBudgetLine extends Model
{
    use HasUuids;

    protected $fillable = [
        'budget_import_batch_id',
        'row_number',
        'nature',
        'segment',
        'funding_source',
        'code',
        'label',
        'amount_xaf',
        'error',
    ];

    public function batch(): BelongsTo
    {
        return $this->belongsTo(BudgetImportBatch::class, 'budget_import_batch_id');
    }
}
