<?php

use App\Http\Controllers\Api\V2\EventController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->group(function () {
    Route::get('events/upcoming', [EventController::class, 'upcoming'])->name('events.upcoming');
    Route::apiResource('events', EventController::class);
});
