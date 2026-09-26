<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkflowStep extends Model
{
    use HasUuids;

    protected $fillable = [
        'workflow_definition_id',
        'code',
        'label',
        'position',
        'actor_kind',
        'actor_role_code',
        'sla_hours',
    ];

    protected function casts(): array
    {
        return [
            'position' => 'integer',
            'sla_hours' => 'integer',
        ];
    }

    public function definition(): BelongsTo
    {
        return $this->belongsTo(WorkflowDefinition::class, 'workflow_definition_id');
    }
}
