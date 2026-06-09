<?php

namespace App\Ai\Tools;

use App\Models\Course;
use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class RetrievePreviousTranscripts implements Tool
{
    /**
     * Get the description of the tool's purpose.
     * ALWAYS call this tool when the user asks about courses, pricing, or availability.
     */
    public function description(): Stringable|string
    {
        return 'Retrieve available courses from the database. ALWAYS use this tool when the user asks about courses, what courses are available, pricing, or any course-related question. Returns real course data. If no exact match, suggest similar ones.make responses short and concise';
    }

    /**
     * Execute the tool.
     */
    public function handle(Request $request): Stringable|string
    {
        $query = Course::query();

        if ($name = $request['name'] ?? null) {
            $query->where('name', 'LIKE', "%$name%");
        }

        if ($price = $request['price'] ?? null) {
            $query->where('price', $price);
        }

        if ($q = $request['query'] ?? null) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'LIKE', "%$q%")
                    ->orWhere('description', 'LIKE', "%$q%");
            });
        }

        $courses = $query->limit(10)->get();

        if ($courses->isEmpty()) {
            return "No courses found matching your criteria. Here are all available courses:\n"
                . Course::all()->map(fn($c) => "- {$c->name} (Price: \${$c->price}) - {$c->description}")->implode("\n");
        }

        return $courses->map(function ($course) {
            return sprintf(
                '- %s (Price: $%s) - %s',
                $course->name,
                $course->price,
                $course->description
            );
        })->implode("\n");
    }

    /**
     * Get the tool's schema definition.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'name'  => $schema->string()->nullable()->description('Filter by course name (partial match)'),
            'price' => $schema->string()->nullable()->description('Filter by exact price'),
            'query' => $schema->string()->nullable()->description('General search term across name and description'),
        ];
    }
}
