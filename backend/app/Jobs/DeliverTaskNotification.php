<?php

namespace App\Jobs;

use App\Domain\Notifications\NotifyOpenTask;
use App\Models\Task;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class DeliverTaskNotification implements ShouldQueue
{
    use Queueable;

    public int $tries = 3;

    public function __construct(public string $taskId) {}

    public function handle(NotifyOpenTask $notifier): void
    {
        $task = Task::query()->find($this->taskId);
        if ($task === null) {
            return;
        }

        $notifier->created($task);
    }
}
