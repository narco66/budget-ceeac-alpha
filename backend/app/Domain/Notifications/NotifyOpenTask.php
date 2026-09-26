<?php

namespace App\Domain\Notifications;

use App\Models\InboxNotification;
use App\Models\Task;
use App\Models\User;

class NotifyOpenTask
{
    public function created(Task $task): void
    {
        if ($task->status !== 'open' || $task->assignee_role_code === null) {
            return;
        }

        $users = User::query()
            ->whereHas('roles', fn ($query) => $query->where('code', $task->assignee_role_code))
            ->get();

        foreach ($users as $user) {
            InboxNotification::query()->firstOrCreate(
                ['user_id' => $user->id, 'task_id' => $task->id],
                ['title' => $task->title],
            );
        }
    }
}
