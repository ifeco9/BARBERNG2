import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/contexts/AuthContext';
import { supabase } from '../../../src/api/supabase';

const BookingsScreen = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      // In a real app, fetch from Supabase
      // const { data, error } = await supabase
      //   .from('bookings')
      //   .select('*, customer_profiles(*)')
      //   .eq('provider_id', user.id);
      
      // if (error) throw error;
      
      // For prototype, using dummy data
      const dummyBookings = [
        {
          id: '1',
          customerName: 'John Smith',
          serviceName: 'Haircut',
          date: '2023-11-15',
          time: '10:00 AM',
          status: 'pending',
          price: '₦2,500',
          customer: {
            phone: '+2348012345678',
            profile_image: 'https://randomuser.me/api/portraits/men/32.jpg'
          }
        },
        {
          id: '2',
          customerName: 'Michael Brown',
          serviceName: 'Beard Trim',
          date: '2023-11-20',
          time: '2:30 PM',
          status: 'confirmed',
          price: '₦1,500',
          customer: {
            phone: '+2348023456789',
            profile_image: 'https://randomuser.me/api/portraits/men/33.jpg'
          }
        },
        {
          id: '3',
          customerName: 'David Wilson',
          serviceName: 'Full Service',
          date: '2023-10-30',
          time: '11:00 AM',
          status: 'completed',
          price: '₦4,000',
          customer: {
            phone: '+2348034567890',
            profile_image: 'https://randomuser.me/api/portraits/men/34.jpg'
          }
        },
        {
          id: '4',
          customerName: 'Sarah Johnson',
          serviceName: 'Haircut',
          date: '2023-11-18',
          time: '3:00 PM',
          status: 'pending',
          price: '₦2,500',
          customer: {
            phone: '+2348045678901',
            profile_image: 'https://randomuser.me/api/portraits/women/32.jpg'
          }
        },
      ];
      
      setBookings(dummyBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      setLoading(true);
      
      // In a real app, update in Supabase
      // const { error } = await supabase
      //   .from('bookings')
      //   .update({ status: newStatus })
      //   .eq('id', bookingId);
      
      // if (error) throw error;
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? {...booking, status: newStatus} : booking
      ));
      
      Alert.alert('Success', `Booking ${newStatus} successfully`);
    } catch (error) {
      console.error('Error updating booking:', error);
      Alert.alert('Error', 'Failed to update booking status');
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') return booking.status === 'pending' || booking.status === 'confirmed';
    if (activeTab === 'completed') return booking.status === 'completed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true; // All bookings
  });

  const renderBookingItem = ({ item }) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={[styles.statusBadge, 
          item.status === 'confirmed' ? styles.confirmedStatus : 
          item.status === 'pending' ? styles.pendingStatus :
          item.status === 'completed' ? styles.completedStatus :
          styles.cancelledStatus
        ]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      
      <View style={styles.bookingDetails}>
        <Text style={styles.serviceText}>{item.serviceName}</Text>
        <Text style={styles.timeText}>{item.date} at {item.time}</Text>
        <Text style={styles.priceText}>{item.price}</Text>
      </View>
      
      <View style={styles.contactInfo}>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => Alert.alert('Contact Customer', `Call ${item.customer.phone}`)}
        >
          <Text style={styles.contactButtonText}>📞 Contact</Text>
        </TouchableOpacity>
      </View>
      
      {(item.status === 'pending' || item.status === 'confirmed') && (
        <View style={styles.bookingActions}>
          {item.status === 'pending' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.confirmButton]}
              onPress={() => updateBookingStatus(item.id, 'confirmed')}
            >
              <Text style={styles.actionButtonText}>Confirm</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.rescheduleButton]}
            onPress={() => Alert.alert('Reschedule', 'This feature is coming soon')}
          >
            <Text style={styles.actionButtonText}>Reschedule</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.cancelButton]}
            onPress={() => updateBookingStatus(item.id, 'cancelled')}
          >
            <Text style={styles.actionButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          {item.status === 'confirmed' && (
            <TouchableOpacity 
              style={[styles.actionButton, styles.completeButton]}
              onPress={() => updateBookingStatus(item.id, 'completed')}
            >
              <Text style={styles.actionButtonText}>Mark Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
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
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>Cancelled</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Loading bookings...</Text>
        </View>
      ) : filteredBookings.length > 0 ? (
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.bookingsList}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No {activeTab} bookings found</Text>
        </View>
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
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0066CC',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#0066CC',
    fontWeight: 'bold',
  },
  bookingsList: {
    padding: 15,
  },
  bookingCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  customerName: {
    fontSize: 16,
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
  pendingStatus: {
    backgroundColor: '#FFF0C2',
    color: '#E6A700',
  },
  confirmedStatus: {
    backgroundColor: '#D1F2EB',
    color: '#16A085',
  },
  completedStatus: {
    backgroundColor: '#D5F5E3',
    color: '#27AE60',
  },
  cancelledStatus: {
    backgroundColor: '#FADBD8',
    color: '#E74C3C',
  },
  bookingDetails: {
    marginBottom: 15,
  },
  serviceText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  priceText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0066CC',
  },
  contactInfo: {
    marginBottom: 15,
  },
  contactButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  contactButtonText: {
    color: '#333',
  },
  bookingActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 3,
    marginBottom: 5,
  },
  confirmButton: {
    backgroundColor: '#D1F2EB',
  },
  rescheduleButton: {
    backgroundColor: '#E8F8F5',
  },
  cancelButton: {
    backgroundColor: '#FADBD8',
  },
  completeButton: {
    backgroundColor: '#D5F5E3',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default BookingsScreen;