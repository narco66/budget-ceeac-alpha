<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class NeedRequest extends Model
{
    use HasUuids;

    protected $fillable = [
        'fiscal_year_id',
        'budget_line_id',
        'organization_unit_id',
        'parent_id',
        'reference',
        'version_number',
        'circuit_code',
        'object',
        'justification',
        'amount_xaf',
        'need_on',
        'status',
        'workflow_instance_id',
    ];

    protected function casts(): array
    {
        return [
            'amount_xaf' => 'decimal:0',
            'need_on' => 'date',
            'version_number' => 'integer',
        ];
    }

    public function fiscalYear(): BelongsTo
    {
        return $this->belongsTo(FiscalYear::class);
    }

    public function budgetLine(): BelongsTo
    {
        return $this->belongsTo(BudgetLine::class);
    }

    public function organizationUnit(): BelongsTo
    {
        return $this->belongsTo(OrganizationUnit::class);
    }

    public function lines(): HasMany
    {
        return $this->hasMany(NeedRequestLine::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(NeedRequestDocument::class);
    }

    public function workflow(): BelongsTo
    {
        return $this->belongsTo(WorkflowInstance::class, 'workflow_instance_id');
    }

    public function commitment(): HasOne
    {
        return $this->hasOne(Commitment::class);
    }

    public function isEditable(): bool
    {
        return in_array($this->status, ['draft', 'returned'], true);
    }
}
