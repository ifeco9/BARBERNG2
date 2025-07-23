import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../../src/contexts/AuthContext';
import { supabase } from '../../../../src/api/supabase';
import { COLORS } from '../../../../src/constants/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const DiscoverScreen = () => {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [barbers, setBarbers] = useState([]);
  const [styles, setStyles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('barbers');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'barbers') {
        // Fetch barbers from Supabase
        const { data, error } = await supabase
          .from('provider_profiles')
          .select('*, profiles(*)')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Transform barbers data
        const transformedBarbers = data.map(barber => ({
          id: barber.id,
          name: barber.shop_name || `${barber.profiles.first_name}'s Barbershop`,
          rating: 4.5, // In a real app, calculate this from reviews
          distance: '1.2 km', // In a real app, calculate this from location
          image: barber.profiles.profile_image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70',
        }));
        
        setBarbers(transformedBarbers);
      } else {
        // Fetch styles (in a real app, this would be a separate table)
        // For now, we'll use dummy data
        const dummyStyles = [
          {
            id: '1',
            name: 'Fade Haircut',
            image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486',
          },
          {
            id: '2',
            name: 'Crew Cut',
            image: 'https://images.unsplash.com/photo-1583195764036-6dc248ac07d9',
          },
          {
            id: '3',
            name: 'Buzz Cut',
            image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a',
          },
          {
            id: '4',
            name: 'Pompadour',
            image: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486',
          },
        ];
        
        setStyles(dummyStyles);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const renderBarberItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.barberCard}
      onPress={() => navigation.navigate('BarberDetails', { barberId: item.id })}
    >
      <Image source={{ uri: item.image }} style={styles.barberImage} />
      <View style={styles.barberInfo}>
        <Text style={styles.barberName}>{item.name}</Text>
        <View style={styles.barberDetails}>
          <Text style={styles.barberRating}>★ {item.rating}</Text>
          <Text style={styles.barberDistance}>{item.distance}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.bookButton} 
          onPress={() => navigation.navigate('CreateBooking', {providerId: item.id, providerName: item.name})}
        >
          <Text style={styles.bookButtonText}>Book Appointment</Text>
        </TouchableOpacity>
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
      <Text style={styles.title}>Discover</Text>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for barbers, styles..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'barbers' && styles.activeTab]}
          onPress={() => setActiveTab('barbers')}
        >
          <Text style={[styles.tabText, activeTab === 'barbers' && styles.activeTabText]}>Barbers</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'styles' && styles.activeTab]}
          onPress={() => setActiveTab('styles')}
        >
          <Text style={[styles.tabText, activeTab === 'styles' && styles.activeTabText]}>Hairstyles</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={activeTab === 'barbers' ? barbers : styles}
        renderItem={activeTab === 'barbers' ? renderBarberItem : renderStyleItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        numColumns={activeTab === 'styles' ? 2 : 1}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    height: 50,
    backgroundColor: '#F5F5F5',
    borderRadius: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#F5F5F5',
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: COLORS.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  barberCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  barberImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  barberInfo: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
  },
  barberName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  barberDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barberRating: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  barberDistance: {
    fontSize: 14,
    color: '#666',
  },
  styleCard: {
    flex: 1,
    margin: 5,
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
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  styleName: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
    textAlign: 'center',
  },
});

export default DiscoverScreen;