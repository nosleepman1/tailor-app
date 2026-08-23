<?php

namespace App\Repositories\Eloquent;

use App\Models\Client;
use App\Repositories\Contracts\ClientRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ClientRepository implements ClientRepositoryInterface
{
    public function getPaginatedForTailor(int $tailorId, int $perPage = 20, ?string $search = null): LengthAwarePaginator
    {
        $query = Client::where('tailor_id', $tailorId)
            ->with('measurement')
            ->withCount(['commandes as active_orders_count' => function ($q) {
                $q->whereIn('status', ['pending', 'in_progress', 'ready']);
            }]);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        return $query->latest('id')->paginate($perPage);
    }

    public function getAllForTailor(int $tailorId): Collection
    {
        return Client::where('tailor_id', $tailorId)->with('measurement')->latest('id')->get();
    }

    public function findById(int $id): ?Client
    {
        return Client::with(['measurement', 'commandes.event'])->find($id);
    }

    public function findByIdForTailor(int $id, int $tailorId): ?Client
    {
        return Client::where('tailor_id', $tailorId)
            ->with(['measurement', 'commandes.event'])
            ->find($id);
    }

    public function create(array $data): Client
    {
        return Client::create($data);
    }

    public function update(Client $client, array $data): Client
    {
        $client->update($data);
        return $client->fresh(['measurement']);
    }

    public function delete(Client $client): bool
    {
        return (bool) $client->delete();
    }

    public function countForTailor(int $tailorId): int
    {
        return Client::where('tailor_id', $tailorId)->count();
    }
}
