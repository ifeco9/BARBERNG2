import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../src/contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { user, signOut } = useAuth();
  
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    darkMode: false,
    locationServices: true,
    dataUsage: false,
  });

  const toggleSetting = (key) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      [key]: !prevSettings[key]
    }));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation is handled by the AuthContext
    } catch (error) {
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      
      {/* Rest of component JSX */}
      
      <TouchableOpacity 
        style={styles.signOutButton}
        onPress={handleSignOut}
      >
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default SettingsScreen;