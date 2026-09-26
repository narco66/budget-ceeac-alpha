<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PartyBankAccount extends Model
{
    use HasUuids;

    protected $fillable = [
        'party_id',
        'supersedes_id',
        'bank_name',
        'account_number',
        'status',
        'created_by',
        'activated_by',
    ];

    public function party(): BelongsTo
    {
        return $this->belongsTo(Party::class);
    }
}
