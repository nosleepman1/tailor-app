import { useState, useEffect } from 'react'
import { useToast } from '@/contexts/ToastContext'
import axios from '@/api/axios'
import { usePushNotifications } from '@/hooks/usePushNotifications'
import { Button } from '@/components/ui/Button'

export default function NotificationsSection() {
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [preferences, setPreferences] = useState({
    in_app_notifications: true,
    email_notifications: true,
    marketing_emails: false
  })

  // Hook for PWA Push Subscriptions
  const {
      isSupported,
      permission,
      isSubscribed,
      subscribe,
      unsubscribe
  } = usePushNotifications();

  useEffect(() => {
    fetchPreferences()
  }, [])

  const fetchPreferences = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/user/preferences')
      setPreferences(response.data.data)
    } catch (error) {
      console.log('Using default notification preferences temporarily.')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await axios.put('/user/preferences', preferences)
      toast.success('Préférences de notification sauvegardées')
    } catch (error) {
      toast.error('Échec de la sauvegarde des préférences')
    } finally {
      setSaving(false)
    }
  }

  const handlePushAccess = async () => {
    try {
        if (isSubscribed) {
            await unsubscribe();
            toast.info('Alertes Push désactivées');
        } else {
            await subscribe();
            toast.success('Alertes Push activées avec succès !');
            
            // If push is explicitly blocked by browser, enforce email fallback visually
            if (Notification.permission === 'denied') {
                const newPrefs = { ...preferences, email_notifications: true };
                setPreferences(newPrefs);
                await axios.put('/user/preferences', newPrefs);
                toast.info('Notifications Push refusées. Notifications par e-mail réactivées en secours.');
            }
        }
    } catch (error) {
        console.error('Push Subscription Error:', error);
        toast.error('Erreur Push : ' + (error.message || 'Impossible de souscrire'));
    }
  }

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 bg-bg-level2 rounded w-1/3"></div>
      <div className="h-24 bg-bg-level2 rounded"></div>
      <div className="h-24 bg-bg-level2 rounded"></div>
    </div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-display font-bold text-text">Préférences de notification</h2>
        <p className="mt-1 text-sm text-text-muted">
          Choisissez comment vous souhaitez être informé des activités de votre compte.
        </p>
      </div>

      <div className="space-y-6 relative border border-border rounded-xl p-6 bg-bg-level2">
        <div>
          <h3 className="text-lg font-medium text-text mb-2">Notifications sur l'appareil (Push)</h3>
          <p className="text-sm text-text-muted mb-4">
            Recevez des alertes en temps réel directement sur cet appareil, même lorsque l'application est fermée. Idéal pour les abonnements et paiements.
          </p>
          
          {!isSupported && (
            <p className="text-sm bg-warning/10 text-warning p-3 rounded-lg">
              Votre navigateur ne supporte pas les notifications Push. Utilisez une version récente de Chrome, Safari ou Edge.
            </p>
          )}

          {isSupported && permission === 'denied' && (
             <p className="text-sm bg-error/10 text-error p-3 rounded-lg">
              Vous avez bloqué les notifications dans votre navigateur. Veuillez les autoriser dans les paramètres du site (cadenas à côté de l'URL).
            </p>
          )}

          {isSupported && permission !== 'denied' && (
              <Button 
                variant={isSubscribed ? "secondary" : "primary"}
                onClick={handlePushAccess}
              >
                {isSubscribed ? "Désactiver les alertes Push" : "Activer les alertes Push"}
              </Button>
          )}

          {/* Fallback Warning Link logic dynamically maintained by user choices */}
          {(!isSubscribed || permission === 'denied') && !preferences.email_notifications && (
             <div className="mt-4 flex items-start gap-2 text-sm text-warning">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>Vos alertes Push sont désactivées et vos emails sont en pause. Vous risquez de manquer des avertissements d'expiration.</p>
             </div>
          )}
        </div>
      </div>

      <div className="space-y-6 divide-y divide-border">
        
        <div className="flex items-center justify-between pt-6">
          <div className="pr-4">
            <h3 className="text-base font-medium text-text">Notifications dans l'application</h3>
            <p className="mt-1 text-sm text-text-muted">
              Voir les notifications dans l'interface de Tailleur App.
            </p>
          </div>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              preferences.in_app_notifications ? 'bg-primary-600' : 'bg-border'
            }`}
            onClick={() => handleToggle('in_app_notifications')}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                preferences.in_app_notifications ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between pt-6">
          <div className="pr-4">
            <h3 className="text-base font-medium text-text">Notifications par email</h3>
            <p className="mt-1 text-sm text-text-muted">
              Recevez des emails pour des événements importants (votre abonnement, sécurité, factures).
            </p>
          </div>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              preferences.email_notifications ? 'bg-primary-600' : 'bg-border'
            }`}
            onClick={() => handleToggle('email_notifications')}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                preferences.email_notifications ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between pt-6">
          <div className="pr-4">
            <h3 className="text-base font-medium text-text">Emails marketing</h3>
            <p className="mt-1 text-sm text-text-muted">
              Recevez des offres, nouveautés et conseils d'utilisation de Tailleur App.
            </p>
          </div>
          <button
            type="button"
            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              preferences.marketing_emails ? 'bg-primary-600' : 'bg-border'
            }`}
            onClick={() => handleToggle('marketing_emails')}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                preferences.marketing_emails ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-border">
        <Button 
          onClick={handleSave} 
          isLoading={saving}
        >
          Sauvegarder les préférences
        </Button>
      </div>
    </div>
  )
}