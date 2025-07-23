import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function PlaceholderScreen() {
  const navigation = useNavigation();
  const params = useLocalSearchParams();
  const screenName = params.screen || 'This Screen';
  
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen 
        options={{
          title: screenName,
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
              <Ionicons name="menu-outline" size={24} color="#006400" />
            </TouchableOpacity>
          ),
        }} 
      />
      <View style={styles.content}>
        <Ionicons name="construct-outline" size={80} color="#006400" style={styles.icon} />
        <Text style={styles.title}>{screenName}</Text>
        <Text style={styles.message}>This screen is under construction</Text>
        <Text style={styles.description}>We're working hard to bring you this feature soon!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  menuButton: {
    marginLeft: 15,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  icon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  message: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#777',
  },
});