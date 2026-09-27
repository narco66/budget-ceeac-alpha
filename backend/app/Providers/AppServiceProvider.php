<?php

namespace App\Providers;

use App\Jobs\DeliverTaskNotification;
use App\Models\Task;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Task::created(function (Task $task): void {
            DeliverTaskNotification::dispatch($task->id);
        });
    }
}
