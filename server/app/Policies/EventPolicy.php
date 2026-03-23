<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class EventPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true; 
    }

    public function view(User $user, Event $event): bool
    {
        return true;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('admin');
    }

    public function update(User $user, Event $event): bool
    {
        return $user->hasRole('admin');
    }

    public function delete(User $user, Event $event): bool
    {
        return $user->hasRole('admin');
    }

    public function restore(User $user, Event $event): bool
    {
        return $user->hasRole('admin');
    }

    public function forceDelete(User $user, Event $event): bool
    {
        return $user->hasRole('admin');
    }
}
