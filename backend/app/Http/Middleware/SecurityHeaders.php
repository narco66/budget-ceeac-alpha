<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'no-referrer');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Content-Security-Policy', "frame-ancestors 'none'");
        $response->headers->set('X-Request-Id', $this->requestId($request));
        $response->headers->remove('X-Powered-By');

        return $response;
    }

    private function requestId(Request $request): string
    {
        $given = $request->headers->get('X-Request-Id');
        if (is_string($given) && preg_match('/^[A-Za-z0-9._-]{8,80}$/', $given) === 1) {
            return $given;
        }

        return (string) Str::uuid();
    }
}
