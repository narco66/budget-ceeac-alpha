<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GedDocument extends Model
{
    use HasUuids;

    protected $fillable = [
        'title',
        'category',
        'mime',
        'byte_size',
        'sha256',
        'confidentiality',
        'status',
        'author_id',
        'deleted_at',
    ];

    protected function casts(): array
    {
        return [
            'deleted_at' => 'datetime',
        ];
    }

    public function versions(): HasMany
    {
        return $this->hasMany(GedDocumentVersion::class);
    }
}
