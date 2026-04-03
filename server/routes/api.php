<?php

use App\Http\Controllers\api\v1\ClientController;
use App\Http\Controllers\api\v1\UserController;
use App\Http\Controllers\Api\V1\SettingsController;
use App\Http\Controllers\Api\V1\PushSubscriptionController;
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
    // Push Public
    Route::get('/push/vapid-public-key', [PushSubscriptionController::class, 'vapidPublicKey']);
  
  
  
    // Public Auth
    Route::post('/tailor/register', [TailorAuthController::class, 'register']);
    Route::post('/tailor/login', [TailorAuthController::class, 'login']);
    Route::post('/admin/login', [TailorAuthController::class, 'login']);
    
 
 
    // ✅ DISABLED: Public Webhook (DexPay) - Subscriptions disabled
    // Route::post('/webhooks/dexpay', [\App\Http\Controllers\Api\SubscriptionController::class, 'webhook']);

    
    
    
    // Protected Routes
        Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [TailorAuthController::class, 'logout']);
        Route::get('/me', fn (Request $request) => $request->user());

        // Settings & Profile
        Route::get('/user/profile', [SettingsController::class, 'getProfile']);
        Route::put('/user/profile', [SettingsController::class, 'updateProfile']);
        Route::put('/user/password', [SettingsController::class, 'updatePassword']);
        Route::get('/user/preferences', [SettingsController::class, 'getPreferences']);
        Route::put('/user/preferences', [SettingsController::class, 'updatePreferences']);

        Route::post('/push/subscribe', [PushSubscriptionController::class, 'subscribe']);
        Route::post('/push/unsubscribe', [PushSubscriptionController::class, 'unsubscribe']);

        // ✅ DISABLED: Subscription routes - Feature disabled
        /*
        Route::prefix('subscriptions')->name('subscriptions.')->group(function () {
            Route::get('/success-redirect', function (Request $request) {
                return redirect(env('APP_FRONTEND_URL', 'http://localhost:5173') . '/subscription/success?ref=' . $request->ref);
            });
            Route::get('/failure-redirect', function (Request $request) {
                return redirect(env('APP_FRONTEND_URL', 'http://localhost:5173') . '/subscription/failure?ref=' . $request->ref);
            });
            Route::get('/plans', [\App\Http\Controllers\Api\SubscriptionController::class, 'plans'])->name('plans');
            Route::post('/checkout', [\App\Http\Controllers\Api\SubscriptionController::class, 'checkout'])->name('checkout');
            Route::get('/verify', [\App\Http\Controllers\Api\SubscriptionController::class, 'verify'])->name('verify');
            Route::get('/current', [\App\Http\Controllers\Api\SubscriptionController::class, 'current'])->name('current');
        });
        */



        // ✅ Fixed: Removed check.subscription middleware - subscriptions disabled
        // All authenticated users can access all resources
        // Authorization is handled by policies (@see app/Policies)
        
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
