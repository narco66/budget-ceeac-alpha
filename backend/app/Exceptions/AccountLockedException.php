<?php

namespace App\Exceptions;

use RuntimeException;

class AccountLockedException extends RuntimeException
{
    public function __construct()
    {
        parent::__construct('Le compte est temporairement verrouillé après des tentatives de connexion abusives.');
    }
}
