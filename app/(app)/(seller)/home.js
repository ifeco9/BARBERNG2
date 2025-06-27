import { Link } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/contexts/AuthContext';

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch data from your API
    // For this prototype, we'll use dummy data
    const dummyOrders = [
      {
        id: '1',
        customerName: 'John Smith',
        productName: 'Hair Wax',
        date: '2023-11-15',
        status: 'delivered',
        price: '₦1,800',
      },
      {
        id: '2',
        customerName: 'Michael Brown',
        productName: 'Beard Oil',
        date: '2023-11-15',
        status: 'processing',
        price: '₦2,200',
      },
      {
        id: '3',
        customerName: 'David Wilson',
        productName: 'Shaving Cream',
        date: '2023-11-14',
        status: 'delivered',
        price: '₦1,500',
      },
    ];
    
    const dummyTopProducts = [
      {
        id: '1',
        name: 'Hair Wax',
        sold: 45,
        revenue: '₦81,000',
      },
      {
        id: '2',
        name: 'Beard Oil',
        sold: 38,
        revenue: '₦83,600',
      },
      {
        id: '3',
        name: 'Shaving Cream',
        sold: 32,
        revenue: '₦48,000',
      },
    ];
    
    setRecentOrders(dummyOrders);
    setTopProducts(dummyTopProducts);
    setLoading(false);
  }, []);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => navigation.navigate('Orders')}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderCustomer}>{item.customerName}</Text>
        <Text style={[styles.orderStatus, 
          item.status === 'delivered' ? styles.statusDelivered : styles.statusProcessing
        ]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
      <Text style={styles.orderProduct}>{item.productName}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.orderDate}>{item.date}</Text>
        <Text style={styles.orderPrice}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Text style={styles.productName}>{item.name}</Text>
      <View style={styles.productStats}>
        <Text style={styles.productSold}>{item.sold} sold</Text>
        <Text style={styles.productRevenue}>{item.revenue}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.user_metadata?.first_name || 'Seller'}!</Text>
          <Text style={styles.subGreeting}>Here's your store overview</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>₦24,500</Text>
            <Text style={styles.statLabel}>Today's Sales</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>New Orders</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Orders</Text>
            // Replace all instances of:
            // navigation.navigate('Orders')
            // with:
            // router.navigate('/(app)/(seller)/orders')
            
            // Or use Link components for UI elements:
            <Link href="/(app)/(seller)/orders" asChild>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>View All Orders</Text>
              </TouchableOpacity>
            </Link>
          </View>
          <FlatList
            data={recentOrders}
            renderItem={renderOrderItem}
            keyExtractor={item => item.id}
            horizontal={false}
            scrollEnabled={false}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Selling Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={topProducts}
            renderItem={renderProductItem}
            keyExtractor={item => item.id}
            horizontal={false}
            scrollEnabled={false}
          />
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
    backgroundColor: '#ffffff',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subGreeting: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 15,
    backgroundColor: '#ffffff',
    marginTop: 10,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007bff',
  },
  orderCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  orderCustomer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusDelivered: {
    color: '#28a745',
  },
  statusProcessing: {
    color: '#ffc107',
  },
  orderProduct: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  orderDate: {
    fontSize: 12,
    color: '#999',
  },
  orderPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  productCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  productStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productSold: {
    fontSize: 14,
    color: '#666',
  },
  productRevenue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default HomeScreen;