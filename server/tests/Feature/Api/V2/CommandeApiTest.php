<?php

namespace Tests\Feature\Api\V2;

use App\Models\Client;
use App\Models\Commande;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CommandeApiTest extends TestCase
{
    protected User $tailor;
    protected Client $client;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'tailor', 'guard_name' => 'web']);
        
        $this->tailor = User::factory()->create(['role' => 'tailor']);
        $this->tailor->assignRole('tailor');

        $this->client = Client::factory()->create([
            'tailor_id' => $this->tailor->id,
            'full_name' => 'Modou Ndiaye',
        ]);
    }

    public function test_tailor_can_create_commande_with_deposit(): void
    {
        $this->actingAs($this->tailor);

        $response = $this->postJson('/api/v2/commandes', [
            'client_id' => $this->client->id,
            'fabric_description' => 'Costume 3 pièces lin beige',
            'price' => 50000,
            'deposit_paid' => 30000,
            'due_date' => now()->addDays(7)->toDateString(),
            'status' => 'pending',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'data' => [
                    'fabric_description' => 'Costume 3 pièces lin beige',
                    'price' => '50000.00',
                    'deposit_paid' => '30000.00',
                ],
            ]);

        $this->assertDatabaseHas('commandes', [
            'tailor_id' => $this->tailor->id,
            'client_id' => $this->client->id,
            'price' => 50000,
        ]);

        // Verify revenue record was created for deposit
        $this->assertDatabaseHas('revenues', [
            'user_id' => $this->tailor->id,
            'client_id' => $this->client->id,
            'amount' => 30000,
            'type' => 'advance',
        ]);
    }

    public function test_tailor_can_update_commande_status(): void
    {
        $this->actingAs($this->tailor);

        $commande = Commande::factory()->create([
            'tailor_id' => $this->tailor->id,
            'client_id' => $this->client->id,
            'status' => 'pending',
        ]);

        $response = $this->patchJson("/api/v2/commandes/{$commande->id}/status", [
            'status' => 'ready',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'status' => 'ready',
                ],
            ]);

        $this->assertDatabaseHas('commandes', [
            'id' => $commande->id,
            'status' => 'ready',
        ]);
    }
}
