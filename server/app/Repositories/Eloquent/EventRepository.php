<?php

namespace App\Repositories\Eloquent;

use App\Models\Event;
use App\Repositories\Contracts\EventRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class EventRepository implements EventRepositoryInterface
{
    public function getPaginated(int $perPage = 20): LengthAwarePaginator
    {
        return Event::orderBy('date', 'asc')->paginate($perPage);
    }

    public function getAllUpcoming(): Collection
    {
        return Event::where(function ($q) {
            $q->whereNull('date')->orWhere('date', '>=', now()->toDateString());
        })->orderBy('date', 'asc')->get();
    }

    public function findById(int $id): ?Event
    {
        return Event::with('commandes')->find($id);
    }

    public function create(array $data): Event
    {
        return Event::create($data);
    }

    public function update(Event $event, array $data): Event
    {
        $event->update($data);
        return $event->fresh();
    }

    public function delete(Event $event): bool
    {
        return (bool) $event->delete();
    }
}
