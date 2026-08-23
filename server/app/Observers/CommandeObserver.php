<?php

namespace App\Observers;

use App\Models\Commande;
use Illuminate\Support\Facades\Cache;

class CommandeObserver
{
    protected function clearCache(Commande $commande): void
    {
        if ($commande->tailor_id) {
            try {
                Cache::tags(["tailor_{$commande->tailor_id}"])->flush();
            } catch (\Throwable $e) {
                // If cache tags not supported, ignore
            }
        }
    }

    public function created(Commande $commande): void
    {
        $this->clearCache($commande);
    }

    public function updated(Commande $commande): void
    {
        $this->clearCache($commande);
    }

    public function deleted(Commande $commande): void
    {
        $this->clearCache($commande);
    }

    public function restored(Commande $commande): void
    {
        $this->clearCache($commande);
    }

    public function forceDeleted(Commande $commande): void
    {
        $this->clearCache($commande);
    }
}
