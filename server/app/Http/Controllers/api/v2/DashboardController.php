<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Services\DashboardService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected DashboardService $dashboardService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->hasRole('admin')) {
            $stats = $this->dashboardService->getAdminStats();
            return $this->successResponse([
                'role' => 'admin',
                'stats' => $stats,
            ], 'Statistiques administrateur récupérées.');
        }

        $stats = $this->dashboardService->getTailorStats($user);

        return $this->successResponse([
            'role' => 'tailor',
            'stats' => $stats,
        ], 'Statistiques de l\'atelier récupérées.');
    }
}
