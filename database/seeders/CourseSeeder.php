<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Course;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $courses = [
            [
                'name'        => 'Web Development',
                'description' => 'Learn how to build websites',
                'price'       => 100,
            ],
            [
                'name'        => 'Mobile Development',
                'description' => 'Learn how to build mobile applications',
                'price'       => 100,
            ],
        ];

        foreach ($courses as $c) {
            Course::firstOrCreate(['name' => $c['name']], $c);
        }
    }

}
