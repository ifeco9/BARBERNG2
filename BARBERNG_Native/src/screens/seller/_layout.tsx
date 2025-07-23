import Ionicons from 'react-native-vector-icons/Ionicons';
import { Tabs } from 'expo-router';
import { HapticTab } from '../../../components/HapticTab';

const getTabBarIcon = (name: string, focused: boolean) => {
  let iconName;
  
  switch (name) {
    case 'home':
      iconName = focused ? 'home' : 'home-outline';
      break;
    case 'products':
      iconName = focused ? 'pricetag' : 'pricetag-outline';
      break;
    case 'orders':
      iconName = focused ? 'list' : 'list-outline';
      break;
    case 'profile':
      iconName = focused ? 'person' : 'person-outline';
      break;
    default:
      iconName = 'help-circle-outline';
  }
  
  return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={24} color={focused ? '#000' : '#666'} />;
};

export default function SellerLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
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
        tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),
      })}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="products" options={{ title: 'Products' }} />
      <Tabs.Screen name="orders" options={{ title: 'Orders' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}