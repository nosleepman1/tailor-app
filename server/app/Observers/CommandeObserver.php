<?php

namespace App\Observers;

use App\Models\Commande;
use Illuminate\Support\Facades\Cache;

class CommandeObserver
{
    /**
     * Clear the tailor's cache whenever a commande is modified.
     */
    protected function clearCache(Commande $commande)
    {
        if ($commande->tailor_id) {
            Cache::tags(['tailor_' . $commande->tailor_id])->flush();
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
