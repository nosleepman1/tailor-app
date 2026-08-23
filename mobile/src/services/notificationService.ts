import * as Notifications from 'expo-notifications';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

// Configure notification behavior
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch (e) {
  // Safe fallback
}

export class NotificationService {
  /**
   * Register device for Push Notifications safely (never throws or blocks).
   */
  static async registerForPushNotifications(): Promise<string | null> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync().catch(() => ({ status: 'undetermined' }));
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync().catch(() => ({ status: 'denied' }));
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        return null;
      }

      // Android Notification Channel Setup
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('tailleurpro_alerts', {
          name: 'Alertes Atelier & Commandes',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#D4AF37',
          sound: 'default',
        }).catch(() => {});
      }

      const tokenData = await Notifications.getExpoPushTokenAsync().catch(() => null);
      return tokenData?.data || null;
    } catch (error) {
      // Safe fallback - do not crash app on push token errors
      return null;
    }
  }

  /**
   * Play haptic success feedback.
   */
  static async playSuccessSoundAndHaptic(): Promise<void> {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      // Haptics fallback
    }
  }

  /**
   * Play warning/error feedback.
   */
  static async playWarningHaptic(): Promise<void> {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (e) {
      // Fallback
    }
  }
}
