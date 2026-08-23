import * as SecureStore from 'expo-secure-store';
import api from './api';
import { Client, Commande } from '../types';

export interface OfflinePendingChanges {
  clients: {
    created: Partial<Client>[];
    updated: Partial<Client>[];
  };
  commandes: {
    created: Partial<Commande>[];
    updated: Partial<Commande>[];
  };
}

const SYNC_KEY = 'tailor_last_synced_at';
const PENDING_CHANGES_KEY = 'tailor_offline_pending_changes';

export class SyncService {
  /**
   * Get pending offline changes.
   */
  static async getPendingChanges(): Promise<OfflinePendingChanges> {
    const raw = await SecureStore.getItemAsync(PENDING_CHANGES_KEY);
    if (!raw) {
      return {
        clients: { created: [], updated: [] },
        commandes: { created: [], updated: [] },
      };
    }
    try {
      return JSON.parse(raw);
    } catch {
      return {
        clients: { created: [], updated: [] },
        commandes: { created: [], updated: [] },
      };
    }
  }

  /**
   * Add an offline client mutation to pending queue.
   */
  static async queueOfflineClient(client: Partial<Client>): Promise<void> {
    const pending = await this.getPendingChanges();
    pending.clients.created.push(client);
    await SecureStore.setItemAsync(PENDING_CHANGES_KEY, JSON.stringify(pending));
  }

  /**
   * Add an offline commande mutation to pending queue.
   */
  static async queueOfflineCommande(commande: Partial<Commande>): Promise<void> {
    const pending = await this.getPendingChanges();
    pending.commandes.created.push(commande);
    await SecureStore.setItemAsync(PENDING_CHANGES_KEY, JSON.stringify(pending));
  }

  /**
   * Execute Full Delta Synchronization (Pull & Push).
   */
  static async synchronize(): Promise<{ success: boolean; deltas?: any }> {
    try {
      const lastSyncedAt = await SecureStore.getItemAsync(SYNC_KEY);
      const pending = await this.getPendingChanges();

      // 1. Push local changes if any exist
      const hasPending =
        pending.clients.created.length > 0 ||
        pending.clients.updated.length > 0 ||
        pending.commandes.created.length > 0 ||
        pending.commandes.updated.length > 0;

      if (hasPending) {
        await api.post('/sync/push', { changes: pending });
        // Clear pending queue on successful push
        await SecureStore.deleteItemAsync(PENDING_CHANGES_KEY);
      }

      // 2. Pull server changes since last sync
      const params = lastSyncedAt ? { last_synced_at: lastSyncedAt } : {};
      const response = await api.get('/sync/pull', { params });

      if (response.data?.success) {
        const timestamp = response.data.data.timestamp;
        await SecureStore.setItemAsync(SYNC_KEY, timestamp);
        return { success: true, deltas: response.data.data.changes };
      }

      return { success: false };
    } catch (error) {
      console.warn('Sync failed (offline mode active):', error);
      return { success: false };
    }
  }
}
