// Create a reusable loading component
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useThemeColor } from '../hooks/useThemeColor';

const LoadingOverlay = ({ visible, message = 'Loading...' }) => {
  const backgroundColor = useThemeColor({ light: 'rgba(255, 255, 255, 0.8)', dark: 'rgba(0, 0, 0, 0.8)' });
  const textColor = useThemeColor({ light: '#000', dark: '#fff' });
  const accentColor = useThemeColor({ light: '#1E1E1E', dark: '#F5F5F5' });
  
  if (!visible) return null;
  
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={accentColor} />
        <Text style={[styles.message, { color: textColor }]}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default LoadingOverlay;