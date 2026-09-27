<?php

namespace App\Support;

use App\Models\WorkflowEvent;
use App\Models\WorkflowInstance;

class WorkflowCursor
{
    public static function last(?WorkflowInstance $instance): ?WorkflowEvent
    {
        if ($instance === null) {
            return null;
        }

        if ($instance->relationLoaded('events')) {
            return $instance->events->sortByDesc('created_at')->first();
        }

        return $instance->events()->latest('created_at')->first();
    }
}
