<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">

        @fonts

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', 'resources/js/pages/welcome.tsx'])
        <x-inertia::head>
            <title>Brasi AI Widget</title>
        </x-inertia::head>

        <style>
            html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                background: transparent !important;
                overflow: hidden;
            }
            #app {
                width: 100%;
                height: 100%;
                background: transparent !important;
            }
        </style>
    </head>
    <body style="background:transparent;">
        <x-inertia::app />
    </body>
</html>
