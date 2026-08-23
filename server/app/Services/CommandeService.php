<?php

namespace App\Services;

use App\Models\Client;
use App\Models\Commande;
use App\Models\Revenue;
use App\Models\User;
use App\Repositories\Contracts\ClientRepositoryInterface;
use App\Repositories\Contracts\CommandeRepositoryInterface;
use App\Repositories\Contracts\RevenueRepositoryInterface;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class CommandeService
{
    public function __construct(
        protected CommandeRepositoryInterface $commandeRepository,
        protected ClientRepositoryInterface $clientRepository,
        protected RevenueRepositoryInterface $revenueRepository
    ) {}

    public function getPaginatedCommandes(
        User $tailor,
        int $perPage = 20,
        ?string $status = null,
        ?int $clientId = null,
        ?int $eventId = null
    ): LengthAwarePaginator {
        return $this->commandeRepository->getPaginatedForTailor(
            $tailor->id,
            $perPage,
            $status,
            $clientId,
            $eventId
        );
    }

    public function getCommandeDetails(Commande $commande): Commande
    {
        return $commande->load([
            'client.measurement',
            'event:id,name,date,type',
            'revenues',
        ]);
    }

    public function createCommande(User $tailor, array $data, array $uploadedFiles = []): Commande
    {
        return DB::transaction(function () use ($tailor, $data, $uploadedFiles) {
            $clientId = $data['client_id'] ?? null;

            // Handle inline new_client creation
            if (empty($clientId) && !empty($data['new_client'])) {
                $newClientData = $data['new_client'];
                $newClientData['tailor_id'] = $tailor->id;
                
                $measurements = $newClientData['measurements'] ?? null;
                unset($newClientData['measurements']);

                $client = $this->clientRepository->create($newClientData);

                if (!empty($measurements) && is_array($measurements)) {
                    $client->measurement()->create($measurements);
                }

                $clientId = $client->id;
            }

            $commandeData = collect($data)->except(['new_client', 'images'])->toArray();
            $commandeData['client_id'] = $clientId;
            $commandeData['tailor_id'] = $tailor->id;

            // Handle uploaded images
            $images = [];
            if (!empty($uploadedFiles['model'])) {
                $images['model'] = $uploadedFiles['model']->store('commandes', 'public');
            }
            if (!empty($uploadedFiles['fabric'])) {
                $images['fabric'] = $uploadedFiles['fabric']->store('commandes', 'public');
            }

            if (!empty($images)) {
                $commandeData['images'] = $images;
            }

            $commande = $this->commandeRepository->create($commandeData);

            // Record deposit as revenue if > 0
            $deposit = (float) ($commande->deposit_paid ?? 0);
            if ($deposit > 0) {
                $this->revenueRepository->create([
                    'user_id' => $tailor->id,
                    'commande_id' => $commande->id,
                    'client_id' => $clientId,
                    'amount' => $deposit,
                    'payment_date' => now(),
                    'type' => 'advance',
                    'status' => 'completed',
                ]);
            }

            $this->clearTailorCache($tailor->id);

            return $commande->load(['client.measurement', 'event', 'revenues']);
        });
    }

    public function updateCommande(Commande $commande, array $data, array $uploadedFiles = []): Commande
    {
        return DB::transaction(function () use ($commande, $data, $uploadedFiles) {
            $oldDeposit = (float) ($commande->deposit_paid ?? 0);
            $updateData = collect($data)->except(['new_client', 'images'])->toArray();

            // Handle uploaded images
            $images = $commande->images ?? [];
            if (!empty($uploadedFiles['model'])) {
                $images['model'] = $uploadedFiles['model']->store('commandes', 'public');
            }
            if (!empty($uploadedFiles['fabric'])) {
                $images['fabric'] = $uploadedFiles['fabric']->store('commandes', 'public');
            }

            if (!empty($images)) {
                $updateData['images'] = $images;
            }

            $updatedCommande = $this->commandeRepository->update($commande, $updateData);

            // If deposit has increased, log new incremental revenue
            if (array_key_exists('deposit_paid', $data)) {
                $newDeposit = (float) $data['deposit_paid'];
                if ($newDeposit > $oldDeposit) {
                    $increment = $newDeposit - $oldDeposit;
                    $isFull = $updatedCommande->price && $newDeposit >= $updatedCommande->price;

                    $this->revenueRepository->create([
                        'user_id' => $commande->tailor_id,
                        'commande_id' => $commande->id,
                        'client_id' => $commande->client_id,
                        'amount' => $increment,
                        'payment_date' => now(),
                        'type' => $isFull ? 'final' : 'advance',
                        'status' => 'completed',
                    ]);
                }
            }

            $this->clearTailorCache($commande->tailor_id);

            return $updatedCommande->load(['client.measurement', 'event', 'revenues']);
        });
    }

    public function deleteCommande(Commande $commande): bool
    {
        $tailorId = $commande->tailor_id;
        $deleted = $this->commandeRepository->delete($commande);

        $this->clearTailorCache($tailorId);

        return $deleted;
    }

    public function updateStatus(Commande $commande, string $newStatus): Commande
    {
        $commande->update(['status' => $newStatus]);
        $this->clearTailorCache($commande->tailor_id);
        return $commande->fresh(['client', 'event']);
    }

    protected function clearTailorCache(int $tailorId): void
    {
        try {
            Cache::tags(["tailor_{$tailorId}"])->flush();
        } catch (\Throwable $e) {
            // If cache tags not supported, ignore
        }
    }
}
