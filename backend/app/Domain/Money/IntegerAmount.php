<?php

namespace App\Domain\Money;

use InvalidArgumentException;

class IntegerAmount
{
    public static function assert(string $amount): string
    {
        if (preg_match('/^\d+$/', $amount) !== 1) {
            throw new InvalidArgumentException('Le montant doit être un entier XAF non négatif.');
        }

        return ltrim($amount, '0') === '' ? '0' : ltrim($amount, '0');
    }

    public static function compare(string $left, string $right): int
    {
        $left = self::assert($left);
        $right = self::assert($right);

        if (strlen($left) !== strlen($right)) {
            return strlen($left) <=> strlen($right);
        }

        return $left <=> $right;
    }

    public static function add(string $left, string $right): string
    {
        $left = self::assert($left);
        $right = self::assert($right);
        if (strlen($left) < strlen($right)) {
            [$left, $right] = [$right, $left];
        }
        $right = str_pad($right, strlen($left), '0', STR_PAD_LEFT);
        $carry = 0;
        $out = '';
        for ($i = strlen($left) - 1; $i >= 0; $i--) {
            $sum = (int) $left[$i] + (int) $right[$i] + $carry;
            $out = ($sum % 10).$out;
            $carry = intdiv($sum, 10);
        }
        if ($carry > 0) {
            $out = $carry.$out;
        }

        return self::assert($out);
    }

    public static function subtract(string $left, string $right): string
    {
        $left = self::assert($left);
        $right = self::assert($right);
        if (self::compare($left, $right) < 0) {
            throw new InvalidArgumentException('Le montant dépasse le solde.');
        }
        $right = str_pad($right, strlen($left), '0', STR_PAD_LEFT);
        $borrow = 0;
        $out = '';
        for ($i = strlen($left) - 1; $i >= 0; $i--) {
            $digit = (int) $left[$i] - (int) $right[$i] - $borrow;
            if ($digit < 0) {
                $digit += 10;
                $borrow = 1;
            } else {
                $borrow = 0;
            }
            $out = $digit.$out;
        }

        return self::assert($out);
    }

    public static function multiply(string $left, string $right): string
    {
        $left = self::assert($left);
        $right = self::assert($right);
        if ($left === '0' || $right === '0') {
            return '0';
        }

        $result = '0';
        $zeros = 0;
        for ($i = strlen($right) - 1; $i >= 0; $i--, $zeros++) {
            $digit = (int) $right[$i];
            $partial = '0';
            for ($n = 0; $n < $digit; $n++) {
                $partial = self::add($partial, $left);
            }
            if ($partial !== '0') {
                $result = self::add($result, $partial.str_repeat('0', $zeros));
            }
        }

        return self::assert($result);
    }

    public static function quotient(string $left, string $right): string
    {
        $left = self::assert($left);
        $right = self::assert($right);
        if ($right === '0') {
            throw new InvalidArgumentException('Division par zéro.');
        }
        if (self::compare($left, $right) < 0) {
            return '0';
        }

        $remainder = '0';
        $out = '';
        foreach (str_split($left) as $digit) {
            $remainder = self::assert(ltrim($remainder, '0').$digit);
            $count = 0;
            while (self::compare($remainder, $right) >= 0) {
                $remainder = self::subtract($remainder, $right);
                $count++;
            }
            $out .= (string) $count;
        }

        return self::assert($out);
    }
}
