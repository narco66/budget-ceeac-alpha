<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, HasUuids, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'is_active',
        'must_change_password',
        'mfa_enabled',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'mfa_secret',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'locked_until' => 'datetime',
            'password_changed_at' => 'datetime',
            'must_change_password' => 'boolean',
            'mfa_enabled' => 'boolean',
        ];
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)
            ->withPivot(['organization_unit_id', 'starts_at', 'ends_at'])
            ->withTimestamps();
    }

    public function hasPermission(string $code): bool
    {
        return $this->roles()
            ->where(function ($query): void {
                $query->whereNull('role_user.starts_at')
                    ->orWhere('role_user.starts_at', '<=', now());
            })
            ->where(function ($query): void {
                $query->whereNull('role_user.ends_at')
                    ->orWhere('role_user.ends_at', '>=', now());
            })
            ->whereHas('permissions', fn ($query) => $query->where('code', $code))
            ->exists();
    }

    /**
     * @return list<string>
     */
    public function activeRoleCodes(): array
    {
        return $this->roles()
            ->where(function ($query): void {
                $query->whereNull('role_user.starts_at')
                    ->orWhere('role_user.starts_at', '<=', now());
            })
            ->where(function ($query): void {
                $query->whereNull('role_user.ends_at')
                    ->orWhere('role_user.ends_at', '>=', now());
            })
            ->pluck('code')
            ->all();
    }
}
