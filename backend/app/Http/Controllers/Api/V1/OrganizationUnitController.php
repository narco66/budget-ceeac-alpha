<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrganizationUnitResource;
use App\Models\OrganizationUnit;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizationUnitController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $units = OrganizationUnit::query()
            ->when($request->filled('search'), function ($query) use ($request): void {
                $search = '%'.$request->string('search')->toString().'%';
                $query->where(function ($query) use ($search): void {
                    $query->where('code', 'like', $search)->orWhere('name', 'like', $search);
                });
            })
            ->orderBy('level')
            ->orderBy('code')
            ->paginate($request->integer('per_page', 50))
            ->withQueryString();

        return ApiResponse::success(
            OrganizationUnitResource::collection($units->items()),
            'Structures.',
            200,
            [
                'current_page' => $units->currentPage(),
                'last_page' => $units->lastPage(),
                'per_page' => $units->perPage(),
                'total' => $units->total(),
            ],
        );
    }
}
