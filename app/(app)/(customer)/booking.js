import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useAuth } from '../../../src/contexts/AuthContext';
import { supabase } from '../../../src/api/supabase';

const BookingsScreen = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user, activeTab]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      // Fetch bookings from Supabase
      const { data, error } = await supabase
        .from('bookings')
        .select('*, services(*), provider_profiles(*, profiles(*))')
        .eq('customer_id', user.id)
        .eq('status', activeTab === 'upcoming' ? 'confirmed' : 'completed')
        .order('booking_date', { ascending: activeTab === 'upcoming' });
      
      if (error) throw error;
      
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleReschedule = (booking) => {
    router.navigate({
      pathname: "/(app)/(customer)/booking-form",
      params: { 
        barberId: booking.provider_id,
        barberName: booking.provider_profiles.profiles.first_name + ' ' + booking.provider_profiles.profiles.last_name,
        serviceId: booking.service_id,
        serviceName: booking.services.name,
        price: booking.services.price,
        duration: booking.services.duration,
        isReschedule: true,
        bookingId: booking.id
      }
    });
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      Alert.alert(
        'Cancel Booking',
        'Are you sure you want to cancel this booking?',
        [
          {
            text: 'No',
            style: 'cancel',
          },
          {
            text: 'Yes',
            onPress: async () => {
              setLoading(true);
              const { error } = await supabase
                .from('bookings')
                .update({ status: 'cancelled' })
                .eq('id', bookingId);
              
              if (error) throw error;
              
              Alert.alert('Success', 'Booking cancelled successfully');
              fetchBookings();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error cancelling booking:', error);
      Alert.alert('Error', 'Failed to cancel booking');
      setLoading(false);
    }
  };

  const renderBookingItem = ({ item }) => {
    const isUpcoming = activeTab === 'upcoming';
    const bookingDate = new Date(item.booking_date);
    const formattedDate = bookingDate.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    return (
      <TouchableOpacity 
        style={[styles.bookingCard, isUpcoming ? styles.upcomingCard : styles.completedCard]}
        onPress={() => Alert.alert('Booking Details', 
          `Service: ${item.services.name}\n` +
          `Date: ${formattedDate} at ${item.booking_time}\n` +
          `Price: ₦${item.services.price}\n` +
          `Barber: ${item.provider_profiles.profiles.first_name} ${item.provider_profiles.profiles.last_name}\n` +
          `Shop: ${item.provider_profiles.shop_name}\n` +
          `Address: ${item.provider_profiles.address}`
        )}
      >
        <View style={styles.bookingHeader}>
          <Text style={styles.barberName}>
            {item.provider_profiles.profiles.first_name} {item.provider_profiles.profiles.last_name}
          </Text>
          <Text style={[styles.statusBadge, isUpcoming ? styles.upcomingBadge : styles.completedBadge]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
        
        <Text style={styles.serviceName}>{item.services.name}</Text>
        <Text style={styles.dateTime}>{formattedDate} at {item.booking_time}</Text>
        <Text style={styles.price}>₦{item.services.price}</Text>
        
        {isUpcoming && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rescheduleButton]}
              onPress={() => handleReschedule(item)}
            >
              <Text style={styles.buttonText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleCancelBooking(item.id)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>Completed</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      ) : bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You don't have any {activeTab} bookings</Text>
          <Link href="/(app)/(customer)/home" asChild>
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>Find a Barber</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  tabText: {
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingBottom: 20,
  },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  upcomingCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  completedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#9E9E9E',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  barberName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 'bold',
  },
  upcomingBadge: {
    backgroundColor: '#E8F5E9',
    color: '#4CAF50',
  },
  completedBadge: {
    backgroundColor: '#EEEEEE',
    color: '#757575',
  },
  serviceName: {
    fontSize: 16,
    color: '#555',
    marginBottom: 4,
  },
  dateTime: {
    fontSize: 14,
    color: '#777',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  rescheduleButton: {
    backgroundColor: '#2196F3',
  },
  cancelButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
  },
  bookButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 12,
  },
});

export default BookingsScreen;