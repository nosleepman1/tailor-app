<?php

use App\Http\Controllers\Api\V2\SettingsController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('user')->group(function () {
    Route::get('/profile', [SettingsController::class, 'getProfile'])->name('user.profile');
    Route::put('/profile', [SettingsController::class, 'updateProfile'])->name('user.profile.update');
    Route::put('/password', [SettingsController::class, 'updatePassword'])->name('user.password.update');
    Route::get('/preferences', [SettingsController::class, 'getPreferences'])->name('user.preferences');
    Route::put('/preferences', [SettingsController::class, 'updatePreferences'])->name('user.preferences.update');
    Route::post('/push-token', [SettingsController::class, 'updatePushToken'])->name('user.push-token');
});
