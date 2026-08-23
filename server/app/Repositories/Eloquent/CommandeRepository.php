<?php

namespace App\Repositories\Eloquent;

use App\Models\Commande;
use App\Repositories\Contracts\CommandeRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class CommandeRepository implements CommandeRepositoryInterface
{
    public function getPaginatedForTailor(
        int $tailorId,
        int $perPage = 20,
        ?string $status = null,
        ?int $clientId = null,
        ?int $eventId = null
    ): LengthAwarePaginator {
        $query = Commande::where('tailor_id', $tailorId)
            ->with([
                'client:id,tailor_id,full_name,phone,email',
                'event:id,name,date,type',
            ]);

        if (!empty($status)) {
            $query->where('status', $status);
        }

        if (!empty($clientId)) {
            $query->where('client_id', $clientId);
        }

        if (!empty($eventId)) {
            $query->where('event_id', $eventId);
        }

        return $query->latest('id')->paginate($perPage);
    }

    public function findById(int $id): ?Commande
    {
        return Commande::with([
            'client.measurement',
            'event',
            'tailor:id,name,phone,email',
            'revenues'
        ])->find($id);
    }

    public function findByIdForTailor(int $id, int $tailorId): ?Commande
    {
        return Commande::where('tailor_id', $tailorId)
            ->with([
                'client.measurement',
                'event',
                'revenues'
            ])
            ->find($id);
    }

    public function create(array $data): Commande
    {
        return Commande::create($data);
    }

    public function update(Commande $commande, array $data): Commande
    {
        $commande->update($data);
        return $commande->fresh(['client', 'event', 'revenues']);
    }

    public function delete(Commande $commande): bool
    {
        return (bool) $commande->delete();
    }

    public function getActiveOrdersForTailor(int $tailorId): Collection
    {
        return Commande::where('tailor_id', $tailorId)
            ->whereIn('status', ['pending', 'in_progress', 'ready'])
            ->with('client:id,full_name,phone')
            ->orderBy('due_date', 'asc')
            ->get();
    }

    public function countActiveForTailor(int $tailorId): int
    {
        return Commande::where('tailor_id', $tailorId)
            ->whereIn('status', ['pending', 'in_progress', 'ready'])
            ->count();
    }
}
