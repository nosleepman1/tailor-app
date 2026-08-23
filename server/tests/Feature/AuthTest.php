<?php

use App\Models\User;

use function Pest\Laravel\withHeaders;



test('user can register', function () {
    $response = $this->postJson('/api/v1/users', [
        'firstname' => 'John',
        'lastname' => 'Doe',
        'username' => 'JohnDoe',
        'email' => 'john.doe@example.com',
        'password' => 'password',
    ]);

    $response->assertStatus(201);
});

test('user can login with email and password', function () {

    User::factory()->create([
        'firstname' => 'John',
        'lastname' => 'Doe',
        'username' => 'JohnDoe',
        'email' => 'john.doe@example.com',
        'password' => 'password',
    ]);

    $response = $this->postJson('/api/v1/login', [
        'email' => 'john.doe@example.com',
        'password' => 'password',
    ]);

    $response->assertStatus(200);
});

test('user can login with username and password', function () {

     User::factory()->create([
        'firstname' => 'John',
        'lastname' => 'Doe',
        'username' => 'JohnDoe',
        'email' => 'john.doe@example.com',
        'password' => 'password',
    ]);

    $response = $this->postJson('/api/v1/login', [
        'username' => 'JohnDoe',
        'password' => 'password',
    ]);

    $response->assertStatus(200);
});


test('user cannot login with invalid credentials', function () {

     User::factory()->create([
        'firstname' => 'John',
        'lastname' => 'Doe',
        'username' => 'JohnDoe',
        'email' => 'john.doe@example.com',
        'password' => 'password',
    ]);

    $response = $this->postJson('/api/v1/login', [
        'email' => 'john.doe@example.com',
        'password' => 'wrongpassword',
    ]);

    $response->assertStatus(401);
});

