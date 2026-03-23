<?php

use App\Http\Controllers\api\v1\ClientController;
use App\Http\Controllers\api\v1\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('v1/login', [UserController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('v1/me', fn (Request $request) => $request->user());
    Route::post('v1/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnecté']);
    });
    Route::apiResource('v1/users', UserController::class);
    Route::patch('v1/clients/{client}/status', [ClientController::class, 'updateStatus']);
    Route::apiResource('v1/clients', ClientController::class);
});

// =======================
// V2 API ROUTES (Refacto)
// =======================
use App\Http\Controllers\Api\V2\TailorAuthController;
use App\Http\Controllers\Api\V2\AdminAuthController;
use App\Http\Controllers\Api\V2\ClientController as V2ClientController;
use App\Http\Controllers\Api\V2\EventController as V2EventController;
use App\Http\Controllers\Api\V2\CommandeController as V2CommandeController;
use App\Http\Controllers\Api\V2\DashboardController;

Route::prefix('v2')->group(function () {
    // Public Auth
    Route::post('/tailor/register', [TailorAuthController::class, 'register']);
    Route::post('/tailor/login', [TailorAuthController::class, 'login']);
    Route::post('/admin/login', [TailorAuthController::class, 'login']);
    
    // Protected Routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [TailorAuthController::class, 'logout']);
        Route::get('/me', fn (Request $request) => $request->user());

        // Admin Only
        Route::prefix('admin')->group(function () {
            Route::get('tailors', [AdminAuthController::class, 'getTailors']);
            Route::post('tailors', [AdminAuthController::class, 'registerTailor']);
        });
        
        // Tailor Only / Shared -> Scoped later in policies
        Route::apiResource('clients', V2ClientController::class);
        Route::apiResource('events', V2EventController::class);
        Route::apiResource('commandes', V2CommandeController::class);
        Route::get('dashboard', [DashboardController::class, 'index']);
    });
});
