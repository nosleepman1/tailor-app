<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;

class ClientPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('tailor');
    }

    public function view(User $user, Client $client): bool
    {
        return $user->hasRole('admin') || $user->id === $client->tailor_id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('tailor') || $user->hasRole('admin');
    }

    public function update(User $user, Client $client): bool
    {
        return $user->hasRole('admin') || $user->id === $client->tailor_id;
    }

    public function delete(User $user, Client $client): bool
    {
        return $user->hasRole('admin') || $user->id === $client->tailor_id;
    }
}
