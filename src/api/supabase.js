import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = 'https://omewyenxfjqstqresmnm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tZXd5ZW54Zmpxc3RxcmVzbW5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk2MzYyMjgsImV4cCI6MjA2NTIxMjIyOH0.ZhbvZO9CnQrD1r_irpXZFZ2VPMSJJIQmWo5r4W-DyQg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});