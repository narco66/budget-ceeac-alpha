<?php

use App\Http\Controllers\Api\V1\AuditEventController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\BudgetController;
use App\Http\Controllers\Api\V1\CommitmentController;
use App\Http\Controllers\Api\V1\ContractController;
use App\Http\Controllers\Api\V1\ControlFindingController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\DocumentController;
use App\Http\Controllers\Api\V1\HealthController;
use App\Http\Controllers\Api\V1\LiquidationController;
use App\Http\Controllers\Api\V1\NeedRequestController;
use App\Http\Controllers\Api\V1\NotificationController;
use App\Http\Controllers\Api\V1\OrganizationUnitController;
use App\Http\Controllers\Api\V1\PartyController;
use App\Http\Controllers\Api\V1\PaymentController;
use App\Http\Controllers\Api\V1\PaymentOrderController;
use App\Http\Controllers\Api\V1\ReferentialController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\UserRoleController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function (): void {
    Route::get('health', HealthController::class);

    Route::prefix('auth')->group(function (): void {
        Route::post('login', [AuthController::class, 'login'])->middleware('throttle:20,1');
        Route::post('password/forgot', [AuthController::class, 'forgot'])->middleware('throttle:5,1');
        Route::post('password/reset', [AuthController::class, 'reset'])->middleware('throttle:5,1');

        Route::middleware('auth:sanctum')->group(function (): void {
            Route::get('me', [AuthController::class, 'me']);
            Route::post('logout', [AuthController::class, 'logout']);
            Route::post('sessions/revoke', [AuthController::class, 'revoke']);
        });
    });

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('dashboard', [DashboardController::class, 'show']);
        Route::get('users', [UserController::class, 'index'])->middleware('permission:users.view');
        Route::post('users/{user}/roles', [UserRoleController::class, 'store'])->middleware('permission:users.manage');
        Route::get('organization-units', [OrganizationUnitController::class, 'index'])->middleware('permission:organization.view');
        Route::get('audit-events', [AuditEventController::class, 'index'])->middleware('permission:audit.view');

        Route::middleware('permission:referentials.view')->group(function (): void {
            Route::get('fiscal-years', [ReferentialController::class, 'fiscalYears']);
            Route::get('fiscal-years/{fiscalYear}', [ReferentialController::class, 'fiscalYear']);
            Route::get('workflows', [ReferentialController::class, 'workflows']);
            Route::get('workflows/{workflowDefinition}', [ReferentialController::class, 'workflow']);
            Route::get('system-parameters', [ReferentialController::class, 'parameters']);
            Route::get('number-sequences', [ReferentialController::class, 'sequences']);
            Route::get('nomenclature-versions', [ReferentialController::class, 'nomenclature']);
        });

        Route::middleware('permission:budget.view')->group(function (): void {
            Route::get('budget-control-totals', [BudgetController::class, 'controls']);
            Route::get('budget-versions', [BudgetController::class, 'index']);
            Route::get('budget-versions/{budgetVersion}', [BudgetController::class, 'show']);
        });

        Route::middleware('permission:budget.manage')->group(function (): void {
            Route::post('budget-versions', [BudgetController::class, 'store']);
            Route::post('budget-versions/{budgetVersion}/lines', [BudgetController::class, 'addLine']);
            Route::post('budget-versions/{budgetVersion}/publish', [BudgetController::class, 'publish']);
            Route::post('budget-versions/{budgetVersion}/execute', [BudgetController::class, 'execute']);
            Route::post('budget-movements', [BudgetController::class, 'storeMovement']);
            Route::post('budget-movements/{budgetMovement}/validate', [BudgetController::class, 'validateMovement']);
            Route::post('budget-imports', [BudgetController::class, 'import']);
            Route::post('budget-imports/{budgetImportBatch}/promote', [BudgetController::class, 'promote']);
        });

        Route::middleware('permission:need_requests.view')->group(function (): void {
            Route::get('need-requests/readiness', [NeedRequestController::class, 'readiness']);
            Route::get('need-requests', [NeedRequestController::class, 'index']);
            Route::get('need-requests/{needRequest}', [NeedRequestController::class, 'show']);
            Route::get('tasks', [NeedRequestController::class, 'tasks']);
        });

        Route::middleware('permission:need_requests.manage')->group(function (): void {
            Route::post('need-requests', [NeedRequestController::class, 'store']);
            Route::post('need-requests/{needRequest}/transitions', [NeedRequestController::class, 'transition']);
            Route::post('need-requests/{needRequest}/revise', [NeedRequestController::class, 'revise']);
        });

        Route::middleware('permission:commitments.view')->group(function (): void {
            Route::get('commitments', [CommitmentController::class, 'index']);
            Route::get('commitments/{commitment}', [CommitmentController::class, 'show']);
        });

        Route::middleware('permission:commitments.manage')->group(function (): void {
            Route::post('commitments/{commitment}/transitions', [CommitmentController::class, 'transition']);
            Route::post('commitments/{commitment}/amount', [CommitmentController::class, 'reduce']);
            Route::post('commitments/{commitment}/releases', [CommitmentController::class, 'release']);
            Route::post('need-requests/{needRequest}/commitments', [CommitmentController::class, 'storePartial']);
        });

        Route::middleware('permission:liquidations.view')->group(function (): void {
            Route::get('liquidations', [LiquidationController::class, 'index']);
            Route::get('liquidations/{liquidation}', [LiquidationController::class, 'show']);
        });

        Route::middleware('permission:liquidations.manage')->group(function (): void {
            Route::post('liquidations/{liquidation}/statement', [LiquidationController::class, 'statement']);
            Route::post('liquidations/{liquidation}/certification', [LiquidationController::class, 'certification']);
            Route::post('liquidations/{liquidation}/transitions', [LiquidationController::class, 'transition']);
            Route::post('commitments/{commitment}/liquidations', [LiquidationController::class, 'storePartial']);
        });

        Route::middleware('permission:payment_orders.view')->group(function (): void {
            Route::get('payment-orders', [PaymentOrderController::class, 'index']);
            Route::get('payment-orders/{paymentOrder}', [PaymentOrderController::class, 'show']);
        });

        Route::middleware('permission:payment_orders.manage')->group(function (): void {
            Route::post('payment-orders/{paymentOrder}/transitions', [PaymentOrderController::class, 'transition']);
            Route::post('payment-orders/{paymentOrder}/amount', [PaymentOrderController::class, 'reduce']);
            Route::post('liquidations/{liquidation}/payment-orders', [PaymentOrderController::class, 'storePartial']);
        });

        Route::middleware('permission:payments.view')->group(function (): void {
            Route::get('payments', [PaymentController::class, 'index']);
            Route::get('payments/{payment}', [PaymentController::class, 'show']);
        });

        Route::middleware('permission:payments.manage')->group(function (): void {
            Route::post('payments/{payment}/statement', [PaymentController::class, 'statement']);
            Route::post('payments/{payment}/amount', [PaymentController::class, 'reduce']);
            Route::post('payments/{payment}/proof', [PaymentController::class, 'proof']);
            Route::post('payments/{payment}/transitions', [PaymentController::class, 'transition']);
            Route::post('payment-orders/{paymentOrder}/payments', [PaymentController::class, 'storePartial']);
        });

        Route::middleware('permission:parties.view')->group(function (): void {
            Route::get('parties', [PartyController::class, 'index']);
            Route::get('parties/{party}', [PartyController::class, 'show']);
        });

        Route::middleware('permission:parties.manage')->group(function (): void {
            Route::post('parties', [PartyController::class, 'store']);
            Route::post('parties/{party}/status', [PartyController::class, 'status']);
            Route::post('parties/{party}/bank-accounts', [PartyController::class, 'storeAccount']);
            Route::post('party-bank-accounts/{account}/activate', [PartyController::class, 'activateAccount']);
        });

        Route::middleware('permission:contracts.view')->group(function (): void {
            Route::get('contracts', [ContractController::class, 'index']);
            Route::get('contracts/{contract}', [ContractController::class, 'show']);
            Route::get('procurement-thresholds', [ContractController::class, 'thresholds']);
        });

        Route::middleware('permission:contracts.manage')->group(function (): void {
            Route::post('contracts', [ContractController::class, 'store']);
            Route::post('contracts/{contract}/amendments', [ContractController::class, 'amend']);
        });

        Route::middleware('permission:documents.view')->group(function (): void {
            Route::get('documents', [DocumentController::class, 'index']);
        });
        Route::get('documents/{document}/file', [DocumentController::class, 'file']);

        Route::middleware('permission:documents.manage')->group(function (): void {
            Route::post('documents', [DocumentController::class, 'store']);
            Route::post('documents/{document}/versions', [DocumentController::class, 'replace']);
            Route::post('documents/{document}/seal', [DocumentController::class, 'seal']);
            Route::delete('documents/{document}', [DocumentController::class, 'destroy']);
        });

        Route::get('notifications', [NotificationController::class, 'index']);
        Route::post('notifications/{notification}/read', [NotificationController::class, 'read']);

        Route::middleware('permission:findings.view')->group(function (): void {
            Route::get('findings', [ControlFindingController::class, 'index']);
        });

        Route::middleware('permission:findings.manage')->group(function (): void {
            Route::post('findings', [ControlFindingController::class, 'store']);
            Route::post('findings/{finding}/close', [ControlFindingController::class, 'close']);
        });
    });
});
