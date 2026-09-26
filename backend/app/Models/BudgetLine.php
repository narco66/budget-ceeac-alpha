<?php

namespace App\Models;

use App\Exceptions\BudgetRuleException;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BudgetLine extends Model
{
    use HasUuids;

    protected $fillable = [
        'budget_version_id',
        'nature',
        'segment',
        'funding_source',
        'code',
        'label',
        'initial_amount_xaf',
        'nomenclature_item_id',
        'organization_unit_id',
    ];

    protected function casts(): array
    {
        return [
            'initial_amount_xaf' => 'decimal:0',
        ];
    }

    protected static function booted(): void
    {
        static::updating(function (BudgetLine $line): void {
            if (! $line->isDirty('initial_amount_xaf')) {
                return;
            }
            $line->loadMissing('version');
            if ($line->version?->isImmutable()) {
                throw new BudgetRuleException('Le montant initial d’une version publiée est immuable.');
            }
        });

        static::deleting(function (BudgetLine $line): void {
            $line->loadMissing('version');
            if ($line->version?->isImmutable()) {
                throw new BudgetRuleException('Une ligne d’une version publiée ne peut pas être supprimée.');
            }
        });
    }

    public function version(): BelongsTo
    {
        return $this->belongsTo(BudgetVersion::class, 'budget_version_id');
    }

    public function events(): HasMany
    {
        return $this->hasMany(BudgetEvent::class);
    }

    public function organizationUnit(): BelongsTo
    {
        return $this->belongsTo(OrganizationUnit::class);
    }
}
