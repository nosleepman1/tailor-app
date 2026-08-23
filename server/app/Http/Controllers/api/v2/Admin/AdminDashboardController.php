<?php

namespace App\Http\Controllers\Api\V2\Admin;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    public function stats(): JsonResponse
    {
        $stats = $this->dashboardService->getAdminStats();

        return $this->successResponse($stats, 'Statistiques de la plateforme récupérées.');
    }
}
