<?php

namespace App\Services\Auth;

use App\Exceptions\AccountLockedException;
use App\Models\LoginHistory;
use App\Models\User;
use App\Services\Audit\AuditLogger;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class LoginService
{
    public function __construct(private readonly AuditLogger $audit) {}

    /**
     * @return array{token: string, user: User}
     */
    public function authenticate(string $email, string $password, Request $request): array
    {
        $user = User::query()->where('email', $email)->first();

        if ($user?->locked_until?->isFuture()) {
            $this->trace($user, $email, false, $request, 'locked');
            throw new AccountLockedException;
        }

        $passwordMatches = $user !== null && Hash::check($password, $user->password);

        if ($user === null || ! $passwordMatches || ! $user->is_active) {
            if ($user !== null && $user->is_active && ! $passwordMatches) {
                $this->registerFailure($user);
            }

            $this->trace($user, $email, false, $request, $user === null || $passwordMatches ? 'inactive_or_unknown' : 'invalid_password');

            throw ValidationException::withMessages([
                'email' => 'Identifiants invalides.',
            ]);
        }

        $user->forceFill([
            'failed_login_attempts' => 0,
            'locked_until' => null,
        ])->save();

        $token = $user->createToken('api')->plainTextToken;
        $this->trace($user, $email, true, $request, null);
        $this->audit->record('auth.login', $user, null, ['email' => $user->email], $user, $request);

        return ['token' => $token, 'user' => $user];
    }

    private function registerFailure(User $user): void
    {
        $attempts = $user->failed_login_attempts + 1;
        $attributes = ['failed_login_attempts' => $attempts];

        if ($attempts >= (int) config('gesbudep.lockout.max_attempts')) {
            $attributes['locked_until'] = now()->addMinutes((int) config('gesbudep.lockout.minutes'));
        }

        $user->forceFill($attributes)->save();
    }

    private function trace(?User $user, string $email, bool $successful, Request $request, ?string $reason): void
    {
        LoginHistory::query()->create([
            'user_id' => $user?->id,
            'email' => $email,
            'successful' => $successful,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'failure_reason' => $reason,
        ]);
    }
}
