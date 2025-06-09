import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '../api/supabase';

export class NotificationService {
  // Register for push notifications
  static async registerForPushNotifications(userId) {
    if (!Device.isDevice) {
      console.log('Physical device is required for Push Notifications');
      return;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      
      // Save the token to the database
      await this.saveTokenToDatabase(userId, token);
      
      // Configure notification handler
      this.configurePushNotifications();
      
      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  }

  // Save token to database
  static async saveTokenToDatabase(userId, token) {
    try {
      const { error } = await supabase
        .from('push_tokens')
        .upsert([
          {
            user_id: userId,
            token,
            device_type: Platform.OS,
            created_at: new Date(),
          },
        ]);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving push token:', error);
    }
  }

  // Configure notification handlers
  static configurePushNotifications() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  // Send local notification
  static async sendLocalNotification(title, body, data = {}) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: null, // Immediately
    });
  }

  // Handle received notification
  static setNotificationReceivedListener(callback) {
    return Notifications.addNotificationReceivedListener(callback);
  }

  // Handle notification response (when user taps)
  static setNotificationResponseReceivedListener(callback) {
    return Notifications.addNotificationResponseReceivedListener(callback);
  }
}