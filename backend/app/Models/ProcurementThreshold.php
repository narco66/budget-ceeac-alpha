<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ProcurementThreshold extends Model
{
    use HasUuids;

    protected $fillable = [
        'procedure_code',
        'amount_xaf',
        'effective_on',
        'status',
        'note',
    ];
}
