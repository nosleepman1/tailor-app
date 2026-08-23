<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Http\Requests\V2\Event\StoreEventRequest;
use App\Models\Event;
use App\Repositories\Contracts\EventRepositoryInterface;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class EventController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected EventRepositoryInterface $eventRepository
    ) {}

    public function index(Request $request): JsonResponse
    {
        Gate::authorize('viewAny', Event::class);

        $perPage = min((int) $request->input('per_page', 20), 100);
        $events = $this->eventRepository->getPaginated($perPage);

        return $this->paginatedResponse($events, 'Liste des événements récupérée.');
    }

    public function upcoming(): JsonResponse
    {
        Gate::authorize('viewAny', Event::class);

        $events = $this->eventRepository->getAllUpcoming();

        return $this->successResponse($events, 'Événements à venir récupérés.');
    }

    public function store(StoreEventRequest $request): JsonResponse
    {
        Gate::authorize('create', Event::class);

        $event = $this->eventRepository->create($request->validated());

        return $this->createdResponse($event, 'Événement créé avec succès.');
    }

    public function show(Event $event): JsonResponse
    {
        Gate::authorize('view', $event);

        return $this->successResponse($event, 'Détails de l\'événement.');
    }

    public function update(StoreEventRequest $request, Event $event): JsonResponse
    {
        Gate::authorize('update', $event);

        $updatedEvent = $this->eventRepository->update($event, $request->validated());

        return $this->successResponse($updatedEvent, 'Événement mis à jour avec succès.');
    }

    public function destroy(Event $event): JsonResponse
    {
        Gate::authorize('delete', $event);

        $this->eventRepository->delete($event);

        return $this->noContentResponse();
    }
}
