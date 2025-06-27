import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/contexts/AuthContext';

const BookingsScreen = () => { // Removed navigation prop
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch bookings from your API
    // For this prototype, we'll use dummy data
    const dummyBookings = [
      {
        id: '1',
        barberName: 'John Doe',
        serviceName: 'Haircut',
        date: '2023-11-15',
        time: '10:00 AM',
        status: 'upcoming',
        price: '₦2,500',
      },
      {
        id: '2',
        barberName: 'Jane Smith',
        serviceName: 'Beard Trim',
        date: '2023-11-20',
        time: '2:30 PM',
        status: 'upcoming',
        price: '₦1,500',
      },
      {
        id: '3',
        barberName: 'Mike Johnson',
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

  const renderBookingItem = ({ item }) => {
    const isUpcoming = item.status === 'upcoming';
    
    return (
      <TouchableOpacity 
        style={[styles.bookingCard, isUpcoming ? styles.upcomingCard : styles.completedCard]}
        onPress={() => Alert.alert('Booking Details', `Service: ${item.serviceName}\nDate: ${item.date} at ${item.time}\nPrice: ${item.price}`)}
      >
        <View style={styles.bookingHeader}>
          <Text style={styles.barberName}>{item.barberName}</Text>
          <Text style={[styles.statusBadge, isUpcoming ? styles.upcomingBadge : styles.completedBadge]}>
            {item.status.toUpperCase()}
          </Text>
        </View>
        
        <Text style={styles.serviceName}>{item.serviceName}</Text>
        <Text style={styles.dateTime}>{item.date} at {item.time}</Text>
        <Text style={styles.price}>{item.price}</Text>
        
        {isUpcoming && (
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.rescheduleButton]}
              onPress={() => Alert.alert('Coming Soon', 'Reschedule functionality is under development')}
            >
              <Text style={styles.buttonText}>Reschedule</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => Alert.alert('Coming Soon', 'Cancel functionality is under development')}
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
      
      {loading ? (
        <Text style={styles.loadingText}>Loading bookings...</Text>
      ) : bookings.length > 0 ? (
        <FlatList
          data={bookings}
          renderItem={renderBookingItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You don't have any bookings yet</Text>
          {/* Fixed the Link component usage */}
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
  loadingText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default BookingsScreen;