<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentOrder extends Model
{
    use HasUuids;

    protected $fillable = [
        'liquidation_id',
        'commitment_id',
        'fiscal_year_id',
        'workflow_instance_id',
        'reference',
        'status',
        'rank',
        'amount_xaf',
        'beneficiary_label',
        'authorizer_role_code',
        'threshold_amount_xaf',
        'threshold_version',
        'signed_on',
    ];

    protected function casts(): array
    {
        return [
            'rank' => 'integer',
            'amount_xaf' => 'decimal:0',
            'threshold_amount_xaf' => 'decimal:0',
            'threshold_version' => 'integer',
            'signed_on' => 'date',
        ];
    }

    public function liquidation(): BelongsTo
    {
        return $this->belongsTo(Liquidation::class);
    }

    public function fiscalYear(): BelongsTo
    {
        return $this->belongsTo(FiscalYear::class);
    }

    public function workflow(): BelongsTo
    {
        return $this->belongsTo(WorkflowInstance::class, 'workflow_instance_id');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
