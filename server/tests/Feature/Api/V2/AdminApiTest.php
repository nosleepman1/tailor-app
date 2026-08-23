<?php

namespace Tests\Feature\Api\V2;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminApiTest extends TestCase
{
    protected User $admin;
    protected User $tailor;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'tailor', 'guard_name' => 'web']);

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->admin->assignRole('admin');

        $this->tailor = User::factory()->create(['role' => 'tailor']);
        $this->tailor->assignRole('tailor');
    }

    public function test_non_admin_cannot_access_admin_routes(): void
    {
        $this->actingAs($this->tailor);

        $response = $this->getJson('/api/v2/admin/tailors');

        $response->assertStatus(403);
    }

    public function test_admin_can_list_tailors(): void
    {
        $this->actingAs($this->admin);

        $response = $this->getJson('/api/v2/admin/tailors');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'phone'],
                ],
            ]);
    }

    public function test_admin_can_register_new_tailor_with_pin(): void
    {
        $this->actingAs($this->admin);

        $response = $this->postJson('/api/v2/admin/tailors', [
            'name' => 'Atelier Mbao Couture',
            'phone' => '776665544',
            'city' => 'Mbao',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => [
                    'user' => ['id', 'name', 'phone'],
                    'generated_pin',
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'phone' => '776665544',
            'name' => 'Atelier Mbao Couture',
        ]);
    }
}
