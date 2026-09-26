<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Liquidation extends Model
{
    use HasUuids;

    protected $fillable = [
        'commitment_id',
        'need_request_id',
        'fiscal_year_id',
        'workflow_instance_id',
        'reference',
        'status',
        'rank',
        'gross_amount_xaf',
        'tax_xaf',
        'withholding_xaf',
        'penalty_xaf',
        'advance_xaf',
        'amount_xaf',
        'invoice_number',
        'invoice_on',
        'supplier_label',
        'service_done_on',
        'deduction_reason',
        'certification_note',
    ];

    protected function casts(): array
    {
        return [
            'rank' => 'integer',
            'gross_amount_xaf' => 'decimal:0',
            'tax_xaf' => 'decimal:0',
            'withholding_xaf' => 'decimal:0',
            'penalty_xaf' => 'decimal:0',
            'advance_xaf' => 'decimal:0',
            'amount_xaf' => 'decimal:0',
            'invoice_on' => 'date',
            'service_done_on' => 'date',
        ];
    }

    public function commitment(): BelongsTo
    {
        return $this->belongsTo(Commitment::class);
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
        return $this->hasMany(LiquidationDocument::class);
    }

    public function paymentOrders(): HasMany
    {
        return $this->hasMany(PaymentOrder::class);
    }
}
