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
