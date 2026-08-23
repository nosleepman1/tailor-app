<?php

use App\Http\Controllers\Api\V2\ClientController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('clients', ClientController::class);
});
