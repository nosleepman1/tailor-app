<?php

use App\Http\Controllers\Api\V2\Admin\AdminDashboardController;
use App\Http\Controllers\Api\V2\Admin\TailorManagementController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [AdminDashboardController::class, 'stats'])->name('admin.stats');

    Route::get('/tailors', [TailorManagementController::class, 'index'])->name('admin.tailors.index');
    Route::post('/tailors', [TailorManagementController::class, 'store'])->name('admin.tailors.store');
    Route::get('/tailors/{tailor}', [TailorManagementController::class, 'show'])->name('admin.tailors.show');
    Route::patch('/tailors/{tailor}/status', [TailorManagementController::class, 'toggleStatus'])->name('admin.tailors.status');
    Route::delete('/tailors/{tailor}', [TailorManagementController::class, 'destroy'])->name('admin.tailors.destroy');
});
