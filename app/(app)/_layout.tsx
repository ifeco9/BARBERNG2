import { Redirect, Stack } from 'expo-router';
import { useAuth } from '../../src/contexts/AuthContext';

export default function AppLayout() {
  const { user, loading } = useAuth();
  const userType = user?.user_metadata?.user_type || 'customer';
  
  if (loading) return null;
  
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }
  
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}