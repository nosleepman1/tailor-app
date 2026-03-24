<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthenticated.'], 401);
        }

        // Admin bypass (assuming admins don't need a subscription)
        if ($user->role === 'admin') {
            return $next($request);
        }

        // Check active subscription
        if (!$user->activeSubscription()) {
            return response()->json([
                'success' => false,
                'code' => 'SUBSCRIPTION_REQUIRED',
                'message' => 'Your subscription has expired. Please renew to continue.',
                'redirect' => '/subscription'
            ], 403);
        }

        return $next($request);
    }
}
