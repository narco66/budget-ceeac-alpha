<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NeedRequestLine extends Model
{
    use HasUuids;

    protected $fillable = [
        'need_request_id',
        'position',
        'designation',
        'quantity',
        'unit',
        'unit_price_xaf',
        'amount_xaf',
    ];

    protected function casts(): array
    {
        return [
            'quantity' => 'integer',
            'unit_price_xaf' => 'decimal:0',
            'amount_xaf' => 'decimal:0',
        ];
    }

    public function needRequest(): BelongsTo
    {
        return $this->belongsTo(NeedRequest::class);
    }
}
