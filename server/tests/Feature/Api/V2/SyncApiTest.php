<?php

namespace Tests\Feature\Api\V2;

use App\Models\Client;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class SyncApiTest extends TestCase
{
    protected User $tailor;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'tailor', 'guard_name' => 'web']);
        $this->tailor = User::factory()->create(['role' => 'tailor']);
        $this->tailor->assignRole('tailor');
    }

    public function test_tailor_can_pull_deltas(): void
    {
        $this->actingAs($this->tailor);

        Client::factory()->create([
            'tailor_id' => $this->tailor->id,
            'full_name' => 'Ablaye Fall',
        ]);

        $response = $this->getJson('/api/v2/sync/pull');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => [
                    'timestamp',
                    'changes' => ['clients', 'commandes', 'events'],
                ],
            ]);
    }

    public function test_tailor_can_push_offline_changes(): void
    {
        $this->actingAs($this->tailor);

        $payload = [
            'changes' => [
                'clients' => [
                    'created' => [
                        [
                            'full_name' => 'Fatou Bintou Ndiaye',
                            'phone' => '773334455',
                            'measurements' => [
                                'chest' => 96,
                                'shoulder' => 42,
                            ],
                        ],
                    ],
                ],
            ],
        ];

        $response = $this->postJson('/api/v2/sync/push', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'synced' => true,
                ],
            ]);

        $this->assertDatabaseHas('clients', [
            'tailor_id' => $this->tailor->id,
            'full_name' => 'Fatou Bintou Ndiaye',
        ]);
    }
}
