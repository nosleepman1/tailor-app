import * as Notifications from 'expo-notifications';
import * as Device from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';
import api from './api';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  /**
   * Register device for Push Notifications and send token to backend.
   */
  static async registerForPushNotifications(): Promise<string | null> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Push notification permission denied.');
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
        });
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;

      // Send push token to backend
      if (token) {
        await api.post('/user/push-token', { expo_push_token: token }).catch(() => {
          // Ignore if unauthenticated during initial boot
        });
      }

      return token;
    } catch (error) {
      console.warn('Error configuring push notifications:', error);
      return null;
    }
  }

  /**
   * Play haptic success feedback and optional alert sound.
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
