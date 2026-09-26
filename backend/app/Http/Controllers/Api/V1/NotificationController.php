<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\InboxNotification;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $rows = InboxNotification::query()
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return ApiResponse::success(
            $rows->map(fn (InboxNotification $notice): array => [
                'id' => $notice->id,
                'title' => $notice->title,
                'task_id' => $notice->task_id,
                'read_at' => $notice->read_at?->toIso8601String(),
            ])->values(),
            'Notifications.',
        );
    }

    public function read(Request $request, InboxNotification $notification): JsonResponse
    {
        if ($notification->user_id !== $request->user()->id) {
            return ApiResponse::error('Notification hors de votre corbeille.', 'FORBIDDEN', [], 403);
        }

        if ($notification->read_at === null) {
            $notification->update(['read_at' => now()]);
        }

        return ApiResponse::success([
            'id' => $notification->id,
            'read_at' => $notification->read_at?->toIso8601String(),
        ], 'Notification lue.');
    }
}
