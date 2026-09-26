<?php

namespace App\Domain\Identity;

use App\Exceptions\SegregationOfDutiesException;
use App\Models\SodRule;

class SegregationOfDuties
{
    /**
     * @param  list<string>  $heldRoleCodes
     */
    public function assertCanAssign(array $heldRoleCodes, string $candidateCode): void
    {
        $conflicts = $this->conflicts($heldRoleCodes, $candidateCode, 'assignment');

        if ($conflicts !== []) {
            throw new SegregationOfDutiesException($conflicts);
        }
    }

    /**
     * @param  list<string>  $roleCodesActingOnDossier
     * @return list<string>
     */
    public function dossierConflicts(array $roleCodesActingOnDossier): array
    {
        $codes = array_values(array_unique($roleCodesActingOnDossier));
        $conflicts = [];

        foreach ($codes as $candidate) {
            $others = array_values(array_filter($codes, fn (string $code): bool => $code !== $candidate));
            foreach ($this->conflicts($others, $candidate, 'dossier') as $conflict) {
                $conflicts[$conflict] = $conflict;
            }
        }

        return array_values($conflicts);
    }

    /**
     * @param  list<string>  $heldRoleCodes
     * @return list<string>
     */
    private function conflicts(array $heldRoleCodes, string $candidateCode, string $scope): array
    {
        if ($heldRoleCodes === [] || in_array($candidateCode, $heldRoleCodes, true)) {
            return [];
        }

        return SodRule::query()
            ->where('scope', $scope)
            ->where(function ($query) use ($heldRoleCodes, $candidateCode): void {
                $query->where(function ($query) use ($heldRoleCodes, $candidateCode): void {
                    $query->where('role_a', $candidateCode)->whereIn('role_b', $heldRoleCodes);
                })->orWhere(function ($query) use ($heldRoleCodes, $candidateCode): void {
                    $query->where('role_b', $candidateCode)->whereIn('role_a', $heldRoleCodes);
                });
            })
            ->get()
            ->map(fn (SodRule $rule): string => $rule->role_a.' × '.$rule->role_b)
            ->unique()
            ->values()
            ->all();
    }
}
