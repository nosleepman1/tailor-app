<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Commande;
use App\Models\Event;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SyncService
{
    public function __construct(
        protected ClientService $clientService,
        protected CommandeService $commandeService
    ) {}

    /**
     * Pull all changes since the last synchronization timestamp.
     *
     * @param User $tailor
     * @param string|null $lastSyncedAt
     * @return array
     */
    public function pullDeltas(User $tailor, ?string $lastSyncedAt = null): array
    {
        $serverTimestamp = now()->toISOString();
        $dateFilter = !empty($lastSyncedAt) ? Carbon::parse($lastSyncedAt) : null;

        // 1. Clients
        $clientsQuery = Client::where('tailor_id', $tailor->id)->with('measurement');
        if ($dateFilter) {
            $clientsQuery->where('updated_at', '>=', $dateFilter);
        }
        $clients = $clientsQuery->get();

        // 2. Commandes
        $commandesQuery = Commande::where('tailor_id', $tailor->id)
            ->with(['client:id,full_name,phone', 'event:id,name,date,type']);
        if ($dateFilter) {
            $commandesQuery->where('updated_at', '>=', $dateFilter);
        }
        $commandes = $commandesQuery->get();

        // 3. Events
        $eventsQuery = Event::query();
        if ($dateFilter) {
            $eventsQuery->where('updated_at', '>=', $dateFilter);
        }
        $events = $eventsQuery->get();

        return [
            'timestamp' => $serverTimestamp,
            'changes' => [
                'clients' => $clients,
                'commandes' => $commandes,
                'events' => $events,
            ],
        ];
    }

    /**
     * Push offline changes created or updated from Expo mobile app.
     *
     * @param User $tailor
     * @param array $changes
     * @return array
     */
    public function pushChanges(User $tailor, array $changes): array
    {
        return DB::transaction(function () use ($tailor, $changes) {
            $processed = [
                'clients_created' => 0,
                'clients_updated' => 0,
                'commandes_created' => 0,
                'commandes_updated' => 0,
            ];

            // 1. Process clients creations
            if (!empty($changes['clients']['created'])) {
                foreach ($changes['clients']['created'] as $clientData) {
                    $this->clientService->createClient($tailor, $clientData);
                    $processed['clients_created']++;
                }
            }

            // 2. Process clients updates
            if (!empty($changes['clients']['updated'])) {
                foreach ($changes['clients']['updated'] as $clientData) {
                    if (isset($clientData['id'])) {
                        $client = Client::where('tailor_id', $tailor->id)->find($clientData['id']);
                        if ($client) {
                            $this->clientService->updateClient($client, $clientData);
                            $processed['clients_updated']++;
                        }
                    }
                }
            }

            // 3. Process commandes creations
            if (!empty($changes['commandes']['created'])) {
                foreach ($changes['commandes']['created'] as $commandeData) {
                    $this->commandeService->createCommande($tailor, $commandeData);
                    $processed['commandes_created']++;
                }
            }

            // 4. Process commandes updates
            if (!empty($changes['commandes']['updated'])) {
                foreach ($changes['commandes']['updated'] as $commandeData) {
                    if (isset($commandeData['id'])) {
                        $commande = Commande::where('tailor_id', $tailor->id)->find($commandeData['id']);
                        if ($commande) {
                            $this->commandeService->updateCommande($commande, $commandeData);
                            $processed['commandes_updated']++;
                        }
                    }
                }
            }

            return [
                'timestamp' => now()->toISOString(),
                'processed' => $processed,
                'synced' => true,
            ];
        });
    }
}
