<?php

namespace Tests\Unit\Models;

use App\Models\User;
use Tests\TestCase;

class UserTest extends TestCase
{
    /**
     * Test user password is hashed
     */
    public function test_user_password_is_hashed(): void
    {
        $user = User::factory()->create([
            'password' => bcrypt('password123'),
        ]);

        $this->assertTrue(
            \Hash::check('password123', $user->password),
            'Password hash does not match'
        );
    }

    /**
     * Test user can create API token
     */
    public function test_user_can_create_api_token(): void
    {
        $user = User::factory()->create();

        $token = $user->createToken('test-token');

        $this->assertNotNull($token->plainTextToken);
        $this->assertTrue(
            $user->tokens()->exists(),
            'Token was not created'
        );
    }

    /**
     * Test user has many clients relationship
     */
    public function test_user_has_many_clients(): void
    {
        $user = User::factory()->hasClients(5)->create();

        $this->assertCount(5, $user->clients);
    }

    /**
     * Test user role can be determined
     */
    public function test_user_role_can_be_retrieved(): void
    {
        $adminUser = User::factory()->admin()->create();
        $tailorUser = User::factory()->tailor()->create();

        $this->assertEquals('admin', $adminUser->role);
        $this->assertEquals('tailor', $tailorUser->role);
    }

    /**
     * Test user is active by default
     */
    public function test_user_is_active_by_default(): void
    {
        $user = User::factory()->create();

        $this->assertTrue($user->is_active);
    }
}
