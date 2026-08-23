<?php

namespace App\Repositories\Eloquent;

use App\Models\Revenue;
use App\Repositories\Contracts\RevenueRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class RevenueRepository implements RevenueRepositoryInterface
{
    public function create(array $data): Revenue
    {
        return Revenue::create($data);
    }

    public function getForTailor(int $userId): Collection
    {
        return Revenue::where('user_id', $userId)
            ->with(['client:id,full_name', 'commande:id,fabric_description,price'])
            ->latest('payment_date')
            ->get();
    }

    public function getTotalForTailor(int $userId): float
    {
        return (float) Revenue::where('user_id', $userId)
            ->where('status', 'completed')
            ->sum('amount');
    }
}
