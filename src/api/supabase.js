import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import 'react-native-url-polyfill/auto';

const supabaseUrl = 'https://omewyenxfjqstqresmnm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tZXd5ZW54Zmpxc3RxcmVzbW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MzYyMjgsImV4cCI6MjA2NTIxMjIyOH0.ZhbvZO9CnQrD1r_irpXZFZ2VPMSJJIQmWo5r4W-DyQg';

// Check if we're in a browser/native environment
const isBrowser = typeof window !== 'undefined' && window.localStorage;
const isReactNative = typeof global !== 'undefined' && global.localStorage === undefined;

// Create a custom storage adapter that works in all environments
const customStorageAdapter = {
  async getItem(key) {
    try {
      // For server-side rendering, return null
      if (!isBrowser && !isReactNative) {
        return null;
      }
      // Check if the native module has the method
      if (SecureStore && typeof SecureStore.getValueWithKeyAsync === 'function') {
        return await SecureStore.getValueWithKeyAsync(key);
      }
      
      // Fallback for browser environments
      if (isBrowser && AsyncStorage && typeof AsyncStorage.getItem === 'function') {
        return await AsyncStorage.getItem(key);
      }
      
      return null;
    } catch (error) {
      console.warn('Storage getItem error:', error);
      return null;
    }
  },
  async setItem(key, value) {
    try {
      // For server-side rendering, do nothing
      if (!isBrowser && !isReactNative) {
        return;
      }
      
      // Check if the native module has the method
      if (SecureStore && typeof SecureStore.setValueWithKeyAsync === 'function') {
        await SecureStore.setValueWithKeyAsync(value, key);
        return;
      }
      
      // Fallback for browser environments
      if (isBrowser && AsyncStorage && typeof AsyncStorage.setItem === 'function') {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('Storage setItem error:', error);
    }
  },
  async removeItem(key) {
    try {
      // For server-side rendering, do nothing
      if (!isBrowser && !isReactNative) {
        return;
      }
      
      // Check if the native module has the method
      if (SecureStore && typeof SecureStore.deleteValueWithKeyAsync === 'function') {
        await SecureStore.deleteValueWithKeyAsync(key);
        return;
      }
      
      // Fallback for browser environments
      if (isBrowser && AsyncStorage && typeof AsyncStorage.removeItem === 'function') {
        await AsyncStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('Storage removeItem error:', error);
    }
  }
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: customStorageAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});