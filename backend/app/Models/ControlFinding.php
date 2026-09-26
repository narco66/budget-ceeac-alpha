<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ControlFinding extends Model
{
    use HasUuids;

    protected $fillable = [
        'title',
        'observation',
        'status',
        'opened_by',
        'closed_by',
        'close_reason',
        'closed_at',
    ];

    protected function casts(): array
    {
        return [
            'closed_at' => 'datetime',
        ];
    }
}
