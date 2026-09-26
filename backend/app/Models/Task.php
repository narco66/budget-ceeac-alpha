<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    use HasUuids;

    public const UPDATED_AT = null;

    protected $fillable = [
        'need_request_id',
        'workflow_instance_id',
        'assignee_role_code',
        'title',
        'status',
        'completed_at',
    ];

    protected function casts(): array
    {
        return [
            'completed_at' => 'datetime',
            'created_at' => 'datetime',
        ];
    }

    public function needRequest(): BelongsTo
    {
        return $this->belongsTo(NeedRequest::class);
    }
}
