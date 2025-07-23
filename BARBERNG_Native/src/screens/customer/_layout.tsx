import Ionicons from 'react-native-vector-icons/Ionicons';
import { Drawer } from 'expo-router/drawer';
import React, { JSX } from 'react';
import { COLORS } from '../../../src/constants/colors';

// Define a type for the icon names to satisfy TypeScript
type IconName = React.ComponentProps<typeof Ionicons>['name'];

const getDrawerIcon = (name: string, focused: boolean): JSX.Element => {
  let iconName: IconName;
  
  switch (name) {
    case 'about':
      iconName = focused ? 'information-circle' : 'information-circle-outline';
      break;
    case 'settings':
      iconName = focused ? 'settings' : 'settings-outline';
      break;
    case 'support':
      iconName = focused ? 'help-circle' : 'help-circle-outline';
      break;
    case 'privacy':
      iconName = focused ? 'lock-closed' : 'lock-closed-outline';
      break;
    case 'payment-methods':
      iconName = focused ? 'card' : 'card-outline';
      break;
    case 'notifications':
      iconName = focused ? 'notifications' : 'notifications-outline';
      break;
    default:
      iconName = focused ? 'help-circle' : 'help-circle-outline';
  }
  
  return <Ionicons name={iconName} size={24} color={focused ? COLORS.primary : '#666'} />;
};

export default function CustomerLayout() {
  return (
    <Drawer
      screenOptions={({ route }) => ({
        headerShown: false,
        drawerActiveTintColor: COLORS.primary,
        drawerInactiveTintColor: '#666',
        drawerLabelStyle: {
          fontSize: 14,
          fontWeight: '500',
        },
        drawerIcon: ({ focused }) => getDrawerIcon(route.name, focused),
      })}
    >
      <Drawer.Screen name="(tabs)" options={{ headerShown: false, title: 'Home' }} />
      <Drawer.Screen 
        name="about" 
        options={{ title: 'About Us' }}
        initialParams={{ screen: 'About Us' }} 
      />
      <Drawer.Screen 
        name="settings" 
        options={{ title: 'Settings' }}
        initialParams={{ screen: 'Settings' }} 
      />
      <Drawer.Screen 
        name="support" 
        options={{ title: 'Help & Support' }}
        initialParams={{ screen: 'Help & Support' }} 
      />
      <Drawer.Screen 
        name="privacy" 
        options={{ title: 'Privacy & Security' }}
        initialParams={{ screen: 'Privacy & Security' }} 
      />
      <Drawer.Screen 
        name="payment-methods" 
        options={{ title: 'Payment Methods' }}
        initialParams={{ screen: 'Payment Methods' }} 
      />
      <Drawer.Screen 
        name="notifications" 
        options={{ title: 'Notifications' }}
        initialParams={{ screen: 'Notifications' }} 
      />
    </Drawer>
  );
}