<?php

namespace App\Domain\Control;

use App\Exceptions\ControlRuleException;
use App\Models\ControlFinding;
use App\Models\User;

class ControlFindingService
{
    public function open(User $author, string $title, string $observation): ControlFinding
    {
        return ControlFinding::query()->create([
            'title' => $title,
            'observation' => $observation,
            'status' => 'open',
            'opened_by' => $author->id,
        ]);
    }

    public function close(ControlFinding $finding, User $actor, string $reason): ControlFinding
    {
        if ($finding->status !== 'open') {
            throw new ControlRuleException('La recommandation est déjà close.');
        }
        if (trim($reason) === '') {
            throw new ControlRuleException('La clôture exige un motif.');
        }

        $finding->update([
            'status' => 'closed',
            'closed_by' => $actor->id,
            'close_reason' => $reason,
            'closed_at' => now(),
        ]);

        return $finding->refresh();
    }
}
