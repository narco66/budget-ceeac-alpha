<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class OfficialDocument extends Model
{
    use HasUuids;

    protected $fillable = [
        'subject_type',
        'subject_id',
        'kind',
        'ged_document_id',
    ];

    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    public function document(): BelongsTo
    {
        return $this->belongsTo(GedDocument::class, 'ged_document_id');
    }
}
