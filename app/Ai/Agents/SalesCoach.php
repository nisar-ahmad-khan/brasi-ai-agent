<?php

namespace App\Ai\Agents;

use App\Ai\Tools\RetrievePreviousTranscripts;
use App\Models\History;
use App\Models\User;

use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;

use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Messages\Message;
use Laravel\Ai\Promptable;
use Laravel\Ai\Concerns\RemembersConversations;
use Stringable;

class SalesCoach implements Agent, Conversational, HasTools
{
    use Promptable, RemembersConversations;

    public function __construct(public ?User $user = null , ?string $conversationId = null) {
        $this->conversationId = $conversationId;
    }

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return 'You are a brasi.org sales coach, you will provide information about courses, ,
         and guide users to register for courses.
         make responses short and concise, if you dont find any answer, you can say "I dont have the answer to that question". ';
    }

    /**
     * Get the list of messages comprising the conversation so far.
     */
    // public function messages(): iterable
    // {
    //      if(!$this->conversationId) return [];
    //     return AgentConversationMessage::where('conversation_id', $this->conversationId)
    //     ->latest()
    //     ->limit(10)
    //     ->get()
    //     ->reverse()
    //     ->map(function ($message){
    //         return new Message(
    //             role: $message->role,
    //             content: $message->content
    //         );
    //     })->all();
    // }

    /**
     * Get the tools available to the agent.
     *
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [
            new RetrievePreviousTranscripts,
        ];
    }


}