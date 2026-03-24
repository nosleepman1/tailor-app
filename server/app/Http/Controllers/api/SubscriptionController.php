<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\DexPayService;
use App\Models\Subscription;
use App\Models\PaymentLog;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
{
    protected DexPayService $dexpayService;

    public function __construct(DexPayService $dexpayService)
    {
        $this->dexpayService = $dexpayService;
    }

    /**
     * GET /api/subscriptions/plans
     */
    public function plans(): JsonResponse
    {
        return response()->json([
            [
                'id' => 'basic',
                'name' => 'Basic',
                'price' => 2500,
                'features' => ['Feature 1', 'Feature 2']
            ],
            [
                'id' => 'premium',
                'name' => 'Premium',
                'price' => 5000,
                'features' => ['Feature 1', 'Feature 2', 'Feature 3']
            ]
        ]);
    }

    /**
     * POST /api/subscriptions/checkout
     */
    public function checkout(Request $request): JsonResponse
    {
        $request->validate([
            'plan' => 'required|in:basic,premium'
        ]);

        $user = $request->user();
        $plan = $request->plan;
        $amount = $plan === 'basic' ? 2500 : 5000;
        
        $reference = 'TAILLEUR_' . $user->id . '_' . time();

        $appUrl = $request->getSchemeAndHttpHost();
        $frontendUrl = env('APP_FRONTEND_URL', 'http://localhost:5173');

        $sessionData = [
            'reference' => $reference,
            'item_name' => "Abonnement {$plan} - Tailleur App",
            'amount' => $amount,
            'currency' => 'XOF',
            'countryISO' => 'SN',
            'success_url' => "{$appUrl}/api/v2/subscriptions/success-redirect?ref={$reference}",
            'failure_url' => "{$appUrl}/api/v2/subscriptions/failure-redirect?ref={$reference}",
            'webhook_url' => "{$appUrl}/api/v2/webhooks/dexpay",
            'customer' => [
                'name' => $user->name,
                'email' => $user->email ?? 'abdallahdiouf.dev@gmail.com',
                'phone' => '773757077'
            ]
        ];

        try {
            // Create session via DexPay
            $response = $this->dexpayService->createCheckoutSession($sessionData);

            if (!isset($response['data'])) {
                return response()->json($response, 500);
            }

            // Create pending subscription record
            Subscription::create([
                'user_id' => $user->id,
                'plan' => $plan,
                'amount' => $amount,
                'status' => 'pending',
                'dexpay_reference' => $reference,
            ]);

            return response()->json([
                'payment_url' => $response['data']['payment_url'] ?? $response['data']['sandbox_payment_url'] ?? null
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Unable to create checkout session.'], 500);
        }
    }

    /**
     * GET /api/subscriptions/verify?ref={reference}
     */
    public function verify(Request $request): JsonResponse
    {
        $reference = $request->query('ref');
        if (!$reference) {
            return response()->json(['error' => 'Reference is required'], 400);
        }

        $subscription = Subscription::where('dexpay_reference', $reference)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$subscription) {
            return response()->json(['error' => 'Subscription not found'], 404);
        }

        if ($subscription->status === 'active') {
            return response()->json(['status' => 'active']);
        }

        try {
            $session = $this->dexpayService->getSession($reference);
            $paymentStatus = $session['data']['status'] ?? 'pending';

            if ($paymentStatus === 'completed' || $paymentStatus === 'successful') {
                $subscription->update([
                    'status' => 'active',
                    'dexpay_session_data' => $session['data'],
                    'starts_at' => Carbon::now(),
                    'expires_at' => Carbon::now()->addMonth(),
                ]);

                $request->user()->update(['is_subscribed' => true]);

                PaymentLog::create([
                    'subscription_id' => $subscription->id,
                    'user_id' => $request->user()->id,
                    'dexpay_reference' => $reference,
                    'event_type' => 'payment.success',
                    'payload' => $session['data'],
                    'status' => 'completed'
                ]);

                return response()->json(['status' => 'active']);
            }

            return response()->json(['status' => $paymentStatus]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to verify payment'], 500);
        }
    }

    /**
     * GET /api/subscriptions/current
     */
    public function current(Request $request): JsonResponse
    {
        $subscription = $request->user()->activeSubscription();
        return response()->json(['subscription' => $subscription]);
    }

    /**
     * POST /api/webhooks/dexpay
     */
    public function webhook(Request $request): JsonResponse
    {
        // Simple signature verification placeholder
        if (!$this->dexpayService->verifyWebhookSignature($request)) {
            Log::warning('DexPay Webhook: Invalid Signature');
            return response()->json(['error' => 'Invalid signature'], 401);
        }

        $payload = $request->all();
        $eventType = $payload['event'] ?? 'unknown';
        $reference = $payload['data']['reference'] ?? null;

        Log::info("DexPay Webhook Received: {$eventType}", ['reference' => $reference]);

        if ($reference) {
            $subscription = Subscription::where('dexpay_reference', $reference)->first();
            
            if ($subscription) {
                PaymentLog::create([
                    'subscription_id' => $subscription->id,
                    'user_id' => $subscription->user_id,
                    'dexpay_reference' => $reference,
                    'event_type' => $eventType,
                    'payload' => $payload,
                    'status' => $payload['data']['status'] ?? 'unknown'
                ]);

                // Update status if completed
                $status = $payload['data']['status'] ?? null;
                if (($status === 'completed' || $status === 'successful') && $subscription->status !== 'active') {
                    $subscription->update([
                        'status' => 'active',
                        'starts_at' => Carbon::now(),
                        'expires_at' => Carbon::now()->addMonth(),
                    ]);
                    $subscription->user()->update(['is_subscribed' => true]);
                }
            }
        }

        return response()->json(['status' => 'success']);
    }
}
