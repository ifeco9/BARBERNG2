import Ionicons from 'react-native-vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import React, { JSX } from 'react';
import { COLORS } from '../../../../src/constants/colors';

// Define a type for the icon names to satisfy TypeScript
type IconName = React.ComponentProps<typeof Ionicons>['name'];

const getTabBarIcon = (name: string, focused: boolean): JSX.Element => {
  let iconName: IconName;
  
  switch (name) {
    case 'home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'discover':
      iconName = focused ? 'compass' : 'compass-outline';
      break;
    case 'booking':
      iconName = focused ? 'calendar' : 'calendar-outline';
      break;
    case 'profile':
      iconName = focused ? 'person' : 'person-outline';
      break;
    default:
      iconName = focused ? 'help-circle' : 'help-circle-outline';
  }
  
  return <Ionicons name={iconName} size={24} color={focused ? COLORS.primary : '#666'} />;
};

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="discover" options={{ title: 'Discover' }} />
      <Tabs.Screen name="booking" options={{ title: 'Bookings' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}