<?php

namespace Tests\Feature\Api\V1;

use App\Models\User;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    protected User $admin;
    protected string $adminToken;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->adminToken = $this->admin->createToken('admin-token')->plainTextToken;
    }

    protected function headers(): array
    {
        return [
            'Authorization' => "Bearer $this->adminToken",
            'Accept' => 'application/json',
        ];
    }

    /**
     * Test admin can list all users
     */
    public function test_admin_can_list_users(): void
    {
        User::factory(10)->create();

        $response = $this->getJson('/api/v1/users', $this->headers());

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'email', 'role'],
                ],
            ]);
    }

    /**
     * Test admin can create a new user
     */
    public function test_admin_can_create_user(): void
    {
        $userData = [
            'name' => 'New User',
            'email' => 'newuser@example.com',
            'password' => 'SecurePassword123!',
            'role' => 'tailor',
        ];

        $response = $this->postJson('/api/v1/users', $userData, $this->headers());

        $response->assertStatus(201)
            ->assertJsonPath('data.name', $userData['name'])
            ->assertJsonPath('data.email', $userData['email'])
            ->assertJsonPath('data.role', $userData['role']);

        $this->assertDatabaseHas('users', [
            'email' => $userData['email'],
            'name' => $userData['name'],
        ]);
    }

    /**
     * Test user creation validates required fields
     */
    public function test_user_creation_requires_valid_email(): void
    {
        $response = $this->postJson('/api/v1/users', [
            'name' => 'Invalid User',
            'email' => 'invalid-email',
            'password' => 'password123',
        ], $this->headers());

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test unique email constraint
     */
    public function test_cannot_create_user_with_duplicate_email(): void
    {
        $existingUser = User::factory()->create([
            'email' => 'existing@example.com',
        ]);

        $response = $this->postJson('/api/v1/users', [
            'name' => 'Another User',
            'email' => 'existing@example.com',
            'password' => 'password123',
        ], $this->headers());

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test admin can update user
     */
    public function test_admin_can_update_user(): void
    {
        $user = User::factory()->create();

        $updateData = [
            'name' => 'Updated Name',
            'role' => 'admin',
        ];

        $response = $this->putJson("/api/v1/users/{$user->id}", $updateData, $this->headers());

        $response->assertStatus(200)
            ->assertJsonPath('data.name', $updateData['name']);

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => $updateData['name'],
        ]);
    }

    /**
     * Test admin can delete user
     */
    public function test_admin_can_delete_user(): void
    {
        $userToDelete = User::factory()->create();

        $response = $this->deleteJson(
            "/api/v1/users/{$userToDelete->id}",
            [],
            $this->headers()
        );

        $response->assertStatus(204);

        $this->assertDatabaseMissing('users', ['id' => $userToDelete->id]);
    }

    /**
     * Test non-admin cannot list users
     */
    public function test_non_admin_cannot_list_users(): void
    {
        $regularUser = User::factory()->create(['role' => 'tailor']);
        $token = $regularUser->createToken('user-token')->plainTextToken;

        $response = $this->getJson('/api/v1/users', [
            'Authorization' => "Bearer $token",
        ]);

        $response->assertStatus(403);
    }

    /**
     * Test can retrieve user details
     */
    public function test_can_retrieve_user_details(): void
    {
        $user = User::factory()->create();

        $response = $this->getJson("/api/v1/users/{$user->id}", $this->headers());

        $response->assertStatus(200)
            ->assertJson([
                'data' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
            ]);
    }

    /**
     * Test password is never returned in response
     */
    public function test_password_is_never_returned(): void
    {
        $user = User::factory()->create();

        $response = $this->getJson("/api/v1/users/{$user->id}", $this->headers());

        $response->assertStatus(200)
            ->assertJsonMissing(['password']);
    }
}
