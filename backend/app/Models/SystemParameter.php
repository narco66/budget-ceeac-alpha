<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemParameter extends Model
{
    use HasUuids;

    protected $fillable = [
        'code',
        'version',
        'amount_xaf',
        'text_value',
        'status',
        'effective_on',
        'fiscal_year_id',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'version' => 'integer',
            'amount_xaf' => 'decimal:0',
            'effective_on' => 'date',
        ];
    }

    public function fiscalYear(): BelongsTo
    {
        return $this->belongsTo(FiscalYear::class);
    }
}
