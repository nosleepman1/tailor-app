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
use App\Notifications\MultiChannelNotification;

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
        $plans = \Illuminate\Support\Facades\Cache::remember('dexpay_subscription_plans', 86400, function () {
            return [
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
            ];
        });

        return response()->json($plans);
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

        $appUrl = env('APP_URL') ?: $request->getSchemeAndHttpHost();
        $frontendUrl = env('APP_FRONTEND_URL', 'http://localhost:5173');

        // WORKAROUND: DexPay API strictly REJECTS `localhost` or `127.0.0.1` in ANY url.
        // We use a dummy public domain if we are developing locally so the API doesn't throw 422.
        $isLocal = str_contains($appUrl, 'localhost') || str_contains($appUrl, '127.0.0.1');
        $validApiUrl = $isLocal ? 'https://tailleurapp.com' : $appUrl;

        $phone = $user->phone ?? '770000000';
        if (!preg_match('/^\+/', $phone)) {
            $phone = '+221' . ltrim($phone, '0');
        }

        $sessionData = [
            'reference' => $reference,
            'item_name' => "Abonnement {$plan} - Tailleur App",
            'amount' => $amount,
            'currency' => 'XOF',
            'countryISO' => 'SN',
            'success_url' => "{$validApiUrl}/api/v2/subscriptions/success-redirect?ref={$reference}",
            'failure_url' => "{$validApiUrl}/api/v2/subscriptions/failure-redirect?ref={$reference}",
            'webhook_url' => "{$validApiUrl}/api/v2/webhooks/dexpay",
            'customer' => [
                'name' => trim($user->name ?: ($user->firstname . ' ' . $user->lastname)) ?: 'Client Tailleur',
                'email' => $user->email ?? 'test@tailleurapp.com',
                'phone' => $phone
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

                $request->user()->notify(new MultiChannelNotification(
                    'Abonnement activé !',
                    'Votre paiement a réussi. Profitez de toutes nos fonctionnalités !',
                    'general',
                    url('/settings')
                ));

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
        $user = $request->user();
        $subscription = \Illuminate\Support\Facades\Cache::tags(['tailor_' . $user->id])->rememberForever('current_subscription', function () use ($user) {
            return $user->activeSubscription();
        });
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

                    $subscription->user->notify(new MultiChannelNotification(
                        'Paiement de l\'abonnement réussi',
                        'Nous avons bien reçu votre paiement. Votre abonnement est maintenant actif.',
                        'general',
                        url('/settings')
                    ));
                }
            }
        }

        return response()->json(['status' => 'success']);
    }
}
