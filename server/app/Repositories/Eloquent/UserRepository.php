<?php

namespace App\Repositories\Eloquent;

use App\Models\User;
use App\Repositories\Contracts\UserRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository implements UserRepositoryInterface
{
    public function findById(int $id): ?User
    {
        return User::with(['roles', 'subscriptions'])->find($id);
    }

    public function findByEmailOrPhone(string $login): ?User
    {
        return User::where('email', $login)
            ->orWhere('phone', $login)
            ->first();
    }

    public function findByEmail(string $email): ?User
    {
        return User::where('email', $email)->first();
    }

    public function findByPhone(string $phone): ?User
    {
        return User::where('phone', $phone)->first();
    }

    public function getTailorsPaginated(int $perPage = 20): LengthAwarePaginator
    {
        return User::role('tailor')
            ->withCount(['clients', 'commandes'])
            ->latest('id')
            ->paginate($perPage);
    }

    public function getAllTailors(): Collection
    {
        return User::role('tailor')
            ->withCount(['clients', 'commandes'])
            ->latest('id')
            ->get();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(User $user, array $data): User
    {
        $user->update($data);
        return $user->fresh(['roles']);
    }

    public function delete(User $user): bool
    {
        return (bool) $user->delete();
    }

    public function countTailors(): int
    {
        return User::role('tailor')->count();
    }
}
