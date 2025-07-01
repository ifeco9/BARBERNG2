import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/contexts/AuthContext';
import { supabase } from '../../../src/api/supabase';
import { router } from 'expo-router';

const HomeScreen = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [nearbyBarbers, setNearbyBarbers] = useState([]);
  const [featuredStyles, setFeaturedStyles] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  // Fix the duplicate variable issue first
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch nearby barbers from Supabase
      const { data: barbersData, error: barbersError } = await supabase
        .from('provider_profiles')
        .select('*, profiles(*)')
        .limit(5);
      
      if (barbersError) throw barbersError;
      
      // Fetch featured styles (in a real app, this would be a separate table)
      // For now, we'll use dummy data
      const dummyStyles = [
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
      ];
      
      // Fetch recent bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*, services(*), provider_profiles(*, profiles(*))') 
        .eq('customer_id', user.id)
        .eq('status', 'confirmed')
        .order('booking_date', { ascending: true })
        .limit(3);
      
      if (bookingsError) throw bookingsError;
      
      // Transform barbers data
      const transformedBarbers = barbersData.map(barber => ({
        id: barber.id,
        name: barber.shop_name || `${barber.profiles.first_name}'s Barbershop`,
        rating: 4.5, // In a real app, calculate this from reviews
        distance: '1.2 km', // In a real app, calculate this from location
        image: barber.profiles.profile_image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmFyYmVyc2hvcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      }));
      
      // Set state once for each variable to avoid duplicate renders
      setNearbyBarbers(transformedBarbers);
      setFeaturedStyles(dummyStyles);
      setRecentBookings(bookingsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };
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


// Add search and filtering functionality
const handleSearch = async (query) => {
  setSearchQuery(query);
  if (!query.trim()) {
    fetchData(); // Reset to default data
    return;
  }
  
  setLoading(true);
  try {
    // Search for barbers by name or location
    const { data, error } = await supabase
      .from('provider_profiles')
      .select('*, profiles(*)')
      .or(`shop_name.ilike.%${query}%, profiles.first_name.ilike.%${query}%, profiles.last_name.ilike.%${query}%`)
      .limit(10);
    
    if (error) throw error;
    
    // Transform results
    const transformedBarbers = data.map(barber => ({
      id: barber.id,
      name: barber.shop_name || `${barber.profiles.first_name}'s Barbershop`,
      rating: 4.5, // In a real app, calculate this from reviews
      distance: '1.2 km', // In a real app, calculate this from location
      image: barber.profiles.profile_image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8YmFyYmVyc2hvcHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
    }));
    
    setNearbyBarbers(transformedBarbers);
  } catch (error) {
    console.error('Search error:', error);
    Alert.alert('Error', 'Failed to search. Please try again.');
  } finally {
    setLoading(false);
  }
};