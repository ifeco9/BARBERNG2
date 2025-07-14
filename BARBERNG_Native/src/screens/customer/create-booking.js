import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../src/contexts/AuthContext';
import { PaymentService } from '../../../src/services/PaymentService';
import { supabase } from '../../../src/api/supabase';

const CreateBookingScreen = () => {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const providerId = params.providerId;
  const providerName = params.providerName;
  
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Generate dates for the next 7 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  const dates = generateDates();

  // Generate time slots from 9 AM to 5 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour}:00`);
      if (hour < 17) slots.push(`${hour}:30`);
    }
    return slots;
  };

  useEffect(() => {
    // In a real app, fetch services from the provider
    const fetchServices = async () => {
      try {
        // For this prototype, we'll use dummy data
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching services:', error);
        Alert.alert('Error', 'Failed to load services');
        setLoading(false);
      }
    };
    
    fetchServices();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      // In a real app, fetch available slots for the selected date
      // For this prototype, we'll use dummy data
      setAvailableSlots(generateTimeSlots());
    }
  }, [selectedDate]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
  };

  const formatDate = (date) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      day: days[date.getDay()],
      date: date.getDate(),
      month: months[date.getMonth()],
    };
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) {
      Alert.alert('Incomplete Booking', 'Please select a service, date, and time slot');
      return;
    }
    
    setSubmitting(true);
    
    try {
      // Format the booking date and time
      const bookingDate = selectedDate.toISOString().split('T')[0];
      const bookingTime = selectedSlot;
      
      // In a real app, you would create the booking in your database
      // For this prototype, we'll simulate a successful booking
      
      // Show payment options
      PaymentService.showPaymentOptions(
        selectedService.price / 100, // Convert to Naira
        user.email,
        async (paymentResult) => {
          // Payment successful
          // Create booking record
          const { data, error } = await supabase
            .from('bookings')
            .insert([
              {
                customer_id: user.id,
                service_id: selectedService.id,
                provider_id: providerId,
                booking_date: bookingDate,
                booking_time: bookingTime,
                status: 'pending',
                payment_status: 'completed',
              },
            ]);
            
          if (error) throw error;
          
          Alert.alert(
            'Booking Successful',
            `Your booking for ${selectedService.name} on ${bookingDate} at ${bookingTime} has been confirmed.`,
            [{ text: 'OK', onPress: () => router.navigate('/(app)/(customer)/booking') }]
          );
        },
        (error) => {
          // Payment failed
          Alert.alert('Payment Failed', error.message || 'Failed to process payment');
        }
      );
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Booking Failed', error.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Loading services...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Book an Appointment</Text>
          <Text style={styles.providerName}>{providerName}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select a Service</Text>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              style={[styles.serviceCard, selectedService?.id === service.id && styles.selectedCard]}
              onPress={() => handleServiceSelect(service)}
            >
              <View style={styles.serviceInfo}>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceDescription}>{service.description}</Text>
                <Text style={styles.serviceDuration}>{service.duration} min</Text>
              </View>
              <Text style={styles.servicePrice}>₦{(service.price / 100).toFixed(2)}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {selectedService && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select a Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
              {dates.map((date, index) => {
                const formattedDate = formatDate(date);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateCard,
                      selectedDate && selectedDate.toDateString() === date.toDateString() && styles.selectedDateCard,
                    ]}
                    onPress={() => handleDateSelect(date)}
                  >
                    <Text style={styles.dayText}>{formattedDate.day}</Text>
                    <Text style={styles.dateText}>{formattedDate.date}</Text>
                    <Text style={styles.monthText}>{formattedDate.month}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
        
        {selectedDate && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select a Time Slot</Text>
            <View style={styles.slotsContainer}>
              {availableSlots.map((slot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.slotCard,
                    selectedSlot === slot && styles.selectedSlotCard,
                  ]}
                  onPress={() => handleSlotSelect(slot)}
                >
                  <Text style={[styles.slotText, selectedSlot === slot && styles.selectedSlotText]}>
                    {slot}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        
        {selectedService && selectedDate && selectedSlot && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Service:</Text>
              <Text style={styles.summaryValue}>{selectedService.name}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Date:</Text>
              <Text style={styles.summaryValue}>
                {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Time:</Text>
              <Text style={styles.summaryValue}>{selectedSlot}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Price:</Text>
              <Text style={styles.summaryValue}>₦{(selectedService.price / 100).toFixed(2)}</Text>
            </View>
          </View>
        )}
        
        <TouchableOpacity
          style={[
            styles.bookButton,
            (!selectedService || !selectedDate || !selectedSlot) && styles.disabledButton,
          ]}
          onPress={handleBooking}
          disabled={!selectedService || !selectedDate || !selectedSlot || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.bookButtonText}>Confirm Booking</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: '#f9f9f9',
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
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  serviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCard: {
    borderColor: '#0066CC',
    backgroundColor: '#E6F0FF',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  datesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 90,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedDateCard: {
    borderColor: '#0066CC',
    backgroundColor: '#E6F0FF',
  },
  dayText: {
    fontSize: 14,
    color: '#666',
  },
  dateText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  monthText: {
    fontSize: 14,
    color: '#666',
  },
  slotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  slotCard: {
    width: '30%',
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: '1.5%',
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedSlotCard: {
    borderColor: '#0066CC',
    backgroundColor: '#E6F0FF',
  },
  slotText: {
    fontSize: 14,
    color: '#333',
  },
  selectedSlotText: {
    color: '#0066CC',
    fontWeight: 'bold',
  },
  summarySection: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  bookButton: {
    backgroundColor: '#0066CC',
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  bookButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CreateBookingScreen;