<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;





uses(TestCase::class, RefreshDatabase::class)
    ->beforeEach(fn () => Sanctum::actingAs(User::factory()->create()))
    ->in('Feature');
uses(TestCase::class)->in('Unit');

