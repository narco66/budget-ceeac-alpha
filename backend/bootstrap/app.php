<?php

use App\Exceptions\AccountLockedException;
use App\Exceptions\BudgetRuleException;
use App\Exceptions\ContractRuleException;
use App\Exceptions\ControlRuleException;
use App\Exceptions\DocumentRuleException;
use App\Exceptions\EngagementRuleException;
use App\Exceptions\LiquidationRuleException;
use App\Exceptions\NeedRuleException;
use App\Exceptions\OrdonnancementRuleException;
use App\Exceptions\PartyRuleException;
use App\Exceptions\PaymentRuleException;
use App\Http\Middleware\EnsurePermission;
use App\Support\ApiResponse;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'permission' => EnsurePermission::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        $exceptions->render(function (Throwable $e, Request $request) {
            if (! $request->is('api/*')) {
                return null;
            }

            if ($e instanceof ValidationException) {
                return ApiResponse::error(
                    'Les données envoyées ne sont pas valides.',
                    'VALIDATION_ERROR',
                    $e->errors(),
                    422,
                );
            }

            if ($e instanceof BudgetRuleException) {
                return ApiResponse::error($e->getMessage(), 'BUDGET_RULE', [], 422);
            }

            if ($e instanceof NeedRuleException) {
                return ApiResponse::error($e->getMessage(), 'NEED_RULE', [], 422);
            }

            if ($e instanceof EngagementRuleException) {
                return ApiResponse::error($e->getMessage(), 'ENGAGEMENT_RULE', [], 422);
            }

            if ($e instanceof LiquidationRuleException) {
                return ApiResponse::error($e->getMessage(), 'LIQUIDATION_RULE', [], 422);
            }

            if ($e instanceof OrdonnancementRuleException) {
                return ApiResponse::error($e->getMessage(), 'ORDONNANCEMENT_RULE', [], 422);
            }

            if ($e instanceof PaymentRuleException) {
                return ApiResponse::error($e->getMessage(), 'PAYMENT_RULE', [], 422);
            }

            if ($e instanceof PartyRuleException) {
                return ApiResponse::error($e->getMessage(), 'PARTY_RULE', [], 422);
            }

            if ($e instanceof ContractRuleException) {
                return ApiResponse::error($e->getMessage(), 'CONTRACT_RULE', [], 422);
            }

            if ($e instanceof DocumentRuleException) {
                return ApiResponse::error($e->getMessage(), 'DOCUMENT_RULE', [], 422);
            }

            if ($e instanceof ControlRuleException) {
                return ApiResponse::error($e->getMessage(), 'CONTROL_RULE', [], 422);
            }

            if ($e instanceof AccountLockedException) {
                return ApiResponse::error($e->getMessage(), 'ACCOUNT_LOCKED', [], 423);
            }

            if ($e instanceof AuthenticationException) {
                return ApiResponse::error('Authentification requise.', 'UNAUTHENTICATED', [], 401);
            }

            if ($e instanceof AuthorizationException) {
                return ApiResponse::error(
                    $e->getMessage() !== '' ? $e->getMessage() : 'Action non autorisée.',
                    'FORBIDDEN',
                    [],
                    403,
                );
            }

            if ($e instanceof NotFoundHttpException || $e instanceof ModelNotFoundException) {
                return ApiResponse::error('Ressource introuvable.', 'NOT_FOUND', [], 404);
            }

            if ($e instanceof HttpExceptionInterface) {
                $status = $e->getStatusCode();
                $code = match ($status) {
                    401 => 'UNAUTHENTICATED',
                    403 => 'FORBIDDEN',
                    404 => 'NOT_FOUND',
                    405 => 'METHOD_NOT_ALLOWED',
                    423 => 'ACCOUNT_LOCKED',
                    default => 'HTTP_'.$status,
                };

                return ApiResponse::error(
                    $e->getMessage() !== '' ? $e->getMessage() : 'Requête rejetée.',
                    $code,
                    [],
                    $status,
                );
            }

            if ($e instanceof QueryException) {
                report($e);

                return ApiResponse::error(
                    'La persistance des données a échoué.',
                    'DATABASE_ERROR',
                    [],
                    500,
                );
            }

            report($e);

            return ApiResponse::error(
                'Une erreur interne est survenue.',
                'INTERNAL_ERROR',
                [],
                500,
            );
        });
    })->create();
