import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/contexts/AuthContext';

const BookingsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch bookings from your API
    // For this prototype, we'll use dummy data
    const dummyBookings = [
      {
        id: '1',
        customerName: 'John Smith',
        serviceName: 'Haircut',
        date: '2023-11-15',
        time: '10:00 AM',
        status: 'upcoming',
        price: '₦2,500',
      },
      {
        id: '2',
        customerName: 'Michael Brown',
        serviceName: 'Beard Trim',
        date: '2023-11-20',
        time: '2:30 PM',
        status: 'upcoming',
        price: '₦1,500',
      },
      {
        id: '3',
        customerName: 'David Wilson',
        serviceName: 'Full Service',
        date: '2023-10-30',
        time: '11:00 AM',
        status: 'completed',
        price: '₦4,000',
      },
    ];
    
    setBookings(dummyBookings);
    setLoading(false);
  }, []);

  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'upcoming') return booking.status === 'upcoming';
    if (activeTab === 'completed') return booking.status === 'completed';
    return true; // All bookings
  });

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookingCard}
      onPress={() => Alert.alert('Booking Details', `Booking for ${item.customerName}`)}
    >
      <View style={styles.bookingHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={styles.priceText}>{item.price}</Text>
      </View>
      <View style={styles.bookingDetails}>
        <Text style={styles.serviceText}>{item.serviceName}</Text>
        <Text style={styles.timeText}>{item.date} at {item.time}</Text>
      </View>
      <View style={styles.bookingActions}>
        {item.status === 'upcoming' && (
          <>
            <TouchableOpacity 
              style={[styles.actionButton, styles.confirmButton]}
              onPress={() => Alert.alert('Confirm', 'Booking confirmed')}
            >
              <Text style={styles.actionButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rescheduleButton]}
              onPress={() => Alert.alert('Reschedule', 'Booking rescheduled')}
            >
              <Text style={styles.actionButtonText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => Alert.alert('Cancel', 'Booking cancelled')}
            >
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}
        {item.status === 'completed' && (
          <Text style={styles.completedText}>Completed</Text>
        )}
      </View>
    </TouchableOpacity>
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
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
      </View>

      {filteredBookings.length > 0 ? (
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No {activeTab} bookings</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#4A55A2',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4A55A2',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 15,
  },
  bookingCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
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
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A55A2',
  },
  bookingDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
    marginBottom: 10,
  },
  serviceText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
  },
  bookingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  confirmButton: {
    backgroundColor: '#e6f7ee',
  },
  rescheduleButton: {
    backgroundColor: '#e6f0ff',
  },
  cancelButton: {
    backgroundColor: '#f8d7da',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
  completedText: {
    fontSize: 14,
    color: '#28a745',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
});

export default BookingsScreen;