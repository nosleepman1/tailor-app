import clientService from '@/services/clientService'
import { offlineQueue } from './offlineQueue'

const handlers = {
  async createClient({ payload }) {
    await clientService.createClient(payload)
  },
  async updateClient({ payload: { id, ...rest } }) {
    await clientService.updateClient(id, rest)
  },
  async deleteClient({ payload: { id } }) {
    await clientService.deleteClient(id)
  },
}

export async function syncOfflineQueue(onProgress) {
  if (!navigator.onLine) return { synced: 0, failed: 0 }

  const queue = offlineQueue.getAll()
  if (!queue.length) return { synced: 0, failed: 0 }

  let synced = 0
  let failed = 0

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i]
    const handler = handlers[item.type]

    if (!handler) {
      console.warn('[SyncManager] Unknown queue type:', item.type)
      failed++
      continue
    }

    try {
      await handler(item)
      synced++
      onProgress?.({ synced, failed, total: queue.length, current: item })
    } catch (err) {
      console.error('[SyncManager] Failed to sync:', item, err)
      failed++
    }
  }

  if (failed === 0) offlineQueue.clear()
  return { synced, failed }
}

export function setupSyncListener(callback) {
  const handler = async () => {
    console.log('[SyncManager] Back online — syncing...')
    const result = await syncOfflineQueue()
    callback?.(result)
  }
  window.addEventListener('online', handler)
  return () => window.removeEventListener('online', handler)
}
