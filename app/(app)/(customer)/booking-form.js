import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../src/contexts/AuthContext';
import { PaymentService } from '../../../src/services/PaymentService';
import { supabase } from '../../../src/api/supabase';

const BookingFormScreen = () => {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const isReschedule = params.isReschedule === 'true';
  
  // Generate dates for the next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    
    return dates;
  };
  
  const dates = generateDates();
  
  useEffect(() => {
    if (selectedDate) {
      fetchAvailableTimes();
    }
  }, [selectedDate]);
  
  // Update the fetchAvailableTimes function
  const fetchAvailableTimes = async () => {
    try {
      setLoading(true);
      
      // Format the selected date for the query
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // Make sure we have valid UUIDs, not just "1" or other invalid values
      const providerId = params.barberId;
      // Check if providerId is a valid UUID format
      const isValidUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(providerId);
      
      if (!isValidUUID) {
        console.error('Invalid UUID format for provider ID');
        setAvailableTimes([]);
        return;
      }
      
      // Get provider's working hours with valid UUID
      const { data: providerData, error: providerError } = await supabase
        .from('provider_profiles')
        .select('working_hours')
        .eq('id', providerId)
        .single();
      
      if (providerError) throw providerError;
      
      // Get existing bookings for this provider on the selected date
      const { data: existingBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select('booking_time, services(duration)')
        .eq('provider_id', params.barberId)
        .eq('booking_date', formattedDate)
        .not('status', 'eq', 'cancelled');
      
      if (bookingsError) throw bookingsError;
      
      // Generate available time slots based on working hours and existing bookings
      const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][selectedDate.getDay()];
      const workingHours = providerData.working_hours[dayOfWeek];
      
      if (!workingHours || workingHours === 'Closed') {
        setAvailableTimes([]);
        setLoading(false);
        return;
      }
      
      // Parse working hours (e.g., "9:00 AM - 5:00 PM")
      const [startStr, endStr] = workingHours.split(' - ');
      
      // Convert to 24-hour format for easier calculation
      const parseTimeStr = (timeStr) => {
        const [time, period] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        
        if (period === 'PM' && hours < 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        
        return { hours, minutes };
      };
      
      const startTime = parseTimeStr(startStr);
      const endTime = parseTimeStr(endStr);
      
      // Generate all possible 30-minute slots
      const slots = [];
      const slotDuration = 30; // minutes
      const serviceDuration = parseInt(params.duration) || 30;
      
      // Start time in minutes since midnight
      let currentMinutes = startTime.hours * 60 + startTime.minutes;
      const endMinutes = endTime.hours * 60 + endTime.minutes - serviceDuration;
      
      while (currentMinutes <= endMinutes) {
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;
        const timeSlot = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        slots.push(timeSlot);
        currentMinutes += slotDuration;
      }
      
      // Filter out already booked slots
      const bookedSlots = new Set();
      existingBookings.forEach(booking => {
        const bookingTime = booking.booking_time;
        const bookingDuration = booking.services.duration;
        
        // Mark the slot and subsequent slots that overlap with this booking as booked
        const [bookingHours, bookingMinutes] = bookingTime.split(':').map(Number);
        const bookingStartMinutes = bookingHours * 60 + bookingMinutes;
        const bookingEndMinutes = bookingStartMinutes + bookingDuration;
        
        slots.forEach(slot => {
          const [slotHours, slotMinutes] = slot.split(':').map(Number);
          const slotStartMinutes = slotHours * 60 + slotMinutes;
          const slotEndMinutes = slotStartMinutes + serviceDuration;
          
          // Check if this slot overlaps with the booking
          if (!(slotEndMinutes <= bookingStartMinutes || slotStartMinutes >= bookingEndMinutes)) {
            bookedSlots.add(slot);
          }
        });
      });
      
      const availableSlots = slots.filter(slot => !bookedSlots.has(slot));
      setAvailableTimes(availableSlots);
    } catch (error) {
      console.error('Error fetching available times:', error);
      Alert.alert('Error', 'Failed to load available time slots');
    } finally {
      setLoading(false);
    }
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
  
  const formatTime = (time) => {
    const [hour, minute] = time.split(':');
    const hourNum = parseInt(hour, 10);
    const period = hourNum >= 12 ? 'PM' : 'AM';
    const hour12 = hourNum % 12 || 12;
    
    return `${hour12}:${minute} ${period}`;
  };
  
  // Enhance booking confirmation with better error handling
  const createOrUpdateBooking = async (paymentId = null) => {
    try {
      setSubmitting(true);
      
      // Format date and time for database
      const bookingDate = formatDateForDB(selectedDate);
      const bookingTime = selectedTimeSlot;
      
      // Create booking data object
      const bookingData = {
        customer_id: user.id,
        provider_id: service.provider_id,
        service_id: service.id,
        booking_date: bookingDate,
        booking_time: bookingTime,
        status: paymentId ? 'confirmed' : 'pending',
        total_amount: service.price,
        payment_id: paymentId,
        notes: notes || null,
      };
      
      let result;
      
      if (isRescheduling && existingBookingId) {
        // Update existing booking
        const { data, error } = await supabase
          .from('bookings')
          .update(bookingData)
          .eq('id', existingBookingId)
          .select();
        
        if (error) throw error;
        result = data[0];
        
        // Schedule notification for rescheduled booking
        await NotificationService.scheduleBookingNotification(result, 'rescheduled');
        
      } else {
        // Create new booking
        const { data, error } = await supabase
          .from('bookings')
          .insert(bookingData)
          .select();
        
        if (error) throw error;
        result = data[0];
        
        // Schedule notification for new booking
        await NotificationService.scheduleBookingNotification(result, 'created');
      }
      
      // Show success message
      Alert.alert(
        isRescheduling ? 'Booking Rescheduled' : 'Booking Confirmed',
        `Your appointment has been ${isRescheduling ? 'rescheduled' : 'booked'} successfully for ${formatDate(selectedDate)} at ${selectedTimeSlot}.`,
        [{ text: 'OK', onPress: () => router.replace('/(app)/(customer)/bookings') }]
      );
      
      return result;
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Error', `Failed to ${isRescheduling ? 'reschedule' : 'create'} booking: ${error.message}`);
      return null;
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select both date and time');
      return;
    }
    
    if (isReschedule) {
      // No payment needed for rescheduling
      createOrUpdateBooking();
    } else {
      // Extract price without the currency symbol
      const priceValue = params.price.replace('₦', '').replace(',', '');
      
      // Show payment options
      PaymentService.showPaymentOptions(
        priceValue,
        user.email,
        (result) => {
          // On successful payment
          createOrUpdateBooking(result);
        },
        (error) => {
          // On payment failure
          Alert.alert('Payment Failed', error.message || 'There was an error processing your payment');
        }
      );
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{isReschedule ? 'Reschedule Appointment' : 'Book Appointment'}</Text>
        </View>
        
        <View style={styles.serviceInfo}>
          <Text style={styles.barberName}>{params.barberName}</Text>
          <Text style={styles.serviceName}>{params.serviceName}</Text>
          <View style={styles.serviceDetails}>
            <Text style={styles.serviceDuration}>{params.duration} min</Text>
            <Text style={styles.servicePrice}>{params.price}</Text>
          </View>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
            {dates.map((date, index) => {
              const formattedDate = formatDate(date);
              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
              
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.dateCard, isSelected && styles.selectedDateCard]}
                  onPress={() => {
                    setSelectedDate(date);
                    setSelectedTime(null); // Reset time when date changes
                  }}
                >
                  <Text style={[styles.dateDay, isSelected && styles.selectedDateText]}>
                    {formattedDate.day}
                  </Text>
                  <Text style={[styles.dateNumber, isSelected && styles.selectedDateText]}>
                    {formattedDate.date}
                  </Text>
                  <Text style={[styles.dateMonth, isSelected && styles.selectedDateText]}>
                    {formattedDate.month}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#2196F3" />
              <Text style={styles.loadingText}>Loading available times...</Text>
            </View>
          ) : availableTimes.length > 0 ? (
            <View style={styles.timeContainer}>
              {availableTimes.map((time, index) => {
                const isSelected = selectedTime === time;
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.timeCard, isSelected && styles.selectedTimeCard]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[styles.timeText, isSelected && styles.selectedTimeText]}>
                      {formatTime(time)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : selectedDate ? (
            <View style={styles.noTimesContainer}>
              <Text style={styles.noTimesText}>
                No available time slots for this date. Please select another date.
              </Text>
            </View>
          ) : (
            <View style={styles.noTimesContainer}>
              <Text style={styles.noTimesText}>Please select a date to see available times.</Text>
            </View>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.confirmButton, (!selectedDate || !selectedTime || loading) && styles.disabledButton]}
          onPress={handleConfirmBooking}
          disabled={!selectedDate || !selectedTime || loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>
              {isReschedule ? 'Confirm Reschedule' : 'Confirm & Pay'}
            </Text>
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  serviceInfo: {
    padding: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  barberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
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
    color: '#333',
  },
  sectionContainer: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  datesContainer: {
    flexDirection: 'row',
  },
  dateCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginRight: 12,
    padding: 8,
  },
  selectedDateCard: {
    backgroundColor: '#2196F3',
  },
  dateDay: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  dateMonth: {
    fontSize: 14,
    color: '#666',
  },
  selectedDateText: {
    color: '#fff',
  },
  timeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  timeCard: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginBottom: 12,
  },
  selectedTimeCard: {
    backgroundColor: '#2196F3',
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  selectedTimeText: {
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  noTimesContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  noTimesText: {
    color: '#666',
    textAlign: 'center',
  },
});

export default BookingFormScreen;