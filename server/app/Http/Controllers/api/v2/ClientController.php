<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Http\Requests\V2\Client\StoreClientRequest;
use App\Http\Requests\V2\Client\UpdateClientRequest;
use App\Models\Client;
use App\Services\ClientService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ClientController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected ClientService $clientService
    ) {}

    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Client::class);

        $perPage = min((int) $request->input('per_page', 20), 100);
        $search = $request->input('search');

        $clients = $this->clientService->getPaginatedClients(
            $request->user(),
            $perPage,
            $search
        );

        return $this->paginatedResponse($clients, 'Liste des clients récupérée avec succès.');
    }

    public function store(StoreClientRequest $request): JsonResponse
    {
        Gate::authorize('create', Client::class);

        $client = $this->clientService->createClient(
            $request->user(),
            $request->validated()
        );

        return $this->createdResponse($client, 'Client enregistré avec succès.');
    }

    public function show(Client $client): JsonResponse
    {
        Gate::authorize('view', $client);

        $clientDetails = $this->clientService->getClientDetails($client);

        return $this->successResponse($clientDetails, 'Détails du client récupérés.');
    }

    public function update(UpdateClientRequest $request, Client $client): JsonResponse
    {
        Gate::authorize('update', $client);

        $updatedClient = $this->clientService->updateClient(
            $client,
            $request->validated()
        );

        return $this->successResponse($updatedClient, 'Client mis à jour avec succès.');
    }

    public function destroy(Client $client): JsonResponse
    {
        Gate::authorize('delete', $client);

        $this->clientService->deleteClient($client);

        return $this->noContentResponse();
    }
}
