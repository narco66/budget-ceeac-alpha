<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Currency extends Model
{
    use HasUuids;

    protected $fillable = [
        'code',
        'name',
        'minor_units',
        'is_default',
    ];

    protected function casts(): array
    {
        return [
            'minor_units' => 'integer',
            'is_default' => 'boolean',
        ];
    }

    public function fiscalYears(): HasMany
    {
        return $this->hasMany(FiscalYear::class);
    }
}
