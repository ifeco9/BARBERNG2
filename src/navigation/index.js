import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import { HapticTab } from '../components/HapticTab';

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PhoneVerificationScreen from '../screens/auth/PhoneVerificationScreen';

// Customer Screens
import CustomerHomeScreen from '../screens/customer/HomeScreen';
import CustomerProfileScreen from '../screens/customer/ProfileScreen';
import CustomerBookingsScreen from '../screens/customer/BookingsScreen';
import CustomerShopScreen from '../screens/customer/ShopScreen';

// Provider Screens
import ProviderHomeScreen from '../screens/provider/HomeScreen';
import ProviderProfileScreen from '../screens/provider/ProfileScreen';
import ProviderBookingsScreen from '../screens/provider/BookingsScreen';
import ProviderServicesScreen from '../screens/provider/ServicesScreen';

// Seller Screens
import SellerHomeScreen from '../screens/seller/HomeScreen';
import SellerProfileScreen from '../screens/seller/ProfileScreen';
import SellerProductsScreen from '../screens/seller/ProductsScreen';
import SellerOrdersScreen from '../screens/seller/OrdersScreen';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/DashboardScreen';
import AdminUsersScreen from '../screens/admin/UsersScreen';

// Common Screens
import NotificationsScreen from '../screens/common/NotificationsScreen';
import SettingsScreen from '../screens/common/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab bar icon function
const getTabBarIcon = (routeName, focused) => {
  let iconName;
  
  switch (routeName) {
    case 'Home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'Bookings':
      iconName = focused ? 'calendar' : 'calendar-outline';
      break;
    case 'Shop':
      iconName = focused ? 'cart' : 'cart-outline';
      break;
    case 'Profile':
      iconName = focused ? 'person' : 'person-outline';
      break;
    case 'Services':
      iconName = focused ? 'cut' : 'cut-outline';
      break;
    case 'Products':
      iconName = focused ? 'pricetag' : 'pricetag-outline';
      break;
    case 'Orders':
      iconName = focused ? 'list' : 'list-outline';
      break;
    case 'Dashboard':
      iconName = focused ? 'stats-chart' : 'stats-chart-outline';
      break;
    case 'Users':
      iconName = focused ? 'people' : 'people-outline';
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
  tabBarButton: (props) => <HapticTab {...props} />,
  tabBarActiveTintColor: '#000',
  tabBarInactiveTintColor: '#666',
  tabBarLabelStyle: {
    fontSize: 12,
    fontWeight: '500',
  },
};

// Stack navigator screen options with animations
const stackScreenOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  gestureEnabled: true,
  gestureDirection: 'horizontal',
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};

// Auth Navigator
const AuthNavigator = () => (
  <Stack.Navigator screenOptions={stackScreenOptions}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen name="PhoneVerification" component={PhoneVerificationScreen} />
  </Stack.Navigator>
);

// Customer Tab Navigator
const CustomerTabNavigator = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    ...tabNavigatorOptions,
    tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),
  })}>
    <Tab.Screen name="Home" component={CustomerHomeScreen} />
    <Tab.Screen name="Bookings" component={CustomerBookingsScreen} />
    <Tab.Screen name="Shop" component={CustomerShopScreen} />
    <Tab.Screen name="Profile" component={CustomerProfileScreen} />
  </Tab.Navigator>
);

// Provider Tab Navigator
const ProviderTabNavigator = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    ...tabNavigatorOptions,
    tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),
  })}>
    <Tab.Screen name="Home" component={ProviderHomeScreen} />
    <Tab.Screen name="Bookings" component={ProviderBookingsScreen} />
    <Tab.Screen name="Services" component={ProviderServicesScreen} />
    <Tab.Screen name="Profile" component={ProviderProfileScreen} />
  </Tab.Navigator>
);

// Seller Tab Navigator
const SellerTabNavigator = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    ...tabNavigatorOptions,
    tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),
  })}>
    <Tab.Screen name="Home" component={SellerHomeScreen} />
    <Tab.Screen name="Products" component={SellerProductsScreen} />
    <Tab.Screen name="Orders" component={SellerOrdersScreen} />
    <Tab.Screen name="Profile" component={SellerProfileScreen} />
  </Tab.Navigator>
);

// Admin Tab Navigator
const AdminTabNavigator = () => (
  <Tab.Navigator screenOptions={({ route }) => ({
    ...tabNavigatorOptions,
    tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),
  })}>
    <Tab.Screen name="Dashboard" component={AdminDashboardScreen} />
    <Tab.Screen name="Users" component={AdminUsersScreen} />
    <Tab.Screen name="Profile" component={ProviderProfileScreen} />
  </Tab.Navigator>
);

// Root Navigator
const RootNavigator = () => {
  const { user, loading } = useAuth();
  const userType = user?.user_metadata?.user_type || 'customer';

  if (loading) {
    // Return a loading screen
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={stackScreenOptions}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          {userType === 'customer' && (
            <Stack.Screen name="CustomerTabs" component={CustomerTabNavigator} />
          )}
          {userType === 'provider' && (
            <Stack.Screen name="ProviderTabs" component={ProviderTabNavigator} />
          )}
          {userType === 'seller' && (
            <Stack.Screen name="SellerTabs" component={SellerTabNavigator} />
          )}
          {userType === 'admin' && (
            <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />
          )}
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF'
  },
});

export default AppNavigator;