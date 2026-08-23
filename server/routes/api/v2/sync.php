<?php

use App\Http\Controllers\Api\V2\SyncController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->prefix('sync')->group(function () {
    Route::get('/pull', [SyncController::class, 'pull'])->name('sync.pull');
    Route::post('/push', [SyncController::class, 'push'])->name('sync.push');
});
