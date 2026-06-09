<?php

use App\Http\Controllers\UserInput;
use App\Http\Middleware\AllowIframe;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');
Route::post('/ai/chat', [UserInput::class, 'userInput']);

// Iframe-embeddable widget endpoint — uses the minimal widget.blade.php layout
Route::get('/widget', function () {
    Inertia::setRootView('widget');
    return Inertia::render('welcome');
})->middleware(AllowIframe::class)->name('widget');
