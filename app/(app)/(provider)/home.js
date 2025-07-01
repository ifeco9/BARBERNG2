import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/contexts/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch data from your API
    // For this prototype, we'll use dummy data
    const dummyBookings = [
      {
        id: '1',
        customerName: 'John Smith',
        serviceName: 'Haircut',
        date: '2023-11-15',
        time: '10:00 AM',
        status: 'confirmed',
        price: '₦2,500',
      },
      {
        id: '2',
        customerName: 'Michael Brown',
        serviceName: 'Beard Trim',
        date: '2023-11-15',
        time: '11:30 AM',
        status: 'confirmed',
        price: '₦1,500',
      },
      {
        id: '3',
        customerName: 'David Wilson',
        serviceName: 'Full Service',
        date: '2023-11-15',
        time: '2:00 PM',
        status: 'pending',
        price: '₦4,000',
      },
    ];
    
    setUpcomingBookings(dummyBookings);
    setLoading(false);
  }, []);

  const renderBookingItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.bookingCard}
      onPress={() => Alert.alert('Booking Details', `Booking for ${item.customerName}`)}
    >
      <View style={styles.bookingHeader}>
        <Text style={styles.customerName}>{item.customerName}</Text>
        <Text style={[styles.statusBadge, 
          item.status === 'confirmed' ? styles.confirmedStatus : styles.pendingStatus
        ]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <View style={styles.bookingDetails}>
        <Text style={styles.serviceText}>{item.serviceName}</Text>
        <Text style={styles.timeText}>{item.date} at {item.time}</Text>
        <Text style={styles.priceText}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.user_metadata?.first_name || 'Provider'}!</Text>
          <Text style={styles.subGreeting}>Here's your schedule for today</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>This Week</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>45</Text>
            <Text style={styles.statLabel}>This Month</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Today's Appointments</Text>
          {upcomingBookings.length > 0 ? (
            <FlatList
              data={upcomingBookings}
              renderItem={renderBookingItem}
              keyExtractor={item => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No appointments for today</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    backgroundColor: '#4A55A2',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  subGreeting: {
    fontSize: 16,
    color: '#e0e0e0',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 15,
    padding: 15,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A55A2',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: '#e0e0e0',
  },
  sectionContainer: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: 'bold',
  },
  confirmedStatus: {
    backgroundColor: '#e6f7ee',
    color: '#28a745',
  },
  pendingStatus: {
    backgroundColor: '#fff3cd',
    color: '#ffc107',
  },
  bookingDetails: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 10,
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
    color: '#4A55A2',
  },
  emptyState: {
    alignItems: 'center',
    padding: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
});

export default HomeScreen;