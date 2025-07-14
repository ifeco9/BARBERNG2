import PushNotification from 'react-native-push-notification';
import { Platform, Alert } from 'react-native';

// Single NotificationService implementation
export const NotificationService = {
  configurePushNotifications: () => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  },
  
  requestPermissions: async () => {
    try {
      // For React Native, permissions are handled in the configure method
      return true;
    } catch (error) {
      console.error('Permission request error:', error);
      Alert.alert(
        'Notification Permission',
        'To receive booking updates and reminders, please enable notifications for this app in your device settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
  },
  
  scheduleLocalNotification: (title, body, data = {}, seconds = 5) => {
    PushNotification.localNotificationSchedule({
      title: title,
      message: body,
      date: new Date(Date.now() + seconds * 1000),
      userInfo: data,
    });
  },
  
  cancelAllNotifications: () => {
    PushNotification.cancelAllLocalNotifications();
  },
  
  getBadgeCount: async () => {
    return 0; // Implement based on your app's requirements
  },
  
  setBadgeCount: (count) => {
    PushNotification.setApplicationIconBadgeNumber(count);
  }
};