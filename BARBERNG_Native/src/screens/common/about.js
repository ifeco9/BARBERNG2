import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AboutScreen = () => {
  const navigation = useNavigation();
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#006400" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About BARBERNG</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.logoContainer}>
          <Image 
            source={require('../../../assets/images/logo.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.title}>Welcome to BARBERNG</Text>
        
        <Text style={styles.sectionTitle}>Our Mission</Text>
        <Text style={styles.paragraph}>
          At BARBERNG, we're dedicated to connecting customers with the best barbers and stylists in their area. 
          Our platform makes it easy to discover, book, and pay for haircuts and styling services, all from the 
          convenience of your mobile device.
        </Text>
        
        <Text style={styles.sectionTitle}>Our Story</Text>
        <Text style={styles.paragraph}>
          Founded in 2023, BARBERNG was created to solve the common frustrations of finding and booking quality 
          barber services. We've built a platform that benefits both customers seeking great haircuts and barbers 
          looking to grow their business.
        </Text>
        
        <Text style={styles.sectionTitle}>Features</Text>
        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <Ionicons name="search" size={24} color="#006400" />
            <Text style={styles.featureText}>Discover top-rated barbers near you</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="calendar" size={24} color="#006400" />
            <Text style={styles.featureText}>Easy appointment booking</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="card" size={24} color="#006400" />
            <Text style={styles.featureText}>Secure in-app payments</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="star" size={24} color="#006400" />
            <Text style={styles.featureText}>Ratings and reviews</Text>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="notifications" size={24} color="#006400" />
            <Text style={styles.featureText}>Appointment reminders</Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          We'd love to hear from you! Reach out to our support team at support@barberng.com or through the 
          in-app support feature.
        </Text>
        
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#006400',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logo: {
    width: 150,
    height: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#006400',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#006400',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
    color: '#333333',
  },
  featureList: {
    marginTop: 8,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 12,
    color: '#333333',
  },
  versionContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    color: '#888888',
  },
});

export default AboutScreen;