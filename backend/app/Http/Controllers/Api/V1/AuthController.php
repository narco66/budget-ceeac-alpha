<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\Audit\AuditLogger;
use App\Services\Auth\LoginService;
use App\Support\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private readonly LoginService $loginService,
        private readonly AuditLogger $audit,
    ) {}

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->loginService->authenticate(
            $request->string('email')->toString(),
            $request->string('password')->toString(),
            $request,
        );

        $result['user']->load('roles.permissions');

        return ApiResponse::success([
            'token' => $result['token'],
            'token_type' => 'Bearer',
            'user' => new UserResource($result['user']),
        ], 'Connexion réussie.');
    }

    public function me(Request $request): JsonResponse
    {
        $request->user()->load('roles.permissions');

        return ApiResponse::success(new UserResource($request->user()));
    }

    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        $request->user()->currentAccessToken()?->delete();
        $this->audit->record('auth.logout', $user, null, null, $user, $request);

        return ApiResponse::success(null, 'Déconnexion effectuée.');
    }

    public function revoke(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->tokens()->delete();
        $this->audit->record('auth.sessions_revoked', $user, null, null, $user, $request);

        return ApiResponse::success(null, 'Toutes les sessions de ce compte ont été révoquées.');
    }

    public function forgot(ForgotPasswordRequest $request): JsonResponse
    {
        Password::sendResetLink($request->only('email'));

        return ApiResponse::success(
            null,
            'Si un compte correspond à cette adresse, un message de réinitialisation a été préparé.',
        );
    }

    public function reset(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) use ($request): void {
                $user->forceFill([
                    'password' => $password,
                    'password_changed_at' => now(),
                    'must_change_password' => false,
                    'failed_login_attempts' => 0,
                    'locked_until' => null,
                ])->save();
                $user->tokens()->delete();
                $this->audit->record('auth.password_reset', $user, null, null, $user, $request);
            },
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages([
                'email' => 'La réinitialisation du mot de passe a échoué.',
            ]);
        }

        return ApiResponse::success(null, 'Mot de passe renouvelé. Les sessions précédentes ont été révoquées.');
    }
}
