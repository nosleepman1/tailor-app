<?php

namespace Tests\Feature\Api\V1;

use App\Models\Client;
use App\Models\User;
use Tests\TestCase;

class ClientManagementTest extends TestCase
{
    protected User $user;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();

        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test-token')->plainTextToken;
    }

    protected function headers(): array
    {
        return [
            'Authorization' => "Bearer $this->token",
            'Accept' => 'application/json',
        ];
    }

    /**
     * Test authenticated user can list all clients
     */
    public function test_user_can_list_clients(): void
    {
        Client::factory(5)->create(['user_id' => $this->user->id]);

        $response = $this->getJson('/api/v1/clients', $this->headers());

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'email', 'phone'],
                ],
                'meta',
            ]);
    }

    /**
     * Test user can create a new client
     */
    public function test_user_can_create_client(): void
    {
        $clientData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'phone' => '+33612345678',
            'address' => '123 Rue de Paris',
        ];

        $response = $this->postJson('/api/v1/clients', $clientData, $this->headers());

        $response->assertStatus(201)
            ->assertJson(['data' => $clientData])
            ->assertJsonPath('data.user_id', $this->user->id);

        $this->assertDatabaseHas('clients', $clientData);
    }

    /**
     * Test validation fails when creating client with invalid data
     */
    public function test_client_creation_fails_with_invalid_data(): void
    {
        $response = $this->postJson('/api/v1/clients', [
            'name' => '', // Required field, empty
            'email' => 'invalid-email',
            'phone' => 'invalid',
        ], $this->headers());

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'phone']);
    }

    /**
     * Test user can update client
     */
    public function test_user_can_update_client(): void
    {
        $client = Client::factory()->create(['user_id' => $this->user->id]);

        $updateData = [
            'name' => 'Jane Doe',
            'phone' => '+33687654321',
        ];

        $response = $this->putJson("/api/v1/clients/{$client->id}", $updateData, $this->headers());

        $response->assertStatus(200)
            ->assertJson(['data' => $updateData]);

        $this->assertDatabaseHas('clients', [
            'id' => $client->id,
            ...$updateData,
        ]);
    }

    /**
     * Test user can delete client
     */
    public function test_user_can_delete_client(): void
    {
        $client = Client::factory()->create(['user_id' => $this->user->id]);

        $response = $this->deleteJson("/api/v1/clients/{$client->id}", [], $this->headers());

        $response->assertStatus(204);

        $this->assertDatabaseMissing('clients', ['id' => $client->id]);
    }

    /**
     * Test user can view single client
     */
    public function test_user_can_view_single_client(): void
    {
        $client = Client::factory()->create(['user_id' => $this->user->id]);

        $response = $this->getJson("/api/v1/clients/{$client->id}", $this->headers());

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $client->id,
                    'name' => $client->name,
                    'email' => $client->email,
                ],
            ]);
    }

    /**
     * Test user cannot access other user's client
     */
    public function test_user_cannot_access_other_user_client(): void
    {
        $otherUser = User::factory()->create();
        $client = Client::factory()->create(['user_id' => $otherUser->id]);

        $response = $this->getJson("/api/v1/clients/{$client->id}", $this->headers());

        $response->assertStatus(403);
    }

    /**
     * Test client status can be updated
     */
    public function test_client_status_can_be_updated(): void
    {
        $client = Client::factory()->create([
            'user_id' => $this->user->id,
            'status' => 'active',
        ]);

        $response = $this->patchJson(
            "/api/v1/clients/{$client->id}/status",
            ['status' => 'inactive'],
            $this->headers()
        );

        $response->assertStatus(200);

        $this->assertDatabaseHas('clients', [
            'id' => $client->id,
            'status' => 'inactive',
        ]);
    }
}
