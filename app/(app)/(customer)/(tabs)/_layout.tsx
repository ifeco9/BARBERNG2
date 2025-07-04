import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../../src/constants/colors';

const getTabBarIcon = (name, focused) => {
  let iconName;
  
  switch (name) {
    case 'home':
      iconName = 'home';
      break;
    case 'discover':
      iconName = 'compass';
      break;
    case 'booking':
      iconName = 'calendar';
      break;
    case 'profile':
      iconName = 'person';
      break;
    default:
      iconName = 'help-circle';
  }
  
  return <Ionicons name={iconName + (focused ? '' : '-outline')} size={24} color={focused ? COLORS.primary : '#666'} />;
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