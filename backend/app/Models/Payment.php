<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Payment extends Model
{
    use HasUuids;

    protected $fillable = [
        'payment_order_id',
        'liquidation_id',
        'commitment_id',
        'fiscal_year_id',
        'workflow_instance_id',
        'reference',
        'status',
        'rank',
        'amount_xaf',
        'mode',
        'instrument_reference',
        'value_on',
        'beneficiary_label',
    ];

    protected function casts(): array
    {
        return [
            'rank' => 'integer',
            'amount_xaf' => 'decimal:0',
            'value_on' => 'date',
        ];
    }

    public function paymentOrder(): BelongsTo
    {
        return $this->belongsTo(PaymentOrder::class);
    }

    public function fiscalYear(): BelongsTo
    {
        return $this->belongsTo(FiscalYear::class);
    }

    public function workflow(): BelongsTo
    {
        return $this->belongsTo(WorkflowInstance::class, 'workflow_instance_id');
    }

    public function documents(): HasMany
    {
        return $this->hasMany(PaymentDocument::class);
    }
}
