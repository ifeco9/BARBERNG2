import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { useAuth } from '../../../src/contexts/AuthContext';
import { supabase } from '../../../src/api/supabase';
import { PaymentService } from '../../../src/services/PaymentService';

const BookServiceScreen = () => {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const providerId = params.providerId;
  const providerName = params.providerName;
  
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1); // 1: Select Service, 2: Select Date, 3: Select Time, 4: Confirm
  
  useEffect(() => {
    // In a real app, fetch services from the API
    fetchServices();
  }, []);
  
  const fetchServices = async () => {
    try {
      // For prototype, using dummy data
      // In production, use: const { data, error } = await supabase.from('services').select('*').eq('provider_id', providerId);
      const dummyServices = [
        {
          id: '1',
          name: 'Haircut',
          description: 'Standard haircut with scissors or clippers',
          duration: 30,
          price: 2500,
        },
        {
          id: '2',
          name: 'Beard Trim',
          description: 'Beard shaping and trimming',
          duration: 15,
          price: 1500,
        },
        {
          id: '3',
          name: 'Full Service',
          description: 'Haircut, beard trim, and facial treatment',
          duration: 60,
          price: 4000,
        },
      ];
      
      setServices(dummyServices);
    } catch (error) {
      Alert.alert('Error', 'Failed to load services');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchAvailableSlots = (date) => {
    // In a real app, fetch available slots from the API based on provider's schedule
    // For prototype, using dummy data
    const dummySlots = [
      { id: '1', time: '09:00 AM' },
      { id: '2', time: '10:00 AM' },
      { id: '3', time: '11:00 AM' },
      { id: '4', time: '01:00 PM' },
      { id: '5', time: '02:00 PM' },
      { id: '6', time: '03:00 PM' },
    ];
    
    setAvailableSlots(dummySlots);
  };
  
  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
  };
  
  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    fetchAvailableSlots(day.dateString);
    setStep(3);
  };
  
  const handleTimeSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(4);
  };
  
  const handleConfirmBooking = () => {
    // Show payment options
    PaymentService.showPaymentOptions(
      selectedService.price / 100, // Convert to naira
      user.email,
      (result) => {
        // On successful payment
        createBooking(result.reference);
      },
      (error) => {
        Alert.alert('Payment Failed', error.message);
      }
    );
  };
  
  const createBooking = async (paymentReference) => {
    try {
      setLoading(true);
      
      // In a real app, create booking in the database
      // const { data, error } = await supabase.from('bookings').insert({
      //   customer_id: user.id,
      //   service_id: selectedService.id,
      //   provider_id: providerId,
      //   booking_date: selectedDate,
      //   booking_time: selectedSlot.time,
      //   status: 'pending',
      //   payment_status: 'completed',
      //   payment_reference: paymentReference
      // });
      
      // if (error) throw error;
      
      Alert.alert(
        'Booking Successful',
        'Your booking has been confirmed!',
        [{ text: 'OK', onPress: () => router.navigate('/(app)/(customer)/booking') }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderServiceItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.serviceCard, selectedService?.id === item.id && styles.selectedCard]}
      onPress={() => handleServiceSelect(item)}
    >
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      <View style={styles.serviceDetails}>
        <Text style={styles.serviceDuration}>⏱️ {item.duration} min</Text>
        <Text style={styles.servicePrice}>₦{(item.price / 100).toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
  
  const renderTimeSlot = ({ item }) => (
    <TouchableOpacity 
      style={[styles.timeSlot, selectedSlot?.id === item.id && styles.selectedTimeSlot]}
      onPress={() => handleTimeSelect(item)}
    >
      <Text style={[styles.timeText, selectedSlot?.id === item.id && styles.selectedTimeText]}>
        {item.time}
      </Text>
    </TouchableOpacity>
  );
  
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Book Appointment</Text>
        <Text style={styles.providerName}>at {providerName}</Text>
      </View>
      
      <View style={styles.stepIndicator}>
        <View style={[styles.stepDot, step >= 1 && styles.activeStepDot]} />
        <View style={styles.stepLine} />
        <View style={[styles.stepDot, step >= 2 && styles.activeStepDot]} />
        <View style={styles.stepLine} />
        <View style={[styles.stepDot, step >= 3 && styles.activeStepDot]} />
        <View style={styles.stepLine} />
        <View style={[styles.stepDot, step >= 4 && styles.activeStepDot]} />
      </View>
      
      <ScrollView style={styles.content}>
        {step === 1 && (
          <View>
            <Text style={styles.stepTitle}>Select Service</Text>
            <FlatList
              data={services}
              renderItem={renderServiceItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.servicesList}
            />
          </View>
        )}
        
        {step === 2 && (
          <View>
            <Text style={styles.stepTitle}>Select Date</Text>
            <Calendar
              onDayPress={handleDateSelect}
              markedDates={selectedDate ? {[selectedDate]: {selected: true, selectedColor: '#0066CC'}} : {}}
              minDate={new Date().toISOString().split('T')[0]}
              theme={{
                selectedDayBackgroundColor: '#0066CC',
                todayTextColor: '#0066CC',
                arrowColor: '#0066CC',
              }}
            />
          </View>
        )}
        
        {step === 3 && (
          <View>
            <Text style={styles.stepTitle}>Select Time</Text>
            <Text style={styles.dateText}>Date: {selectedDate}</Text>
            <FlatList
              data={availableSlots}
              renderItem={renderTimeSlot}
              keyExtractor={item => item.id}
              numColumns={3}
              contentContainerStyle={styles.timeSlotsList}
            />
          </View>
        )}
        
        {step === 4 && (
          <View style={styles.confirmationContainer}>
            <Text style={styles.stepTitle}>Confirm Booking</Text>
            <View style={styles.confirmationCard}>
              <Text style={styles.confirmLabel}>Service:</Text>
              <Text style={styles.confirmValue}>{selectedService.name}</Text>
              
              <Text style={styles.confirmLabel}>Date:</Text>
              <Text style={styles.confirmValue}>{selectedDate}</Text>
              
              <Text style={styles.confirmLabel}>Time:</Text>
              <Text style={styles.confirmValue}>{selectedSlot.time}</Text>
              
              <Text style={styles.confirmLabel}>Price:</Text>
              <Text style={styles.confirmValue}>₦{(selectedService.price / 100).toFixed(2)}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.confirmButton}
              onPress={handleConfirmBooking}
            >
              <Text style={styles.confirmButtonText}>Confirm & Pay</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      
      {step > 1 && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setStep(step - 1)}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  providerName: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    paddingHorizontal: 40,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ddd',
  },
  activeStepDot: {
    backgroundColor: '#0066CC',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  servicesList: {
    paddingBottom: 20,
  },
  serviceCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCard: {
    borderColor: '#0066CC',
    backgroundColor: '#e6f2ff',
  },
  serviceName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 10,
  },
  serviceDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  timeSlotsList: {
    paddingBottom: 20,
  },
  timeSlot: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    margin: 5,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedTimeSlot: {
    borderColor: '#0066CC',
    backgroundColor: '#0066CC',
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTimeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  confirmationContainer: {
    paddingBottom: 40,
  },
  confirmationCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  confirmLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  confirmValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: '#0066CC',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default BookServiceScreen;