<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AllowIframe
{
    /**
     * Remove X-Frame-Options so this page can be embedded in an iframe
     * on any external website.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $response->headers->remove('X-Frame-Options');

        // Allow framing from any origin (use specific domain in production)
        $response->headers->set('Content-Security-Policy', "frame-ancestors *");

        return $response;
    }
}
