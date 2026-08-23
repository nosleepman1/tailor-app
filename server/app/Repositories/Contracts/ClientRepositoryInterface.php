<?php

namespace App\Repositories\Contracts;

use App\Models\Client;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface ClientRepositoryInterface
{
    public function getPaginatedForTailor(int $tailorId, int $perPage = 20, ?string $search = null): LengthAwarePaginator;

    public function getAllForTailor(int $tailorId): Collection;

    public function findById(int $id): ?Client;

    public function findByIdForTailor(int $id, int $tailorId): ?Client;

    public function create(array $data): Client;

    public function update(Client $client, array $data): Client;

    public function delete(Client $client): bool;

    public function countForTailor(int $tailorId): int;
}
