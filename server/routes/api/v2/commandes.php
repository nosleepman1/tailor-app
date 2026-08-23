<?php

use App\Http\Controllers\Api\V2\CommandeController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::patch('commandes/{commande}/status', [CommandeController::class, 'updateStatus'])->name('commandes.status');
    Route::apiResource('commandes', CommandeController::class);
});
