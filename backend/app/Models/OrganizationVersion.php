<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OrganizationVersion extends Model
{
    use HasUuids;

    protected $fillable = [
        'code',
        'label',
        'status',
        'effective_on',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'effective_on' => 'date',
        ];
    }

    public function units(): HasMany
    {
        return $this->hasMany(OrganizationUnit::class);
    }
}
