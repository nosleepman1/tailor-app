<?php

namespace App\Http\Controllers\Api\V2\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TailorManagementController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected UserRepositoryInterface $userRepository,
        protected AuthService $authService
    ) {}

    /**
     * List all tailors.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = min((int) $request->input('per_page', 20), 100);
        $tailors = $this->userRepository->getTailorsPaginated($perPage);

        return $this->paginatedResponse($tailors, 'Liste des tailleurs récupérée avec succès.');
    }

    /**
     * Admin registers a new tailor account.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:30|unique:users,phone',
            'email' => 'nullable|email|max:255|unique:users,email',
            'city' => 'nullable|string|max:100',
            'pin' => 'nullable|string|digits:4',
            'is_subscribed' => 'nullable|boolean',
        ]);

        $result = $this->authService->adminRegisterTailor($validated);

        return $this->createdResponse($result, 'Compte tailleur créé avec succès.');
    }

    /**
     * Show tailor details.
     */
    public function show(User $tailor): JsonResponse
    {
        $tailor->load(['roles', 'subscriptions', 'clients', 'commandes']);

        return $this->successResponse($tailor, 'Détails du tailleur.');
    }

    /**
     * Toggle active/inactive state of a tailor account.
     */
    public function toggleStatus(User $tailor): JsonResponse
    {
        $tailor->update([
            'active' => !$tailor->active,
        ]);

        $statusText = $tailor->active ? 'activé' : 'désactivé';

        return $this->successResponse($tailor, "Compte tailleur {$statusText} avec succès.");
    }

    /**
     * Delete tailor account.
     */
    public function destroy(User $tailor): JsonResponse
    {
        $this->userRepository->delete($tailor);

        return $this->noContentResponse();
    }
}
