# 🎓 Brasi AI Agent — Full Learning Syllabus & Build Prompt

> Copy the **Master Build Prompt** at the bottom and paste it into any AI coding tool (Cursor, GitHub Copilot, Claude, etc.) to have it build this entire project from scratch.

---

## 📚 What This Project Is

A **Laravel + React** web application that embeds an AI sales agent as a chat widget. The agent:
- Talks to users via a floating chat bubble
- Fetches real course data from a database using an AI **Tool**
- Is powered by **OpenRouter** (access to 100+ LLM models)
- Can be **embedded on any website** via `<iframe>`

---

## 🗺️ Full Syllabus — Concepts You Must Learn

### Stage 1 — Laravel Fundamentals
| Topic | What to Learn |
|---|---|
| Installation | `composer create-project laravel/laravel`, directory structure |
| Routing | `routes/web.php`, `Route::get`, `Route::post`, named routes |
| Controllers | `php artisan make:controller`, handling `Request`, returning JSON |
| Middleware | Creating custom middleware, registering it, `$request->next()` |
| Models | `php artisan make:model`, Eloquent ORM, `firstOrCreate`, `all()`, `query()` |
| Migrations | `php artisan make:migration`, `up()` / `down()`, running with `php artisan migrate` |
| Seeders | `DatabaseSeeder`, `CourseSeeder`, `php artisan db:seed` |
| Environment | `.env` file, `env()` helper, API keys |
| Artisan | `config:clear`, `route:clear`, `cache:clear` |

### Stage 2 — Frontend Stack (Inertia + React + Vite)
| Topic | What to Learn |
|---|---|
| Inertia.js | What it is (server-driven SPA), `Route::inertia()`, `Inertia::render()` |
| Vite | `vite.config.ts`, `laravel-vite-plugin`, `npm run dev` vs `npm run build` |
| React + TypeScript | Components, props, `useState`, `useEffect`, `useRef`, `async/await` |
| Tailwind CSS v4 | Utility classes, dark mode, `@tailwind` directives |
| Blade Layouts | `app.blade.php`, `@vite`, `@fonts`, `<x-inertia::app />` |
| Lucide React | Icon library (`Bot`, `User`, `Send`, `MessageCircle`, `X`) |

### Stage 3 — AI Agent Architecture (Laravel AI Package)
| Topic | What to Learn |
|---|---|
| Laravel AI Package | `composer require laravel/ai`, `php artisan vendor:publish --tag=ai-config` |
| Providers | OpenRouter, Gemini, OpenAI — configuring in `config/ai.php` |
| Agent Contract | `implements Agent` — the base interface |
| Conversational Contract | `implements Conversational` — enables multi-turn chat memory |
| HasTools Contract | `implements HasTools` — enables function calling |
| `Promptable` Trait | `use Promptable` — gives `->prompt()`, `->forUser()` methods |
| `RemembersConversations` Trait | Persists conversation history per user |
| `instructions()` Method | System prompt — tells the model who it is and how to behave |
| Tools | Classes that implement `Tool` — `description()`, `handle()`, `schema()` |
| `JsonSchema` | Defining input parameters for tools using `$schema->string()->nullable()` |
| Calling the Agent | `(new SalesCoach)->forUser($user)->prompt($text, provider:, model:, timeout:)` |
| Response Object | `$response->text` — the plain text output from the model |

### Stage 4 — Tools (Function Calling)
| Topic | What to Learn |
|---|---|
| What is a Tool | A function the AI can call to get real data |
| `description()` | Tells the model WHEN to call this tool |
| `handle(Request $request)` | The actual PHP code that runs (DB queries, API calls, etc.) |
| `schema()` | Defines the parameters the AI passes to the tool |
| Query Builder vs Collection | `Course::query()` (chainable) vs `Course::all()` (already fetched) |
| Returning from a Tool | Must return a `string` or `Stringable` — the AI reads this as context |

### Stage 5 — API Design & Security
| Topic | What to Learn |
|---|---|
| CSRF Protection | What it is, excluding routes with `validateCsrfTokens(except: [])` |
| JSON Error Handling | `shouldRenderJsonWhen()`, `$request->expectsJson()` |
| `Accept: application/json` | Why the frontend must send this header |
| `response.ok` | Checking HTTP status before parsing JSON in the frontend |
| X-Frame-Options | HTTP header that blocks iframe embedding — how to remove it |
| `Content-Security-Policy` | `frame-ancestors *` — controls who can embed your page |

