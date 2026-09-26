<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WorkflowDefinition extends Model
{
    use HasUuids;

    protected $fillable = [
        'code',
        'version',
        'label',
        'domain',
        'variant',
        'status',
        'effective_on',
        'note',
    ];

    protected function casts(): array
    {
        return [
            'version' => 'integer',
            'effective_on' => 'date',
        ];
    }

    public function steps(): HasMany
    {
        return $this->hasMany(WorkflowStep::class);
    }

    public function transitions(): HasMany
    {
        return $this->hasMany(WorkflowTransition::class);
    }
}
