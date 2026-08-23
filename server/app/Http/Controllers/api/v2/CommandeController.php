<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Http\Requests\V2\Commande\StoreCommandeRequest;
use App\Http\Requests\V2\Commande\UpdateCommandeRequest;
use App\Models\Commande;
use App\Services\CommandeService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CommandeController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected CommandeService $commandeService
    ) {}

    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Commande::class);

        $perPage = min((int) $request->input('per_page', 20), 100);
        $status = $request->input('status');
        $clientId = $request->input('client_id');
        $eventId = $request->input('event_id');

        $commandes = $this->commandeService->getPaginatedCommandes(
            $request->user(),
            $perPage,
            $status,
            $clientId,
            $eventId
        );

        return $this->paginatedResponse($commandes, 'Liste des commandes récupérée avec succès.');
    }

    public function store(StoreCommandeRequest $request): JsonResponse
    {
        Gate::authorize('create', Commande::class);

        $uploadedFiles = [];
        if ($request->hasFile('images')) {
            $uploadedFiles = $request->file('images');
        }

        $commande = $this->commandeService->createCommande(
            $request->user(),
            $request->validated(),
            $uploadedFiles
        );

        return $this->createdResponse($commande, 'Commande enregistrée avec succès.');
    }

    public function show(Commande $commande): JsonResponse
    {
        Gate::authorize('view', $commande);

        $commandeDetails = $this->commandeService->getCommandeDetails($commande);

        return $this->successResponse($commandeDetails, 'Détails de la commande récupérés.');
    }

    public function update(UpdateCommandeRequest $request, Commande $commande): JsonResponse
    {
        Gate::authorize('update', $commande);

        $uploadedFiles = [];
        if ($request->hasFile('images')) {
            $uploadedFiles = $request->file('images');
        }

        $updatedCommande = $this->commandeService->updateCommande(
            $commande,
            $request->validated(),
            $uploadedFiles
        );

        return $this->successResponse($updatedCommande, 'Commande mise à jour avec succès.');
    }

    public function destroy(Commande $commande): JsonResponse
    {
        Gate::authorize('delete', $commande);

        $this->commandeService->deleteCommande($commande);

        return $this->noContentResponse();
    }

    public function updateStatus(Request $request, Commande $commande): JsonResponse
    {
        Gate::authorize('update', $commande);

        $request->validate([
            'status' => 'required|in:pending,in_progress,ready,delivered,cancelled',
        ]);

        $updatedCommande = $this->commandeService->updateStatus(
            $commande,
            $request->input('status')
        );

        return $this->successResponse($updatedCommande, 'Statut de la commande mis à jour.');
    }
}
