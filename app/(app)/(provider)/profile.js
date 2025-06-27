import { Link } from 'expo-router';
import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/contexts/AuthContext';

const ProfileScreen = () => { // Removed navigation prop
  const { user, signOut } = useAuth();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation is handled by the AuthContext
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  // Consolidated menuItems array using Link approach
  const menuItems = [
    { 
      icon: '👤', 
      title: 'Edit Profile', 
      onPress: () => Alert.alert('Coming Soon', 'This feature is under development'),
      path: null
    },
    { 
      icon: '💇', 
      title: 'My Services', 
      path: '/(app)/(provider)/services' 
    },
    { 
      icon: '🔔', 
      title: 'Notifications', 
      path: '/(app)/(common)/notifications' 
    },
    { 
      icon: '💳', 
      title: 'Payment Settings', 
      onPress: () => Alert.alert('Coming Soon', 'This feature is under development'),
      path: null
    },
    { 
      icon: '📊', 
      title: 'Business Analytics', 
      onPress: () => Alert.alert('Coming Soon', 'This feature is under development'),
      path: null
    },
    { 
      icon: '⚙️', 
      title: 'Settings', 
      path: '/(app)/(common)/settings' 
    },
    { 
      icon: '❓', 
      title: 'Help & Support', 
      onPress: () => Alert.alert('Coming Soon', 'This feature is under development'),
      path: null
    },
  ];

  const renderMenuItem = (item, index) => {
    if (item.path) {
      return (
        <Link key={index} href={item.path} asChild>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text style={styles.menuTitle}>{item.title}</Text>
          </TouchableOpacity>
        </Link>
      );
    } else {
      return (
        <TouchableOpacity 
          key={index} 
          style={styles.menuItem}
          onPress={item.onPress}
        >
          <Text style={styles.menuIcon}>{item.icon}</Text>
          <Text style={styles.menuTitle}>{item.title}</Text>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Image 
            source={{ uri: 'https://randomuser.me/api/portraits/men/45.jpg' }} 
            style={styles.profileImage} 
          />
          <Text style={styles.name}>{user?.user_metadata?.first_name || 'Provider'} {user?.user_metadata?.last_name || ''}</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          {/* Stats section remains unchanged */}
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => renderMenuItem(item, index))}
        </View>

        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4A55A2',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  email: {
    fontSize: 16,
    color: '#e0e0e0',
    marginTop: 5,
  },
  editButton: {
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    padding: 15,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A55A2',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuTitle: {
    fontSize: 16,
    color: '#333',
  },
  signOutButton: {
    margin: 15,
    marginTop: 5,
    padding: 15,
    backgroundColor: '#f8d7da',
    borderRadius: 10,
    alignItems: 'center',
  },
  signOutText: {
    color: '#dc3545',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ProfileScreen;