<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/** @mixin User */
class UserResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'is_active' => $this->is_active,
            'mfa_enabled' => $this->mfa_enabled,
            'must_change_password' => $this->must_change_password,
            'roles' => $this->whenLoaded('roles', fn () => $this->roles->map(fn ($role) => [
                'code' => $role->code,
                'name' => $role->name,
            ])->values()),
            'permissions' => $this->whenLoaded('roles', fn () => $this->roles
                ->flatMap(fn ($role) => $role->relationLoaded('permissions') ? $role->permissions->pluck('code') : collect())
                ->unique()
                ->values()),
        ];
    }
}
