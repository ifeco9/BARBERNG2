import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '../src/api/supabase';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { NotificationService } from '../src/services/NotificationService';

// You need to install react-error-boundary
// Run: npm install react-error-boundary
import { ErrorBoundary } from 'react-error-boundary';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore error */
});

// Error Fallback component
function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Something went wrong</Text>
      <Text style={styles.errorMessage}>{error.message}</Text>
      <TouchableOpacity style={styles.errorButton} onPress={resetErrorBoundary}>
        <Text style={styles.errorButtonText}>Try again</Text>
      </TouchableOpacity>
    </View>
  );
}

// Define InnerLayout component
function InnerLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { user } = useAuth();

  useEffect(() => {
    // Handle auth state changes and deep links
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        // Get user type from session
        const userType = session?.user?.user_metadata?.user_type || 'customer';
        
        // Navigate based on user type
        if (userType === 'customer') {
          router.replace('/(app)/(customer)/home');
        } else if (userType === 'provider') {
          router.replace('/(app)/(provider)/home');
        } else if (userType === 'seller') {
          router.replace('/(app)/(seller)/products');
        } else if (userType === 'admin') {
          router.replace('/(app)/(admin)/dashboard');
        } else {
          router.replace('/(app)/(customer)/home');
        }
      } else if (event === 'SIGNED_OUT') {
        // Navigate to auth flow after sign out
        router.replace('/(auth)/login');
      }
    });

    // Also check current user state for initial navigation
    if (user) {
      const userType = user?.user_metadata?.user_type || 'customer';
      
      // Check if we're in the auth group and should redirect
      const inAuthGroup = segments[0] === '(auth)';
      if (inAuthGroup) {
        // Navigate based on user type
        if (userType === 'customer') {
          router.replace('/(app)/(customer)/home');
        } else if (userType === 'provider') {
          router.replace('/(app)/(provider)/home');
        } else if (userType === 'seller') {
          router.replace('/(app)/(seller)/products');
        } else if (userType === 'admin') {
          router.replace('/(app)/(admin)/dashboard');
        } else {
          router.replace('/(app)/(customer)/home');
        }
      }
    } else {
      // If no user and not in auth group, redirect to login
      const inAuthGroup = segments[0] === '(auth)';
      if (!inAuthGroup) {
        router.replace('/(auth)/login');
      }
    }

    return () => {
      if (data && data.subscription) {
        data.subscription.unsubscribe();
      }
    };
  }, [router, segments, user]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

// Root layout component
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    // Configure notifications
    NotificationService.configurePushNotifications();
    
    // Hide splash screen
    SplashScreen.hideAsync().catch((e) => {
      console.warn('Error hiding splash screen:', e);
    });
  }, []);

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SafeAreaProvider>
          <AuthProvider>
            <StatusBar style="auto" />
            <InnerLayout />
          </AuthProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  errorButton: {
    backgroundColor: '#1E1E1E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  errorButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
