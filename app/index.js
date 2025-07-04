import { Redirect } from 'expo-router';
import { useAuth } from '../src/contexts/AuthContext';

export default function Index() {
  const { user } = useAuth();
  
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }
  
  const userType = user?.user_metadata?.user_type || 'customer';
  
  switch (userType) {
    case 'customer':
      return <Redirect href="/(app)/(customer)" />; // Changed from /(app)/(customer)/home
    case 'provider':
      return <Redirect href="/(app)/(provider)/home" />;
    case 'seller':
      return <Redirect href="/(app)/(seller)/home" />;
    case 'admin':
      return <Redirect href="/(app)/(admin)/dashboard" />;
    default:
      return <Redirect href="/(auth)/login" />;
  }
}