<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class SodRule extends Model
{
    use HasUuids;

    protected $fillable = [
        'role_a',
        'role_b',
        'scope',
        'description',
    ];
}
