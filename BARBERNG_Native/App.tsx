import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';

// Auth Screens
import LoginScreen from './src/screens/auth/login';
import PhoneVerificationScreen from './src/screens/auth/phone-verification';
import RegisterScreen from './src/screens/auth/register';

// Customer Screens
import CustomerBookingsScreen from './src/screens/customer/tabs/booking';
import CustomerDiscoverScreen from './src/screens/customer/tabs/discover';
import CustomerHomeScreen from './src/screens/customer/tabs/home';
import CustomerProfileScreen from './src/screens/customer/tabs/profile';

// Common Screens
import AboutScreen from './src/screens/common/about';
import NotificationsScreen from './src/screens/common/notifications';
import SettingsScreen from './src/screens/common/settings';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab bar icon function
const getTabBarIcon = (routeName: string, focused: boolean) => {
  let iconName = '';
  
  switch (routeName) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Bookings':
      iconName = focused ? 'calendar' : 'calendar-outline';
      break;
    case 'Discover':
      iconName = focused ? 'search' : 'search-outline';
      break;
    case 'Profile':
      iconName = focused ? 'person' : 'person-outline';
      break;
    default:
      iconName = 'help-circle-outline';
  }
  
  return <Ionicons name={iconName} size={24} color={focused ? '#000' : '#666'} />;
};

// Common tab navigator options
const tabNavigatorOptions = {
  headerShown: false,
  tabBarStyle: {
    elevation: 0,
    shadowOpacity: 0,
    height: 60,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  tabBarActiveTintColor: '#000',
  tabBarInactiveTintColor: '#666',
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '500' as const, // Type assertion for fontWeight
  },
};

// Auth Navigator
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
  </Stack.Navigator>
);

// Customer Tab Navigator
const CustomerTabNavigator = () => (
  <Tab.Navigator 
    screenOptions={({ route }) => ({
      ...tabNavigatorOptions,
      tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),
    } as const)}
  >
    <Tab.Screen name="Home" component={CustomerHomeScreen} />
    <Tab.Screen name="Bookings" component={CustomerBookingsScreen} />
    <Tab.Screen name="Discover" component={CustomerDiscoverScreen} />
    <Tab.Screen name="Profile" component={CustomerProfileScreen} />
  </Tab.Navigator>
);

// Root Navigator
const RootNavigator = () => {
  const { user, loading } = useAuth();
  const userType = user?.user_metadata?.user_type || 'customer';

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          {userType === 'customer' && (
            <Stack.Screen name="CustomerTabs" component={CustomerTabNavigator} />
          )}
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // Hide the splash screen when your app is ready
    SplashScreen.hide();
  }, []);

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
});

export default App;
