<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Dossiers\DossierService;
use App\Http\Controllers\Controller;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DossierController extends Controller
{
    public function __construct(private readonly DossierService $dossiers) {}

    public function index(Request $request): JsonResponse
    {
        $data = $request->validate([
            'q' => ['required', 'string', 'min:2', 'max:80'],
        ]);

        return ApiResponse::success(
            $this->dossiers->search($request->user(), $data['q']),
            'Dossiers.',
        );
    }

    public function show(Request $request, string $reference): JsonResponse
    {
        return ApiResponse::success(
            $this->dossiers->show($request->user(), $reference),
            'Dossier.',
        );
    }
}
