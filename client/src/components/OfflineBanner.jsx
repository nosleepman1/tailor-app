import { useState, useEffect } from 'react'
import { offlineQueue } from '@/utils/offlineQueue'
import { setupSyncListener } from '@/utils/syncManager'

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [queueSize, setQueueSize] = useState(offlineQueue.size())
  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState('')

  useEffect(() => {
    const onOnline  = () => { setIsOnline(true); setQueueSize(offlineQueue.size()) }
    const onOffline = () => { setIsOnline(false); setQueueSize(offlineQueue.size()) }

    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)

    const cleanup = setupSyncListener(({ synced, failed }) => {
      setSyncing(false)
      setQueueSize(offlineQueue.size())
      if (synced > 0) setSyncMsg(`${synced} action(s) synchronisée(s) ✓`)
      if (failed > 0)  setSyncMsg(`${failed} action(s) en échec`)
      setTimeout(() => setSyncMsg(''), 4000)
    })

    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
      cleanup()
    }
  }, [])

  if (isOnline && !syncMsg) return null

  if (syncMsg) return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-emerald-600/90 backdrop-blur-sm text-white text-center py-2 text-xs font-medium">
      {syncMsg}
    </div>
  )

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-600/90 backdrop-blur-sm text-white text-center py-2 text-xs font-medium flex items-center justify-center gap-2">
      <span className="w-2 h-2 rounded-full bg-white animate-pulse-soft" />
      Hors ligne
      {queueSize > 0 && <span className="bg-white/20 rounded px-1.5 py-0.5">{queueSize} en attente</span>}
    </div>
  )
}
