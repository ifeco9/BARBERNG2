import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

const OrdersScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch orders from your API
    // For this prototype, we'll use dummy data
    const dummyOrders = [
      {
        id: '1',
        customerName: 'John Smith',
        productName: 'Hair Wax',
        quantity: 2,
        date: '2023-11-15',
        status: 'delivered',
        price: '₦3,600',
      },
      {
        id: '2',
        customerName: 'Michael Brown',
        productName: 'Beard Oil',
        quantity: 1,
        date: '2023-11-15',
        status: 'processing',
        price: '₦2,200',
      },
      {
        id: '3',
        customerName: 'David Wilson',
        productName: 'Shaving Cream',
        quantity: 1,
        date: '2023-11-14',
        status: 'delivered',
        price: '₦1,500',
      },
      {
        id: '4',
        customerName: 'Sarah Johnson',
        productName: 'Hair Pomade',
        quantity: 1,
        date: '2023-11-14',
        status: 'processing',
        price: '₦2,000',
      },
      {
        id: '5',
        customerName: 'James Williams',
        productName: 'Hair Wax',
        quantity: 1,
        date: '2023-11-13',
        status: 'cancelled',
        price: '₦1,800',
      },
    ];
    
    setOrders(dummyOrders);
    setLoading(false);
  }, []);

  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  const handleUpdateStatus = (order, newStatus) => {
    Alert.alert(
      'Update Order Status',
      `Change status of order #${order.id} to ${newStatus}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Update', 
          onPress: () => {
            // In a real app, you would update the order status via API
            Alert.alert('Status Updated', `Order #${order.id} status changed to ${newStatus}`);
          } 
        },
      ]
    );
  };

  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={[styles.orderStatus, 
          item.status === 'delivered' ? styles.statusDelivered : 
          item.status === 'processing' ? styles.statusProcessing : 
          styles.statusCancelled
        ]}>
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
      
      <View style={styles.orderDetails}>
        <Text style={styles.orderCustomer}>Customer: {item.customerName}</Text>
        <Text style={styles.orderProduct}>{item.productName} x{item.quantity}</Text>
        <Text style={styles.orderDate}>Date: {item.date}</Text>
        <Text style={styles.orderPrice}>Total: {item.price}</Text>
      </View>
      
      <View style={styles.orderActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => Alert.alert('View Details', `View details for order #${item.id}`)}
        >
          <Text style={styles.actionButtonText}>View Details</Text>
        </TouchableOpacity>
        
        {item.status === 'processing' && (
          <View style={styles.statusButtons}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.deliverButton]}
              onPress={() => handleUpdateStatus(item, 'delivered')}
            >
              <Text style={styles.actionButtonText}>Mark Delivered</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.actionButton, styles.cancelButton]}
              onPress={() => handleUpdateStatus(item, 'cancelled')}
            >
              <Text style={styles.actionButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'processing' && styles.activeTab]}
          onPress={() => setActiveTab('processing')}
        >
          <Text style={[styles.tabText, activeTab === 'processing' && styles.activeTabText]}>Processing</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'delivered' && styles.activeTab]}
          onPress={() => setActiveTab('delivered')}
        >
          <Text style={[styles.tabText, activeTab === 'delivered' && styles.activeTabText]}>Delivered</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'cancelled' && styles.activeTab]}
          onPress={() => setActiveTab('cancelled')}
        >
          <Text style={[styles.tabText, activeTab === 'cancelled' && styles.activeTabText]}>Cancelled</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.ordersList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders found</Text>
          </View>
        }
      />
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
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007bff',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  activeTabText: {
    color: '#007bff',
    fontWeight: 'bold',
  },
  ordersList: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  orderId: {
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
  statusCancelled: {
    color: '#dc3545',
  },
  orderDetails: {
    borderBottomWidth: 1,
    borderBottomColor: '#e1e1e1',
    paddingBottom: 10,
    marginBottom: 10,
  },
  orderCustomer: {
    fontSize: 15,
    color: '#333',
    marginBottom: 5,
  },
  orderProduct: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  orderPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
  },
  orderActions: {
    marginTop: 5,
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  viewButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#6c757d',
  },
  deliverButton: {
    backgroundColor: '#28a745',
    flex: 1,
    marginRight: 5,
  },
  cancelButton: {
    backgroundColor: '#dc3545',
    flex: 1,
    marginLeft: 5,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default OrdersScreen;