<?php

namespace App\Repositories\Contracts;

use App\Models\Revenue;
use Illuminate\Database\Eloquent\Collection;

interface RevenueRepositoryInterface
{
    public function create(array $data): Revenue;

    public function getForTailor(int $userId): Collection;

    public function getTotalForTailor(int $userId): float;
}
