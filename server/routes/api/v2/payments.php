<?php

use App\Http\Controllers\Api\V2\PaymentController;
use Illuminate\Support\Facades\Route;

// Public IPN Callback Webhook from PayDunya
Route::post('/payments/webhook', [PaymentController::class, 'webhook'])->name('payments.webhook');

// Protected subscription & payment routes
Route::middleware('auth:sanctum')->prefix('payments')->group(function () {
    Route::get('/plans', [PaymentController::class, 'plans'])->name('payments.plans');
    Route::get('/current', [PaymentController::class, 'current'])->name('payments.current');
    Route::post('/checkout', [PaymentController::class, 'checkout'])->name('payments.checkout');
    Route::get('/verify', [PaymentController::class, 'verify'])->name('payments.verify');
});
