<?php

use App\Ai\Agents\SalesCoach;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('user query returns response from sales coach agent', function () {
    SalesCoach::fake([
        ['feedback' => 'This is a mocked feedback from the sales coach.']
    ]);

    // Seed a user as required by the controller
    User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    $response = $this->postJson('/ai/chat', [
        'query' => 'Check this sales call transcript'
    ]);

    $response->assertOk()
        ->assertJson([
            'response' => '{"feedback":"This is a mocked feedback from the sales coach."}',
            'user_query' => 'Check this sales call transcript',
        ]);
});
