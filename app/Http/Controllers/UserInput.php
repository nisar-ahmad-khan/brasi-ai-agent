<?php

namespace App\Http\Controllers;

use App\Ai\Agents\SalesCoach;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class UserInput extends Controller
{
    public function userInput(Request $request)
    {
        $text_query = $request->input('query');
        $conversationId = Str::uuid();

        $user = $request->user() ?? User::first() ?? User::create([
            'name' => 'Default User',
            'email' => 'default@example.com',
            'password' => bcrypt('password'),
        ]);

        $response = (new SalesCoach)->forUser($user)->prompt(
            $text_query,
            provider: "openrouter",
            model: 'google/gemma-4-26b-a4b-it',
            timeout: 120,
        );

        return response()->json([
            'response' => $response->text,
            'user_query' => $text_query
        ]);
    }
}
