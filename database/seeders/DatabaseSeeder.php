<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Support\Facades\Hash; // Good practice for password hashing

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Seed your default user cleanly here so it exists before any controller runs
        User::firstOrCreate(
            ['email' => 'default@example.com'],
            [
                'name' => 'Default User',
                'password' => Hash::make('password'), // Or your specific bcrypt hash
            ]
        );

        // 2. Call your existing CourseSeeder
        $this->call([
            CourseSeeder::class
        ]);
    }
}