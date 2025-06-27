import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/contexts/AuthContext';

const HomeScreen = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyBarbers, setNearbyBarbers] = useState([]);
  const [featuredStyles, setFeaturedStyles] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For this prototype, we'll use dummy data
    setNearbyBarbers([
      {
        id: '1',
        name: 'Classic Cuts Barber Shop',
        rating: 4.8,
        distance: '0.8 km',
        image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmFyYmVyc2hvcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      },
      {
        id: '2',
        name: 'Modern Styles',
        rating: 4.5,
        distance: '1.2 km',
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmFyYmVyc2hvcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      },
      {
        id: '3',
        name: 'Premium Cuts',
        rating: 4.9,
        distance: '2.5 km',
        image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8YmFyYmVyc2hvcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      },
    ]);

    setFeaturedStyles([
      {
        id: '1',
        name: 'Fade Haircut',
        image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8ZmFkZSUyMGhhaXJjdXR8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
      },
      {
        id: '2',
        name: 'Crew Cut',
        image: 'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8Y3JldyUyMGN1dHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      },
      {
        id: '3',
        name: 'Buzz Cut',
        image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YnV6eiUyMGN1dHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      },
    ]);
  }, []);

  const renderBarberItem = ({ item }) => (
    <TouchableOpacity style={styles.barberCard}>
      <Image source={{ uri: item.image }} style={styles.barberImage} />
      <View style={styles.barberInfo}>
        <Text style={styles.barberName}>{item.name}</Text>
        <View style={styles.barberDetails}>
          <Text style={styles.barberRating}>★ {item.rating}</Text>
          <Text style={styles.barberDistance}>{item.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderStyleItem = ({ item }) => (
    <TouchableOpacity style={styles.styleCard}>
      <Image source={{ uri: item.image }} style={styles.styleImage} />
      <Text style={styles.styleName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.userName}>{user?.user_metadata?.first_name || 'Guest'}</Text>
        </View>
        <Link href="/(app)/(common)/notifications" asChild>
          <TouchableOpacity>
            <View style={styles.notificationIcon}>
              <Text style={styles.notificationText}>🔔</Text>
            </View>
          </TouchableOpacity>
        </Link>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for barbers, styles..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={[{ key: 'content' }]}
        renderItem={() => (
          <View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nearby Barbers</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={nearbyBarbers}
              renderItem={renderBarberItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.barberList}
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Featured Styles</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={featuredStyles}
              renderItem={renderStyleItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.styleList}
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Bookings</Text>
            </View>

            <View style={styles.emptyBookings}>
              <Text style={styles.emptyText}>No recent bookings</Text>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#666',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationText: {
    fontSize: 18,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  searchInput: {
    height: 45,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    color: '#666',
  },
  barberList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  barberCard: {
    width: 250,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  barberImage: {
    width: '100%',
    height: 150,
  },
  barberInfo: {
    padding: 10,
  },
  barberName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  barberDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barberRating: {
    color: '#FFD700',
  },
  barberDistance: {
    color: '#666',
  },
  styleList: {
    paddingLeft: 20,
    paddingRight: 10,
  },
  styleCard: {
    width: 120,
    marginRight: 15,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  styleImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  styleName: {
    padding: 10,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  emptyBookings: {
    alignItems: 'center',
    padding: 30,
    marginHorizontal: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 20,
  },
  emptyText: {
    color: '#666',
    marginBottom: 15,
  },
  bookButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  bookButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default HomeScreen;