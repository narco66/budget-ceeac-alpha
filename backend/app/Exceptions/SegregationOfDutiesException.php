<?php

namespace App\Exceptions;

use RuntimeException;

class SegregationOfDutiesException extends RuntimeException
{
    /**
     * @param  list<string>  $conflicts
     */
    public function __construct(public readonly array $conflicts)
    {
        parent::__construct('Cette affectation enfreint la séparation des fonctions.');
    }
}
