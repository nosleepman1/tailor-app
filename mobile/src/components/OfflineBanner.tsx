import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import { SyncService } from '../services/syncService';
import * as Haptics from 'expo-haptics';

export const OfflineBanner: React.FC = () => {
  const { theme } = useTheme();
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSync = async () => {
    setSyncing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = await SyncService.synchronize();
    setSyncing(false);

    if (result.success) {
      setSyncStatus('Synchronisé !');
      setTimeout(() => setSyncStatus(null), 3000);
    } else {
      setSyncStatus('Mode hors-ligne');
      setTimeout(() => setSyncStatus(null), 3000);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bgLevel2, borderColor: theme.border }]}>
      <View style={styles.left}>
        <WifiOff size={16} color={theme.warning} />
        <Text style={[styles.text, { color: theme.text }]}>
          {syncStatus || 'Mode atelier hors-ligne'}
        </Text>
      </View>
      <TouchableOpacity
        onPress={handleSync}
        disabled={syncing}
        style={[styles.syncButton, { backgroundColor: theme.bgElevated, borderColor: theme.border }]}
      >
        {syncing ? (
          <ActivityIndicator size="small" color={theme.primary} />
        ) : (
          <>
            <RefreshCw size={14} color={theme.primary} />
            <Text style={[styles.syncText, { color: theme.primary }]}>Sync</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 8,
  },
  syncButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  syncText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
