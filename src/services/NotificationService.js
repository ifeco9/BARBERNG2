import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform, Alert } from 'react-native';

export class NotificationService {
  static async requestPermissions() {
    // Check if we're running in Expo Go
    const isExpoGo = Constants.appOwnership === 'expo';
    
    if (isExpoGo) {
      console.log('Push notifications are disabled in Expo Go. Use a development build for full functionality.');
      return false;
    }
    
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Notification Permission',
        'To receive booking updates and reminders, please enable notifications for this app in your device settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
    
    return finalStatus === 'granted';
  }
  
  static configurePushNotifications() {
    // Check if we're running in Expo Go
    const isExpoGo = Constants.appOwnership === 'expo';
    
    if (isExpoGo) {
      console.log('Push notifications are disabled in Expo Go. Use a development build for full functionality.');
      return;
    }
    
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }
  
  static async scheduleLocalNotification(title, body, data = {}, trigger = null) {
    // Check if we're running in Expo Go
    const isExpoGo = Constants.appOwnership === 'expo';
    
    if (isExpoGo) {
      console.log('Push notifications are disabled in Expo Go. Use a development build for full functionality.');
      return null;
    }
    
    const hasPermission = await this.requestPermissions();
    
    if (!hasPermission) {
      console.log('No notification permission');
      return null;
    }
    
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data,
      },
      trigger: trigger || null,
    });
  }
}