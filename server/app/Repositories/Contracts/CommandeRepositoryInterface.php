<?php

namespace App\Repositories\Contracts;

use App\Models\Commande;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface CommandeRepositoryInterface
{
    public function getPaginatedForTailor(
        int $tailorId,
        int $perPage = 20,
        ?string $status = null,
        ?int $clientId = null,
        ?int $eventId = null
    ): LengthAwarePaginator;

    public function findById(int $id): ?Commande;

    public function findByIdForTailor(int $id, int $tailorId): ?Commande;

    public function create(array $data): Commande;

    public function update(Commande $commande, array $data): Commande;

    public function delete(Commande $commande): bool;

    public function getActiveOrdersForTailor(int $tailorId): Collection;

    public function countActiveForTailor(int $tailorId): int;
}
