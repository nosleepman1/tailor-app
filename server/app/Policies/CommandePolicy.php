<?php

namespace App\Policies;

use App\Models\Commande;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CommandePolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('admin') || $user->hasRole('tailor');
    }

    public function view(User $user, Commande $commande): bool
    {
        return $user->hasRole('admin') || $user->id === $commande->tailor_id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('tailor');
    }

    public function update(User $user, Commande $commande): bool
    {
        return $user->hasRole('admin') || $user->id === $commande->tailor_id;
    }

    public function delete(User $user, Commande $commande): bool
    {
        return $user->hasRole('admin') || $user->id === $commande->tailor_id;
    }

    public function restore(User $user, Commande $commande): bool
    {
        return $user->hasRole('admin');
    }

    public function forceDelete(User $user, Commande $commande): bool
    {
        return $user->hasRole('admin');
    }
}
