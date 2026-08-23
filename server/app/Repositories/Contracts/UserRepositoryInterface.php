<?php

namespace App\Repositories\Contracts;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

interface UserRepositoryInterface
{
    public function findById(int $id): ?User;

    public function findByEmailOrPhone(string $login): ?User;

    public function findByEmail(string $email): ?User;

    public function findByPhone(string $phone): ?User;

    public function getTailorsPaginated(int $perPage = 20): LengthAwarePaginator;

    public function getAllTailors(): Collection;

    public function create(array $data): User;

    public function update(User $user, array $data): User;

    public function delete(User $user): bool;

    public function countTailors(): int;
}
