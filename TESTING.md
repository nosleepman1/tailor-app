# 🧪 Testing & Local Development Guide

## Running Tests Locally

### Prerequisites

```bash
# Install dependencies
cd server
composer install

# Install frontend deps
cd ../client
npm install
```

### Reset Environment

```bash
cd server

# Copy test environment
cp .env.example .env.testing

# Generate key
php artisan key:generate --env=testing

# Clear cache
php artisan config:clear --env=testing
```

## 🧪 Pest Test Suite

### Run All Tests

```bash
cd server
./vendor/bin/pest
```

### Run Specific Test Suite

```bash
# Feature tests only
./vendor/bin/pest tests/Feature

# Unit tests only
./vendor/bin/pest tests/Unit

# Single test file
./vendor/bin/pest tests/Feature/AuthenticationTest.php

# Single test method
./vendor/bin/pest tests/Feature/AuthenticationTest.php --filter=test_user_can_login_with_valid_credentials
```

### Advanced Testing Options

```bash
# Generate coverage report
./vendor/bin/pest --coverage --coverage-html=coverage

# Run in parallel
./vendor/bin/pest --parallel

# Watch mode (auto-run on changes)
./vendor/bin/pest --watch

# Stop on first failure
./vendor/bin/pest --bail

# Verbose output
./vendor/bin/pest --verbose

# Generate JUnit XML for CI
./vendor/bin/pest --output-format=square --log-junit=report.xml
```

### Test Files Structure

```
tests/
├── Feature/              # API/Integration tests
│   ├── AuthenticationTest.php
│   ├── ClientManagementTest.php
│   └── UserManagementTest.php
├── Unit/                 # Unit tests
│   └── UserTest.php
├── TestCase.php          # Base test class
└── Pest.php             # Pest configuration
```

## 📊 Understanding Test Output

### Success Example
```
   PASS  tests/Feature/AuthenticationTest.php
  ✓ user can login with valid credentials
  ✓ user cannot login with invalid credentials
  ✓ authenticated user can get profile
  ✓ unauthenticated user cannot access protected route
  ✓ user can logout

Tests:    5 passed
Time:     500ms
```

### Failure Example
```
FAIL tests/Feature/ClientManagementTest.php
✗ user can create client with invalid data

AssertionError: Failed assertion in tests/Feature/ClientManagementTest.php:65
Expected validation errors for: ['name', 'email']
Got errors: ['phone']
```

## 🐛 Debugging Tests

### Add Debug Output

```php
// In your test
test('user can login', function () {
    $user = User::factory()->create();
    
    dd($user);  // Dump and die
    // or
    dump($this->response);  // Dump response
});
```

### Use tinker for Testing

```bash
php artisan tinker

# Create test data
>>> $user = User::factory()->create();
>>> $user->id;
>>> Auth::login($user);
```

### View Database State During Tests

```php
test('example', function () {
    $response = $this->postJson('/api/v1/clients', [...]);
    
    // Check what's in database
    $this->assertDatabaseHas('clients', [
        'name' => 'John Doe'
    ]);
    
    // View all records
    $clients = \App\Models\Client::all();
    dd($clients);
});
```

## 🚀 Local Docker Development

### Using Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Reset (including database)
docker-compose down -v
docker-compose up -d
```

### Access Services Locally

```bash
# Frontend
http://localhost:5173

# Backend API
http://localhost:8000

# API routes
http://localhost:8000/api/v1/login
http://localhost:8000/api/docs  # if scribe is configured
```

## 🔍 Common Test Patterns

### Testing Authentication

```php
test('user must be authenticated', function () {
    $response = $this->getJson('/api/v1/me');
    
    $response->assertStatus(401);
});

test('authenticated user can access', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;
    
    $response = $this->getJson('/api/v1/me', [
        'Authorization' => "Bearer $token"
    ]);
    
    $response->assertStatus(200);
});
```

### Testing CRUD Operations

```php
test('can create resource', function () {
    $data = ['name' => 'Test', 'email' => 'test@example.com'];
    
    $response = $this->postJson('/api/v1/clients', $data, headers());
    
    $response->assertStatus(201);
    $this->assertDatabaseHas('clients', $data);
});

test('can update resource', function () {
    $resource = Client::factory()->create();
    
    $response = $this->putJson("/api/v1/clients/{$resource->id}", 
        ['name' => 'Updated'], 
        headers()
    );
    
    $response->assertStatus(200);
    $this->assertDatabaseHas('clients', ['id' => $resource->id, 'name' => 'Updated']);
});

test('can delete resource', function () {
    $resource = Client::factory()->create();
    
    $response = $this->deleteJson("/api/v1/clients/{$resource->id}", [], headers());
    
    $response->assertStatus(204);
    $this->assertDatabaseMissing('clients', ['id' => $resource->id]);
});
```

### Testing Validation

```php
test('validates required fields', function () {
    $response = $this->postJson('/api/v1/clients', 
        ['name' => ''],  // Required, but empty
        headers()
    );
    
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['name']);
});

test('validates email format', function () {
    $response = $this->postJson('/api/v1/clients', 
        ['email' => 'invalid-email'],
        headers()
    );
    
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});

test('validates unique constraint', function () {
    Client::factory()->create(['email' => 'taken@example.com']);
    
    $response = $this->postJson('/api/v1/clients', 
        ['email' => 'taken@example.com'],
        headers()
    );
    
    $response->assertStatus(422)
        ->assertJsonValidationErrors(['email']);
});
```

## 📈 Code Coverage

### Generate Coverage Report

```bash
./vendor/bin/pest --coverage --coverage-html=coverage

# Open in browser
open coverage/index.html
```

### View Coverage in Terminal

```bash
./vendor/bin/pest --coverage

Output:
┌─ Lines ─────────────────────────────┐
│ Methods:   75.50%                   │
│ Lines:     82.30%                   │
└─────────────────────────────────────┘
```

### Coverage Targets

Aim for:
- **Critical paths:** 90%+
- **Business logic:** 80%+
- **Overall:** 70%+

## 🔧 Writing New Tests

### Test Template

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Client;
use Tests\TestCase;

class MyNewTest extends TestCase
{
    protected User $user;
    protected string $token;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->user = User::factory()->create();
        $this->token = $this->user->createToken('test')->plainTextToken;
    }

    protected function headers(): array
    {
        return ['Authorization' => "Bearer $this->token"];
    }

    test('describe what this tests', function () {
        // Arrange - Set up test data
        $client = Client::factory()->create();
        
        // Act - Perform the action
        $response = $this->getJson("/api/v1/clients/{$client->id}", $this->headers());
        
        // Assert - Verify the result
        $response->assertStatus(200)
            ->assertJson(['data' => ['id' => $client->id]]);
    });
}
```

## ⚠️ Common Mistakes to Avoid

❌ **Don't:** Leave test data in production database
✅ **Do:** Use factories and traits to create fresh data each test

❌ **Don't:** Make HTTP requests in unit tests
✅ **Do:** Mock external dependencies

❌ **Don't:** Have interdependent tests
✅ **Do:** Make each test independent

❌ **Don't:** Use sleep() to wait
✅ **Do:** Use assertions or factories

## 📚 Resources

- [Pest Documentation](https://pestphp.com/)
- [Laravel Testing](https://laravel.com/docs/testing)
- [How to Write Good Tests](https://laravel.com/docs/testing#pest)

---

**Next Steps:**
1. Run: `./vendor/bin/pest`
2. All tests should pass
3. Add more tests for your new features
4. Maintain 80%+ coverage
