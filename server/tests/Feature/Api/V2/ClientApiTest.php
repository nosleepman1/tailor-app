<?php

use App\Models\User;
use App\Models\Client;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'tailor']);
    $this->tailor1 = User::factory()->create(['role' => 'tailor']);
    $this->tailor1->assignRole('tailor');
    
    $this->tailor2 = User::factory()->create(['role' => 'tailor']);
    $this->tailor2->assignRole('tailor');
});

it('allows a tailor to create a client', function () {
    $this->actingAs($this->tailor1);
    
    $response = $this->postJson('/api/v2/clients', [
        'full_name' => 'Mamadou Diop',
        'phone' => '+221773757077'
    ]);
    
    $response->assertStatus(201)
             ->assertJsonFragment(['full_name' => 'Mamadou Diop']);
             
    $this->assertDatabaseHas('clients', [
        'full_name' => 'Mamadou Diop',
        'tailor_id' => $this->tailor1->id
    ]);
});

it('prevents tailor from viewing another tailors client', function () {
    $client = Client::factory()->create(['tailor_id' => $this->tailor1->id]);
    
    $this->actingAs($this->tailor2);
    
    $response = $this->getJson("/api/v2/clients/{$client->id}");
    
    $response->assertStatus(403);
});

it('allows tailor to view their own client', function () {
    $client = Client::factory()->create(['tailor_id' => $this->tailor1->id]);
    
    $this->actingAs($this->tailor1);
    
    $response = $this->getJson("/api/v2/clients/{$client->id}");
    
    $response->assertStatus(200)
             ->assertJsonFragment(['full_name' => $client->full_name]);
});
