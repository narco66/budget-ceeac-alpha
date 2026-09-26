<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class NeedRequestDocument extends Model
{
    use HasUuids;

    protected $fillable = [
        'need_request_id',
        'kind',
        'label',
        'is_present',
    ];

    protected function casts(): array
    {
        return [
            'is_present' => 'boolean',
        ];
    }

    public function needRequest(): BelongsTo
    {
        return $this->belongsTo(NeedRequest::class);
    }
}
