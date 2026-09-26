<?php

namespace App\Http\Controllers\Api\V1;

use App\Domain\Identity\SegregationOfDuties;
use App\Exceptions\SegregationOfDutiesException;
use App\Http\Controllers\Controller;
use App\Http\Requests\Identity\AssignRoleRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Services\Audit\AuditLogger;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;

class UserRoleController extends Controller
{
    public function __construct(
        private readonly SegregationOfDuties $segregation,
        private readonly AuditLogger $audit,
    ) {}

    public function store(AssignRoleRequest $request, User $user): JsonResponse
    {
        $role = Role::query()->where('code', $request->string('role_code')->toString())->firstOrFail();

        try {
            $this->segregation->assertCanAssign($user->activeRoleCodes(), $role->code);
        } catch (SegregationOfDutiesException $exception) {
            return ApiResponse::error($exception->getMessage(), 'SOD_CONFLICT', [
                'conflicts' => $exception->conflicts,
            ], 422);
        }

        $user->roles()->syncWithoutDetaching([
            $role->id => [
                'organization_unit_id' => $request->input('organization_unit_id'),
                'starts_at' => now(),
            ],
        ]);

        $this->audit->record(
            'identity.role_assigned',
            $user,
            null,
            ['role' => $role->code],
            $request->user(),
            $request,
        );

        $user->load('roles.permissions');

        return ApiResponse::success(new UserResource($user), 'Rôle affecté.', 201);
    }
}
