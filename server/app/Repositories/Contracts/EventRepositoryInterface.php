<?php

namespace App\Repositories\Contracts;

use App\Models\Event;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface EventRepositoryInterface
{
    public function getPaginated(int $perPage = 20): LengthAwarePaginator;

    public function getAllUpcoming(): Collection;

    public function findById(int $id): ?Event;

    public function create(array $data): Event;

    public function update(Event $event, array $data): Event;

    public function delete(Event $event): bool;
}
