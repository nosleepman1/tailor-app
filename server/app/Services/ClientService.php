<?php

namespace App\Services;

use App\Models\Client;
use App\Models\User;
use App\Repositories\Contracts\ClientRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class ClientService
{
    public function __construct(
        protected ClientRepositoryInterface $clientRepository
    ) {}

    public function getPaginatedClients(User $tailor, int $perPage = 20, ?string $search = null): LengthAwarePaginator
    {
        return $this->clientRepository->getPaginatedForTailor($tailor->id, $perPage, $search);
    }

    public function getClientDetails(Client $client): Client
    {
        return $client->load(['measurement', 'commandes.event']);
    }

    public function createClient(User $tailor, array $data): Client
    {
        return DB::transaction(function () use ($tailor, $data) {
            $measurements = $data['measurements'] ?? null;
            unset($data['measurements']);

            $data['tailor_id'] = $tailor->id;

            if (!empty($data['full_name']) && empty($data['firstname'])) {
                $parts = explode(' ', $data['full_name'], 2);
                $data['firstname'] = $parts[0] ?? '';
                $data['lastname'] = $parts[1] ?? '';
            }

            $client = $this->clientRepository->create($data);

            if (!empty($measurements) && is_array($measurements)) {
                $client->measurement()->create($measurements);
            }

            $this->clearTailorCache($tailor->id);

            return $client->load('measurement');
        });
    }

    public function updateClient(Client $client, array $data): Client
    {
        return DB::transaction(function () use ($client, $data) {
            $measurements = $data['measurements'] ?? null;
            unset($data['measurements']);

            if (!empty($data['full_name']) && empty($data['firstname'])) {
                $parts = explode(' ', $data['full_name'], 2);
                $data['firstname'] = $parts[0] ?? '';
                $data['lastname'] = $parts[1] ?? '';
            }

            $updatedClient = $this->clientRepository->update($client, $data);

            if ($measurements !== null && is_array($measurements)) {
                $client->measurement()->updateOrCreate(
                    ['client_id' => $client->id],
                    $measurements
                );
            }

            $this->clearTailorCache($client->tailor_id);

            return $updatedClient->load('measurement');
        });
    }

    public function deleteClient(Client $client): bool
    {
        $tailorId = $client->tailor_id;
        $deleted = $this->clientRepository->delete($client);

        $this->clearTailorCache($tailorId);

        return $deleted;
    }

    protected function clearTailorCache(int $tailorId): void
    {
        try {
            Cache::tags(["tailor_{$tailorId}"])->flush();
        } catch (\Throwable $e) {
            // If cache driver doesn't support tags (e.g. file/array), skip
        }
    }
}
