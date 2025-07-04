import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../src/contexts/AuthContext';
import { supabase } from '../../../src/api/supabase';

// Import the ProviderReviews component
import ProviderReviews from '../../../components/ProviderReviews';

const BarberDetailsScreen = () => {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const [barber, setBarber] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, you would fetch this data from your API using the ID
    // For this prototype, we'll use dummy data
    const barberId = params.id;
    
    const dummyBarber = {
      id: barberId || '1',
      name: 'Classic Cuts Barber Shop',
      rating: 4.8,
      reviewCount: 124,
      address: '123 Main Street, Lagos',
      phone: '+234 123 456 7890',
      bio: 'We specialize in classic and modern haircuts with over 10 years of experience.',
      image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmFyYmVyc2hvcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      workingHours: {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: '10:00 AM - 4:00 PM',
        sunday: 'Closed'
      }
    };
    
    const dummyServices = [
      {
        id: '1',
        name: 'Haircut',
        description: 'Standard haircut with scissors or clippers',
        duration: '30 min',
        price: '₦2,500',
      },
      {
        id: '2',
        name: 'Beard Trim',
        description: 'Beard shaping and trimming',
        duration: '15 min',
        price: '₦1,500',
      },
      {
        id: '3',
        name: 'Full Service',
        description: 'Haircut, beard trim, and facial treatment',
        duration: '60 min',
        price: '₦4,000',
      },
    ];
    
    setBarber(dummyBarber);
    setServices(dummyServices);
    setLoading(false);
  }, [params.id]);

  const handleBookService = (service) => {
    router.navigate({
      pathname: "/(app)/(customer)/booking-form",
      params: { 
        barberId: barber.id,
        barberName: barber.name,
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
        duration: service.duration
      }
    });
  };

  if (loading || !barber) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading barber details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: barber.image }} style={styles.coverImage} />
        
        <View style={styles.detailsContainer}>
          <Text style={styles.barberName}>{barber.name}</Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>★ {barber.rating}</Text>
            <Text style={styles.reviewCount}>({barber.reviewCount} reviews)</Text>
          </View>
          
          <Text style={styles.address}>{barber.address}</Text>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.callButton]}
              onPress={() => Alert.alert('Call', `Call ${barber.phone}?`)}
            >
              <Text style={styles.actionButtonText}>Call</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.directionsButton]}
              onPress={() => Alert.alert('Directions', 'Opening maps...')}
            >
              <Text style={styles.actionButtonText}>Directions</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, styles.shareButton]}
              onPress={() => Alert.alert('Share', 'Sharing options...')}
            >
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bioText}>{barber.bio}</Text>
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Working Hours</Text>
            {Object.entries(barber.workingHours).map(([day, hours]) => (
              <View key={day} style={styles.workingHoursRow}>
                <Text style={styles.dayText}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
                <Text style={styles.hoursText}>{hours}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Services</Text>
            {services.map(service => (
              <View key={service.id} style={styles.serviceCard}>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <Text style={styles.serviceDescription}>{service.description}</Text>
                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceDuration}>{service.duration}</Text>
                    <Text style={styles.servicePrice}>{service.price}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.bookButton}
                  onPress={() => handleBookService(service)}
                >
                  <Text style={styles.bookButtonText}>Book</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      
      // Add the ProviderReviews component to your render method, inside the ScrollView
      <ScrollView style={styles.container}>
        {/* Add the reviews section */}
        <ProviderReviews providerId={providerId} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  coverImage: {
    width: '100%',
    height: 200,
  },
  detailsContainer: {
    padding: 16,
  },
  barberName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginRight: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#666',
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  callButton: {
    backgroundColor: '#4CAF50',
  },
  directionsButton: {
    backgroundColor: '#2196F3',
  },
  shareButton: {
    backgroundColor: '#9C27B0',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  workingHoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dayText: {
    fontSize: 14,
    color: '#333',
  },
  hoursText: {
    fontSize: 14,
    color: '#666',
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  serviceDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
    marginRight: 12,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bookButton: {
    backgroundColor: '#FF5722',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 24,
  },
});

export default BarberDetailsScreen;

// Add review submission functionality
const submitReview = async () => {
  if (!rating) {
    Alert.alert('Error', 'Please select a rating');
    return;
  }
  
  try {
    setSubmittingReview(true);
    
    // Check if user has a booking with this provider
    const { data: bookings, error: bookingError } = await supabase
      .from('bookings')
      .select('id')
      .eq('customer_id', user.id)
      .eq('provider_id', providerId)
      .eq('status', 'completed')
      .limit(1);
    
    if (bookingError) throw bookingError;
    
    if (!bookings || bookings.length === 0) {
      Alert.alert('Error', 'You can only review providers after completing a booking with them');
      return;
    }
    
    // Submit the review
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        provider_id: providerId,
        customer_id: user.id,
        rating: rating,
        comment: reviewText,
        booking_id: bookings[0].id
      })
      .select();
    
    if (error) throw error;
    
    // Update the UI
    setReviews([...reviews, {
      ...data[0],
      profiles: {
        first_name: user.user_metadata.first_name,
        last_name: user.user_metadata.last_name,
        profile_image: user.user_metadata.profile_image
      },
      created_at: new Date().toISOString()
    }]);
    
    // Reset form
    setRating(0);
    setReviewText('');
    setShowReviewForm(false);
    
    Alert.alert('Success', 'Your review has been submitted!');
  } catch (error) {
    console.error('Review submission error:', error);
    Alert.alert('Error', `Failed to submit review: ${error.message}`);
  } finally {
    setSubmittingReview(false);
  }
};