<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Control\ControlFindingService;
use App\Http\Controllers\Controller;
use App\Models\ControlFinding;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ControlFindingController extends Controller
{
    public function __construct(private readonly ControlFindingService $findings) {}

    public function index(): JsonResponse
    {
        $rows = ControlFinding::query()->orderByDesc('created_at')->get();

        return ApiResponse::success(
            $rows->map(fn (ControlFinding $finding): array => $this->payload($finding))->values(),
            'Observations.',
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'observation' => ['required', 'string', 'max:4000'],
        ]);

        $finding = $this->findings->open($request->user(), $data['title'], $data['observation']);

        return ApiResponse::success($this->payload($finding), 'Observation ouverte.', 201);
    }

    public function close(Request $request, ControlFinding $finding): JsonResponse
    {
        $data = $request->validate([
            'reason' => ['required', 'string', 'max:1000'],
        ]);

        $finding = $this->findings->close($finding, $request->user(), $data['reason']);

        return ApiResponse::success($this->payload($finding), 'Observation close.');
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(ControlFinding $finding): array
    {
        return [
            'id' => $finding->id,
            'title' => $finding->title,
            'observation' => $finding->observation,
            'status' => $finding->status,
            'close_reason' => $finding->close_reason,
        ];
    }
}
