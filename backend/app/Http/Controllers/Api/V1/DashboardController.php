<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Dashboards\DashboardService;
use App\Http\Controllers\Controller;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private readonly DashboardService $dashboards) {}

    public function show(Request $request): JsonResponse
    {
        return ApiResponse::success(
            $this->dashboards->forUser($request->user()),
            'Tableau de bord.',
        );
    }
}
