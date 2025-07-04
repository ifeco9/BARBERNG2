import 'expo-router/entry';
import 'react-native-gesture-handler';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
// Removed AppNavigator import
import { NotificationService } from './src/services/NotificationService';
import * as SplashScreen from 'expo-splash-screen';
import { supabase } from './src/api/supabase';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore error */
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // Configure notifications inside useEffect
    NotificationService.configurePushNotifications();
    
    async function prepare() {
      try {
        // Test Supabase connection with a table that exists
        const { error } = await supabase.from('profiles').select('count').limit(1);
        if (error) console.warn('Supabase connection issue:', error);
        
        // Pre-load fonts, make API calls, etc.
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn('Preparation error:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady) {
      // Configure notifications after app is ready
      try {
        NotificationService.configurePushNotifications();
      } catch (e) {
        console.warn('Notification setup error:', e);
      }
      
      // Hide the splash screen once the app is ready
      SplashScreen.hideAsync().catch((e) => {
        console.warn('Error hiding splash screen:', e);
      });
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // Consider returning a loading indicator instead
  }

  return (
    <SafeAreaProvider>
      <AuthProvider>
        {/* Removed AppNavigator component - Expo Router handles this now */}
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}