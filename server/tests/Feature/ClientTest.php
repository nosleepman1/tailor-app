<?php

// namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
// use Illuminate\Foundation\Testing\WithFaker;
// use Tests\TestCase;

// class ClientTest extends TestCase
// {
//     use RefreshDatabase;



// }

use App\Models\Client;
use Database\Seeders\ClientSeeder;

test("database has a least 100 client", function () {
    $this->seed(ClientSeeder::class);
    expect(Client::count())->toBeGreaterThan(100);



});
