<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PushSubscriptionController extends Controller
{
    public function vapidPublicKey()
    {
        return response()->json([
            'key' => config('webpush.vapid.public_key')
        ]);
    }

    public function subscribe(Request $request)
    {
        $request->validate([
            'endpoint' => 'required|string',
            'keys.auth' => 'required|string',
            'keys.p256dh' => 'required|string'
        ]);

        $user = $request->user();
        $user->updatePushSubscription(
            $request->endpoint,
            $request->keys['p256dh'],
            $request->keys['auth']
        );

        return response()->json(['message' => 'Subscription created']);
    }

    public function unsubscribe(Request $request)
    {
        $request->validate([
            'endpoint' => 'required|string'
        ]);

        $user = $request->user();
        $user->deletePushSubscription($request->endpoint);

        return response()->json(['message' => 'Subscription deleted']);
    }
}
