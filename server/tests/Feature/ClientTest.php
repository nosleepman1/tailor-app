<?php


use App\Models\Client;
use Database\Seeders\ClientSeeder;

test("database has a least 100 client", function () {
    $this->seed(ClientSeeder::class);
    expect(Client::count())->toBeGreaterThan(100);
});


test('client can be created', function () {
    $response = $this->postJson('/api/v1/clients', [
        'firstname' => 'John',
        'lastname' => 'Doe',
        'phone' => '1234567890',
        'price' => 100,
        'manche' => 63,
        'epaule' => 45,
        'taille' => 180,
        'poitrine' => 100,
        'hanche' => 90,
        'cou' => 40,
        'pantalon' => 80,
        'fesse' => 90,
        'cuisse' => 50,
        'biceps' => 35,
        'bras' => 35,
    ]);

    $response->assertStatus(201);
    $this->assertDatabaseHas('clients', [
        'firstname' => 'John',
        'lastname' => 'Doe',
        'phone' => '1234567890',
        'price' => 100,
        'manche' => 63,
        'epaule' => 45,
        'taille' => 180,
        'poitrine' => 100,
        'hanche' => 90,
        'cou' => 40,
        'pantalon' => 80,
        'fesse' => 90,
        'cuisse' => 50,
        'biceps' => 35,
        'bras' => 35,
    ]);
});

