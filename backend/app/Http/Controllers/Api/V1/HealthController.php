<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        try {
            DB::select('select 1 as ok');
            $database = 'up';
        } catch (\Throwable) {
            $database = 'down';
        }

        $status = $database === 'up' ? 200 : 503;

        return ApiResponse::success([
            'application' => 'up',
            'database' => $database,
            'name' => 'GESBUDEP',
        ], $database === 'up' ? 'Service disponible.' : 'La base de données est indisponible.', $status);
    }
}
