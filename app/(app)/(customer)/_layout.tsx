import { Drawer } from 'expo-router/drawer';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../../src/constants/colors';

const getDrawerIcon = (name, focused) => {
  let iconName;
  
  switch (name) {
    case 'about':
      iconName = 'information-circle';
      break;
    case 'settings':
      iconName = 'settings';
      break;
    case 'support':
      iconName = 'help-circle';
      break;
    case 'privacy':
      iconName = 'lock-closed';
      break;
    case 'payment-methods':
      iconName = 'card';
      break;
    case 'notifications':
      iconName = 'notifications';
      break;
    default:
      iconName = 'help-circle-outline';
  }
  
  return <Ionicons name={iconName + (focused ? '' : '-outline')} size={24} color={focused ? COLORS.primary : '#666'} />;
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
      <Drawer.Screen name="about" options={{ title: 'About Us' }} />
      <Drawer.Screen name="settings" options={{ title: 'Settings' }} />
      <Drawer.Screen name="support" options={{ title: 'Help & Support' }} />
      <Drawer.Screen name="privacy" options={{ title: 'Privacy & Security' }} />
      <Drawer.Screen name="payment-methods" options={{ title: 'Payment Methods' }} />
      <Drawer.Screen name="notifications" options={{ title: 'Notifications' }} />
    </Drawer>
  );
}