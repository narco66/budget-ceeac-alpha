<?php

namespace App\Domain\Referentials;

class ReferenceFormat
{
    public static function make(string $domain, int $year, int $value): string
    {
        return sprintf('%s-%d-%06d', $domain, $year, $value);
    }
}
