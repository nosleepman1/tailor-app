import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { useToast } from '@/contexts/ToastContext'
import { Button } from '@/components/ui/Button'
import axios from '@/api/axios'

export default function SubscriptionSection() {
  const { user } = useAuthStore()
  const toast = useToast()
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState(null)
  const [plans, setPlans] = useState([])
  const [confirmingPlan, setConfirmingPlan] = useState(null)

  useEffect(() => {
    fetchSubscription()
    fetchPlans()
  }, [])

  const fetchSubscription = async () => {
    try {
      const response = await axios.get('/subscriptions/current')
      setSubscription(response.data.subscription)
    } catch (error) {
      console.error('Failed to fetch subscription:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/subscriptions/plans')
      setPlans(response.data)
    } catch (error) {
      console.error('Failed to fetch plans:', error)
    }
  }

  const handleSubscribe = async (planId) => {
    setLoading(true)
    try {
      const response = await axios.post('/subscriptions/checkout', { plan: planId })
      if (response.data.payment_url) {
        window.location.href = response.data.payment_url
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Échec de la transaction')
    } finally {
      setLoading(false)
      setConfirmingPlan(null)
    }
  }

  const getStatusBadgeClass = (status) => {
    const classes = {
      active: 'badge-green',
      pending: 'badge-gold',
      expired: 'badge-red',
      cancelled: 'badge-gray' // Uses generic text-gray if grey badge not defined
    }
    return `badge ${classes[status] || 'badge-blue'}`
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading && !subscription && plans.length === 0) {
    return <div className="animate-pulse space-y-4">
      <div className="h-24 bg-bg-level2 rounded-xl"></div>
      <div className="h-64 bg-bg-level2 rounded-xl"></div>
    </div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-display font-bold text-text">Votre Abonnement</h2>
        <p className="mt-1 text-sm text-text-muted">
          Gérez votre forfait et vos informations de facturation (Via DexPay).
        </p>
      </div>

      {/* Current Subscription Card */}
      <div className="card p-6 border-l-4 border-l-primary-500">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-text flex items-center gap-3">
              Forfait {subscription?.plan ? subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1) : 'Gratuit'}
              {subscription && (
                <span className={getStatusBadgeClass(subscription.status)}>
                  {subscription.status.toUpperCase()}
                </span>
              )}
            </h3>
            {subscription?.status === 'active' && (
              <p className="mt-1 text-sm text-text-muted">
                Renouvellement prévu le {formatDate(subscription.expires_at)}
              </p>
            )}
            {!subscription && (
               <p className="mt-1 text-sm text-text-muted">
                 Vous n'avez actuellement aucun abonnement en cours. Vous êtes limité dans vos fonctionnalités.
               </p>
            )}
            {subscription?.status === 'pending' && (
               <p className="mt-1 text-sm text-text-muted">
                 Paiement en attente de vérification par DexPay.
               </p>
            )}
          </div>
          
          {subscription?.status === 'active' && (
            <div className="text-right">
              <p className="text-3xl font-bold text-text">
                {subscription.amount} <span className="text-sm font-normal text-text-muted">FCFA/mois</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Available Plans */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-text">Forfaits disponibles</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div 
              key={plan.id}
              className={`card p-6 border-2 transition-all ${
                subscription?.plan === plan.id && subscription?.status === 'active'
                  ? 'border-primary-500 shadow-md'
                  : 'border-transparent hover:border-border'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-text capitalize">{plan.name}</h4>
                  <p className="text-2xl font-extrabold text-primary-600 dark:text-primary-500 mt-2">
                    {plan.price} <span className="text-sm font-medium text-text-muted">FCFA</span>
                  </p>
                </div>
                {subscription?.plan === plan.id && subscription?.status === 'active' && (
                  <span className="badge badge-green">Actuel</span>
                )}
              </div>
              
              <ul className="space-y-3 mb-6">
                {plan.features?.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-text-muted">
                    <svg className="h-5 w-5 text-success shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                variant={subscription?.plan === plan.id && subscription?.status === 'active' ? 'secondary' : 'primary'}
                className="w-full"
                onClick={() => setConfirmingPlan(plan.id)}
                disabled={subscription?.plan === plan.id && subscription?.status === 'active'}
              >
                {subscription?.plan === plan.id && subscription?.status === 'active' 
                  ? 'Déjà actif' 
                  : `Passer à ${plan.name}`}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal Area */}
      {confirmingPlan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-bg-elevated rounded-xl max-w-md w-full p-6 shadow-2xl animate-modal-in border border-border">
            <h3 className="text-xl font-display font-bold text-text mb-4">Confirmer l'abonnement</h3>
            <p className="text-text-muted mb-6">
              Vous allez être redirigé vers DexPay pour finaliser votre paiement sécurisé. 
              Voulez-vous continuer avec le forfait <span className="font-bold capitalize text-text">{confirmingPlan}</span> ?
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setConfirmingPlan(null)}>
                Annuler
              </Button>
              <Button onClick={() => handleSubscribe(confirmingPlan)} isLoading={loading}>
                Continuer vers le paiement
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}