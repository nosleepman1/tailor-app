<?php

namespace Tests\Feature\Api\V2;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'tailor', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    }

    public function test_tailor_can_login_with_phone_and_pin(): void
    {
        $user = User::factory()->create([
            'phone' => '779998877',
            'pin' => '1234',
            'role' => 'tailor',
            'active' => true,
        ]);
        $user->assignRole('tailor');

        $response = $this->postJson('/api/v2/login', [
            'login' => '779998877',
            'password_or_pin' => '1234',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Connexion réussie.',
            ])
            ->assertJsonStructure([
                'data' => [
                    'token',
                    'user' => ['id', 'name', 'phone'],
                    'role',
                ],
            ]);
    }

    public function test_user_cannot_login_with_wrong_pin(): void
    {
        $user = User::factory()->create([
            'phone' => '778887766',
            'pin' => '1234',
            'active' => true,
        ]);

        $response = $this->postJson('/api/v2/login', [
            'login' => '778887766',
            'password_or_pin' => '0000',
        ]);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
            ]);
    }

    public function test_tailor_can_register_new_account(): void
    {
        $response = $this->postJson('/api/v2/register', [
            'name' => 'Atelier Keur Serigne',
            'phone' => '775554433',
            'email' => 'serigne@atelier.sn',
            'password' => 'passer123',
            'pin' => '9988',
            'city' => 'Thiès',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => ['token', 'user', 'role'],
            ]);

        $this->assertDatabaseHas('users', [
            'phone' => '775554433',
            'name' => 'Atelier Keur Serigne',
        ]);
    }

    public function test_authenticated_user_can_access_me_profile(): void
    {
        $user = User::factory()->create(['role' => 'tailor']);
        $user->assignRole('tailor');
        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->getJson('/api/v2/me');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'user' => ['id' => $user->id, 'name' => $user->name],
                ],
            ]);
    }

    public function test_user_can_logout(): void
    {
        $user = User::factory()->create();
        $token = $user->createToken('test_token')->plainTextToken;

        $response = $this->withHeader('Authorization', "Bearer {$token}")
            ->postJson('/api/v2/logout');

        $response->assertStatus(200)
            ->assertJson(['success' => true]);
    }
}
