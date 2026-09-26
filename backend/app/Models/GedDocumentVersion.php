<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GedDocumentVersion extends Model
{
    use HasUuids;

    protected $fillable = [
        'ged_document_id',
        'version_number',
        'sha256',
        'byte_size',
        'storage_path',
        'author_id',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(GedDocument::class, 'ged_document_id');
    }
}
