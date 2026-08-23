<?php

namespace Tests\Feature\Api\V2;

use App\Models\Subscription;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PaymentApiTest extends TestCase
{
    protected User $tailor;

    protected function setUp(): void
    {
        parent::setUp();
        Role::firstOrCreate(['name' => 'tailor', 'guard_name' => 'web']);
        $this->tailor = User::factory()->create(['role' => 'tailor']);
        $this->tailor->assignRole('tailor');
    }

    public function test_user_can_view_subscription_plans(): void
    {
        $this->actingAs($this->tailor);

        $response = $this->getJson('/api/v2/payments/plans');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'name', 'price', 'currency', 'features'],
                ],
            ]);
    }

    public function test_user_can_initialize_checkout(): void
    {
        $this->actingAs($this->tailor);

        $response = $this->postJson('/api/v2/payments/checkout', [
            'plan' => 'premium',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'data' => ['checkout_url', 'token'],
            ]);

        $this->assertDatabaseHas('subscriptions', [
            'user_id' => $this->tailor->id,
            'plan' => 'premium',
            'status' => 'pending',
        ]);
    }

    public function test_paydunya_webhook_activates_subscription(): void
    {
        $subscription = Subscription::create([
            'user_id' => $this->tailor->id,
            'plan' => 'basic',
            'amount' => 2500,
            'status' => 'pending',
            'dexpay_reference' => 'TOKEN_WEBHOOK_TEST_123',
        ]);

        $response = $this->postJson('/api/v2/payments/webhook', [
            'token' => 'TOKEN_WEBHOOK_TEST_123',
            'status' => 'completed',
            'custom_data' => [
                'user_id' => $this->tailor->id,
                'plan' => 'basic',
            ],
        ]);

        $response->assertStatus(200)
            ->assertJson(['success' => true]);

        $this->assertDatabaseHas('subscriptions', [
            'id' => $subscription->id,
            'status' => 'active',
        ]);

        $this->assertTrue($this->tailor->fresh()->is_subscribed);
    }
}
