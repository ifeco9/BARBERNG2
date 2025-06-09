import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

const SettingsScreen = ({ navigation }) => {
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

  const renderSettingItem = (title, key, description) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      <Switch
        value={settings[key]}
        onValueChange={() => toggleSetting(key)}
        trackColor={{ false: '#d1d1d1', true: '#81b0ff' }}
        thumbColor={settings[key] ? '#2196F3' : '#f4f3f4'}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          >
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          >
            <Text style={styles.menuItemText}>Change Password</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          >
            <Text style={styles.menuItemText}>Privacy Settings</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.section}>
          {renderSettingItem('Push Notifications', 'pushNotifications', 'Receive push notifications for bookings and offers')}
          {renderSettingItem('Email Notifications', 'emailNotifications', 'Receive email updates and newsletters')}
        </View>

        <Text style={styles.sectionTitle}>App Settings</Text>
        <View style={styles.section}>
          {renderSettingItem('Dark Mode', 'darkMode', 'Enable dark theme for the app')}
          {renderSettingItem('Location Services', 'locationServices', 'Allow app to access your location')}
          {renderSettingItem('Reduce Data Usage', 'dataUsage', 'Lower image quality to save data')}
        </View>

        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          >
            <Text style={styles.menuItemText}>Help Center</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          >
            <Text style={styles.menuItemText}>Contact Us</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          >
            <Text style={styles.menuItemText}>Terms of Service</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
          >
            <Text style={styles.menuItemText}>Privacy Policy</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 20,
    marginBottom: 8,
    marginLeft: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  menuItemArrow: {
    fontSize: 20,
    color: '#999',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
  },
  settingDescription: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  signOutButton: {
    marginTop: 30,
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#ff6b6b',
    borderRadius: 8,
    alignItems: 'center',
  },
  signOutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 30,
    color: '#999',
    fontSize: 12,
  },
});

export default SettingsScreen;