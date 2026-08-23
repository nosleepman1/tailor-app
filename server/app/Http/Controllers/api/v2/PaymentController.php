<?php

namespace App\Http\Controllers\Api\V2;

use App\Http\Controllers\Controller;
use App\Http\Requests\V2\Payment\CheckoutRequest;
use App\Models\PaymentLog;
use App\Models\Subscription;
use App\Services\PayDunyaService;
use App\Traits\ApiResponse;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected PayDunyaService $payDunyaService
    ) {}

    /**
     * Get available subscription plans.
     */
    public function plans(): JsonResponse
    {
        $plans = [
            [
                'id' => 'basic',
                'name' => 'Forfait Basique',
                'price' => 2500,
                'currency' => 'XOF',
                'period' => 'mois',
                'features' => [
                    'Jusqu\'à 100 clients',
                    'Gestion complète des mesures et commandes',
                    'Suivi des acomptes et dettes',
                    'Mode hors-ligne en atelier',
                ],
            ],
            [
                'id' => 'premium',
                'name' => 'Forfait Professionnel',
                'price' => 5000,
                'currency' => 'XOF',
                'period' => 'mois',
                'features' => [
                    'Clients et commandes illimités',
                    'Photos de modèles & tissus HD',
                    'Rappels et notifications automatiques',
                    'Statistiques financières avancées',
                    'Support prioritaire WhatsApp',
                ],
            ],
        ];

        return $this->successResponse($plans, 'Forfaits récupérés avec succès.');
    }

    /**
     * Get the authenticated user's current subscription.
     */
    public function current(Request $request): JsonResponse
    {
        $subscription = $request->user()->activeSubscription();

        return $this->successResponse([
            'is_subscribed' => $request->user()->is_subscribed && $subscription !== null,
            'subscription' => $subscription,
        ], 'Abonnement actuel récupéré.');
    }

    /**
     * Initiate a PayDunya checkout session for subscription.
     */
    public function checkout(CheckoutRequest $request): JsonResponse
    {
        $user = $request->user();
        $plan = $request->validated('plan');
        $amount = $plan === 'basic' ? 2500 : 5000;
        $reference = 'TAILLEUR_' . $user->id . '_' . time();

        $sessionData = [
            'amount' => $amount,
            'description' => "Abonnement {$plan} TailleurPro - Atelier {$user->name}",
            'return_url' => $request->validated('return_url'),
            'cancel_url' => $request->validated('cancel_url'),
            'custom_data' => [
                'user_id' => $user->id,
                'plan' => $plan,
                'reference' => $reference,
            ],
        ];

        try {
            $invoice = $this->payDunyaService->createInvoice($sessionData);

            // Create pending subscription record
            Subscription::create([
                'user_id' => $user->id,
                'plan' => $plan,
                'amount' => $amount,
                'status' => 'pending',
                'dexpay_reference' => $invoice['token'] ?? $reference,
                'dexpay_session_data' => $invoice,
            ]);

            return $this->successResponse([
                'checkout_url' => $invoice['checkout_url'],
                'token' => $invoice['token'],
            ], 'Facture PayDunya initialisée avec succès.');
        } catch (\Throwable $e) {
            Log::error('PayDunya Checkout Error: ' . $e->getMessage());
            return $this->errorResponse('Impossible de créer la facture de paiement : ' . $e->getMessage(), 500);
        }
    }

    /**
     * Verify payment status using PayDunya Confirm API.
     */
    public function verify(Request $request): JsonResponse
    {
        $token = $request->query('token') ?? $request->query('ref');

        if (!$token) {
            return $this->errorResponse('Le token de facture est obligatoire.', 400);
        }

        $subscription = Subscription::where('dexpay_reference', $token)
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$subscription) {
            return $this->notFoundResponse('Abonnement ou facture introuvable.');
        }

        if ($subscription->status === 'active') {
            return $this->successResponse([
                'status' => 'active',
                'subscription' => $subscription,
            ], 'Abonnement actif.');
        }

        $confirmation = $this->payDunyaService->confirmInvoice($token);
        $status = $confirmation['status'] ?? 'pending';

        if ($status === 'completed' || $status === 'successful') {
            $subscription->update([
                'status' => 'active',
                'starts_at' => Carbon::now(),
                'expires_at' => Carbon::now()->addMonth(),
                'dexpay_session_data' => $confirmation,
            ]);

            $request->user()->update(['is_subscribed' => true]);

            PaymentLog::create([
                'subscription_id' => $subscription->id,
                'user_id' => $request->user()->id,
                'dexpay_reference' => $token,
                'event_type' => 'payment.success',
                'payload' => $confirmation,
                'status' => 'completed',
            ]);

            return $this->successResponse([
                'status' => 'active',
                'subscription' => $subscription->fresh(),
            ], 'Paiement confirmé ! Votre abonnement est activé.');
        }

        return $this->successResponse([
            'status' => $status,
            'subscription' => $subscription,
        ], 'Statut du paiement : ' . $status);
    }

    /**
     * PayDunya IPN Webhook callback.
     */
    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->all();
        $token = $request->input('data.invoice.token') ?? $request->input('token');
        $hash = $request->input('data.hash') ?? $request->input('hash');

        Log::info('PayDunya Webhook received', ['token' => $token]);

        if (!$this->payDunyaService->verifyWebhookSignature($payload, $token, $hash)) {
            Log::warning('PayDunya Webhook: Invalid SHA-512 Signature');
            return $this->errorResponse('Signature de webhook invalide.', 401);
        }

        $status = $request->input('data.status') ?? $payload['status'] ?? 'unknown';
        $userId = $request->input('data.custom_data.user_id') ?? $payload['custom_data']['user_id'] ?? null;

        if ($token) {
            $subscription = Subscription::where('dexpay_reference', $token)->first();

            if ($subscription && ($status === 'completed' || $status === 'successful')) {
                $subscription->update([
                    'status' => 'active',
                    'starts_at' => Carbon::now(),
                    'expires_at' => Carbon::now()->addMonth(),
                ]);

                $subscription->user()->update(['is_subscribed' => true]);

                PaymentLog::create([
                    'subscription_id' => $subscription->id,
                    'user_id' => $subscription->user_id,
                    'dexpay_reference' => $token,
                    'event_type' => 'webhook.payment.success',
                    'payload' => $payload,
                    'status' => 'completed',
                ]);
            }
        }

        return response()->json(['success' => true]);
    }
}