### Stage 6 — iframe Widget Embedding
| Topic | What to Learn |
|---|---|
| Dedicated Blade Layout | Creating `widget.blade.php` with transparent background |
| Inertia Root View | `Inertia::setRootView('widget')` — per-request layout switching |
| Custom Middleware | `AllowIframe` — removes `X-Frame-Options`, sets CSP header |
| `window.parent.postMessage` | Sending events from iframe to parent page |
| `window.addEventListener('message')` | Listening in parent page, resizing iframe dynamically |

---

## 🔧 Tech Stack Summary

```
Backend:   PHP 8.3 · Laravel 12 · SQLite
AI:        laravel/ai package · OpenRouter API
Frontend:  React 19 · TypeScript · Inertia.js 3 · Vite 8 · Tailwind CSS 4
Icons:     lucide-react
```

---

## 📋 Master Build Prompt

> Paste this entire prompt into your AI coding tool to build the project from scratch.

---

```
Build a Laravel 12 + React + Inertia.js + TypeScript AI agent web application from scratch.
The app is an AI-powered course sales assistant called "Brasi AI Agent".

=== TECH STACK ===
- Backend: Laravel 12, PHP 8.3, SQLite
- Frontend: React 19, TypeScript, Inertia.js 3, Vite 8, Tailwind CSS v4
- AI: laravel/ai package with OpenRouter as the provider
- Icons: lucide-react (Bot, User, Send, MessageCircle, X)

=== STEP 1: PROJECT SETUP ===
1. Create a new Laravel 12 project.
2. Install and configure Inertia.js with React and TypeScript.
3. Configure Vite with the laravel-vite-plugin, @inertiajs/vite, @vitejs/plugin-react, @tailwindcss/vite.
4. Set up SQLite as the default DB in .env.
5. Install and publish the Laravel AI package: `composer require laravel/ai`
   Then publish its config: `php artisan vendor:publish --tag=ai-config`

=== STEP 2: DATABASE ===
1. Create a `courses` table migration with columns: id, name (string), description (text), price (decimal 8,2), timestamps.
2. Create a Course model (app/Models/Course.php) with a $fillable array for name, description, price.
3. Create a CourseSeeder that uses `Course::firstOrCreate(['name' => ...], [...])` to seed two courses:
   - Web Development | "Learn how to build websites" | $100
   - Mobile Development | "Learn how to build mobile applications" | $100
4. Call CourseSeeder from DatabaseSeeder. Also create a default user with email default@example.com using firstOrCreate.
5. Run migrations and seeders.

=== STEP 3: AI CONFIGURATION ===
In config/ai.php, set:
- 'default' => 'openrouter'
- Add openrouter provider with driver 'openrouter', key from env('OPENROUTER_API_KEY'), url 'https://openrouter.ai/api/v1/', and default text model 'google/gemma-4-26b-a4b-it'

In .env:
OPENROUTER_API_KEY=your_key_here

=== STEP 4: AI TOOL — RetrieveCourses ===
Create app/Ai/Tools/RetrieveCourses.php implementing Laravel\Ai\Contracts\Tool.

Methods:
- description(): Return a string that says:
  "Retrieve available courses from the database. ALWAYS use this tool when the user asks about courses,
   what is available, pricing, or any course-related question. Returns real data."

- handle(Request $request): Stringable|string
  Build a Course::query() (NOT Course::all()).
  If $request['name'] is set, add ->where('name', 'LIKE', "%$value%").
  If $request['query'] is set, search name and description with LIKE.
  Fetch up to 10 results with ->limit(10)->get().
  If empty, return all courses formatted as a fallback list.
  Return results formatted as: "- Web Development ($100) - Learn how to build websites\n..."

- schema(JsonSchema $schema): array
  Return ['name' => $schema->string()->nullable()->description('Filter by course name'),
          'query' => $schema->string()->nullable()->description('General search across name and description')]

=== STEP 5: AI AGENT — SalesCoach ===
Create app/Ai/Agents/SalesCoach.php implementing:
- Laravel\Ai\Contracts\Agent
- Laravel\Ai\Contracts\Conversational
- Laravel\Ai\Contracts\HasTools

Use traits: Promptable, RemembersConversations

Constructor: accepts ?User $user = null, ?string $conversationId = null. Set $this->conversationId.

instructions(): Return:
"You are a brasi.org sales agent. Provide information about courses and guide users to register.
Keep responses short and concise. If you don't know the answer, say so honestly."

tools(): Return [new RetrieveCourses]

DO NOT implement HasStructuredOutput. The agent returns plain text via $response->text.

=== STEP 6: CONTROLLER ===
Create app/Http/Controllers/UserInput.php with a userInput(Request $request) method:
1. Get $text_query from $request->input('query').
2. Get or create a user: $request->user() ?? User::first() ?? User::create([default user data]).
3. Call: $response = (new SalesCoach)->forUser($user)->prompt($text_query, provider: 'openrouter', model: 'google/gemma-4-26b-a4b-it', timeout: 120)
4. Return response()->json(['response' => $response->text, 'user_query' => $text_query])

=== STEP 7: ROUTES ===
In routes/web.php:
- Route::inertia('/', 'welcome')->name('home');
- Route::post('/ai/chat', [UserInput::class, 'userInput']);
- Route::get('/widget', function() { Inertia::setRootView('widget'); return Inertia::render('welcome'); })->middleware(AllowIframe::class)->name('widget');

=== STEP 8: MIDDLEWARE ===
In bootstrap/app.php:

1. Add CSRF exception for 'ai/chat':
   $middleware->validateCsrfTokens(except: ['ai/chat']);

2. Make exceptions return JSON when the request expects it:
   $exceptions->shouldRenderJsonWhen(fn($request) => $request->is('api/*') || $request->expectsJson());

3. Create app/Http/Middleware/AllowIframe.php:
   - In handle(): remove the X-Frame-Options header from the response.
   - Set Content-Security-Policy header to "frame-ancestors *".
   - Return the response.

=== STEP 9: BLADE LAYOUTS ===
1. Default layout (resources/views/app.blade.php):
   Standard Laravel+Inertia layout with @vite, @fonts, <x-inertia::head>, <x-inertia::app />.
   Include a <meta name="csrf-token"> tag.

2. Widget layout (resources/views/widget.blade.php):
   Same as above but with inline CSS making html, body, #app have:
   background: transparent, margin: 0, padding: 0, overflow: hidden, width/height: 100%.

=== STEP 10: REACT CHAT WIDGET (resources/js/pages/welcome.tsx) ===
Build a floating chat bubble UI with these features:

State:
- isOpen (bool): controls whether the chat panel is shown or hidden
- messages (Message[]): array of {role: 'user'|'assistant', content: string}
- input (string): current input field value
- isLoading (bool): shows typing indicator

Layout (for iframe mode):
- A div absolutely positioned at bottom:10px, right:10px, z-index: 999999
- When !isOpen: show a round MessageCircle button (64x64px, zinc-900 bg)
- When isOpen: show a 360x520px chat panel with header, message feed, and input form

Chat panel structure:
- Header: dark zinc-900 bg, Bot icon, "Brasi AI Assistant" title, X close button
- Message feed: scrollable area, messages aligned left (assistant) and right (user)
  Format markdown bold (**text**) and newlines (\n → <br>) using dangerouslySetInnerHTML
- Typing indicator: 3 bouncing dots + "Typing..." text shown while isLoading
- Input: text input + Send button (icon size), form onSubmit triggers handleSend

handleSend logic:
1. e.preventDefault(), guard empty/loading
2. Append user message to messages array
3. setIsLoading(true)
4. fetch('/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '' }, body: JSON.stringify({ query: userMessage }) })
5. if (!response.ok) throw new Error('Server error')
6. const data = await response.json()
7. const aiText = data.response || "I couldn't generate a response."
8. Append assistant message

postMessage (for iframe resize):
- useEffect on isOpen: window.parent.postMessage({ type: 'BRASI_CHAT_RESIZE', state: isOpen ? 'open' : 'closed' }, '*')

=== STEP 11: BUILD & RUN ===
1. php artisan migrate --seed
2. npm run build   (or npm run dev for development)
3. php artisan serve (or use Laravel Herd / Valet)

=== STEP 12: EMBED ON EXTERNAL SITE ===
Add this to any HTML page (replace URL with your domain):

<!-- Collapsed state, auto-resizes when chat opens -->
<iframe
  id="brasi-widget"
  src="https://your-domain.com/widget"
  style="position:fixed;bottom:0;right:0;width:90px;height:90px;border:none;z-index:999999;"
></iframe>

<script>
  window.addEventListener('message', function(e) {
    const frame = document.getElementById('brasi-widget');
    if (e.data?.type === 'BRASI_CHAT_RESIZE') {
      frame.style.width  = e.data.state === 'open' ? '420px' : '90px';
      frame.style.height = e.data.state === 'open' ? '600px' : '90px';
    }
  });
</script>

=== IMPORTANT NOTES ===
- Use Course::query() NOT Course::all() when you need to chain .where().limit().get()
- The AI tool's description() is the system's way of telling the LLM WHEN to call it — make it very explicit
- $response->text only works if the agent does NOT implement HasStructuredOutput
- The CSRF token must be in a <meta name="csrf-token"> tag in the Blade layout for the frontend fetch to find it
- Always send 'Accept: application/json' header from the frontend so Laravel returns JSON errors, not HTML pages
- In production, change "frame-ancestors *" in AllowIframe middleware to your specific domain for security
```
