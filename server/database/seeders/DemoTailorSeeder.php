<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Commande;
use App\Models\Event;
use App\Models\Revenue;
use App\Models\Subscription;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class DemoTailorSeeder extends Seeder
{
    /**
     * Run demo data seeder for tailors, clients, measurements and commandes.
     */
    public function run(): void
    {
        $tabaskiEvent = Event::where('type', 'tabaski')->first();
        $koriteEvent = Event::where('type', 'korite')->first();

        // 1. Tailor 1: Atelier Makhtoum
        $makhtoum = User::updateOrCreate(
            ['phone' => '773757077'],
            [
                'name' => 'Atelier Makhtoum Couture',
                'email' => 'makhtoum@tailor.app',
                'password' => 'passer123',
                'pin' => '1234',
                'city' => 'Dakar, Médina',
                'role' => 'tailor',
                'active' => true,
                'is_subscribed' => true,
            ]
        );
        $makhtoum->syncRoles(['tailor']);

        // Subscription for Makhtoum
        Subscription::updateOrCreate(
            ['user_id' => $makhtoum->id],
            [
                'plan' => 'premium',
                'amount' => 5000,
                'status' => 'active',
                'dexpay_reference' => 'DEMO_SUB_MAKHTOUM',
                'starts_at' => Carbon::now()->subDays(5),
                'expires_at' => Carbon::now()->addDays(25),
            ]
        );

        // 2. Clients for Makhtoum
        $client1 = Client::updateOrCreate(
            ['tailor_id' => $makhtoum->id, 'phone' => '771112233'],
            [
                'full_name' => 'Moussa Diagne',
                'firstname' => 'Moussa',
                'lastname' => 'Diagne',
                'email' => 'moussa.diagne@example.com',
                'address' => 'Dakar, Sacré-Cœur 3',
                'notes' => 'Préfère les cols officier et les tissus légers.',
            ]
        );

        $client1->measurement()->updateOrCreate(
            ['client_id' => $client1->id],
            [
                'neck' => 41.5,
                'chest' => 102.0,
                'shoulder' => 46.0,
                'arm_length' => 64.0,
                'belly' => 92.0,
                'boubou_length' => 140.0,
                'pant_length' => 105.0,
                'hips' => 100.0,
                'thigh' => 58.0,
                'biceps' => 34.0,
            ]
        );

        $client2 = Client::updateOrCreate(
            ['tailor_id' => $makhtoum->id, 'phone' => '772223344'],
            [
                'full_name' => 'Aïssatou Sow',
                'firstname' => 'Aïssatou',
                'lastname' => 'Sow',
                'email' => 'aissatou.sow@example.com',
                'address' => 'Dakar, Almadies',
                'notes' => 'Modèle marinière brodée.',
            ]
        );

        $client2->measurement()->updateOrCreate(
            ['client_id' => $client2->id],
            [
                'neck' => 38.0,
                'chest' => 94.0,
                'shoulder' => 40.0,
                'arm_length' => 58.0,
                'belly' => 78.0,
                'boubou_length' => 135.0,
                'pant_length' => 100.0,
                'hips' => 104.0,
                'thigh' => 56.0,
                'biceps' => 30.0,
            ]
        );

        // 3. Commandes for Makhtoum
        $commande1 = Commande::updateOrCreate(
            ['tailor_id' => $makhtoum->id, 'client_id' => $client1->id, 'fabric_description' => 'Grand Boubou 3 pièces Bazin Riche Bleu'],
            [
                'event_id' => $tabaskiEvent?->id,
                'status' => 'in_progress',
                'price' => 35000,
                'deposit_paid' => 20000,
                'due_date' => Carbon::now()->addDays(4),
                'due_date_remaining' => Carbon::now()->addDays(4),
                'notes' => 'Brodure fil d\'or sur la poitrine.',
            ]
        );

        Revenue::updateOrCreate(
            ['commande_id' => $commande1->id, 'type' => 'advance'],
            [
                'user_id' => $makhtoum->id,
                'client_id' => $client1->id,
                'amount' => 20000,
                'payment_date' => Carbon::now()->subDays(2),
                'status' => 'completed',
            ]
        );

        $commande2 = Commande::updateOrCreate(
            ['tailor_id' => $makhtoum->id, 'client_id' => $client2->id, 'fabric_description' => 'Ensemble Taille Basse Soie Sauvage Verte'],
            [
                'event_id' => $koriteEvent?->id,
                'status' => 'ready',
                'price' => 25000,
                'deposit_paid' => 25000,
                'due_date' => Carbon::now()->addDays(2),
                'notes' => 'Prêt pour essayage final.',
            ]
        );

        Revenue::updateOrCreate(
            ['commande_id' => $commande2->id, 'type' => 'advance'],
            [
                'user_id' => $makhtoum->id,
                'client_id' => $client2->id,
                'amount' => 25000,
                'payment_date' => Carbon::now()->subDays(5),
                'status' => 'completed',
            ]
        );

        // 2. Tailor 2: ProCouture
        $procouture = User::updateOrCreate(
            ['phone' => '774731493'],
            [
                'name' => 'ProCouture Dakar',
                'email' => 'procouture@tailor.app',
                'password' => 'passer123',
                'pin' => '5678',
                'city' => 'Dakar, Point E',
                'role' => 'tailor',
                'active' => true,
                'is_subscribed' => true,
            ]
        );
        $procouture->syncRoles(['tailor']);

        Subscription::updateOrCreate(
            ['user_id' => $procouture->id],
            [
                'plan' => 'basic',
                'amount' => 2500,
                'status' => 'active',
                'dexpay_reference' => 'DEMO_SUB_PROCOUTURE',
                'starts_at' => Carbon::now(),
                'expires_at' => Carbon::now()->addMonth(),
            ]
        );
    }
}
