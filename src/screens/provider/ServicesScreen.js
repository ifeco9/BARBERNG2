import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

const ServicesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch services from your API
    // For this prototype, we'll use dummy data
    const dummyServices = [
      {
        id: '1',
        name: 'Haircut',
        description: 'Standard haircut with scissors or clippers',
        duration: '30 min',
        price: '₦2,500',
      },
      {
        id: '2',
        name: 'Beard Trim',
        description: 'Beard shaping and trimming',
        duration: '15 min',
        price: '₦1,500',
      },
      {
        id: '3',
        name: 'Full Service',
        description: 'Haircut, beard trim, and facial treatment',
        duration: '60 min',
        price: '₦4,000',
      },
      {
        id: '4',
        name: 'Hair Coloring',
        description: 'Professional hair coloring service',
        duration: '90 min',
        price: '₦6,000',
      },
    ];
    
    setServices(dummyServices);
    setLoading(false);
  }, []);

  const handleAddService = () => {
    Alert.alert('Add Service', 'This feature is coming soon');
  };

  const handleEditService = (service) => {
    Alert.alert('Edit Service', `Edit ${service.name}`);
  };

  const handleDeleteService = (service) => {
    Alert.alert(
      'Delete Service',
      `Are you sure you want to delete ${service.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive' },
      ]
    );
  };

  const renderServiceItem = ({ item }) => (
    <View style={styles.serviceCard}>
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.servicePrice}>{item.price}</Text>
      </View>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      <Text style={styles.serviceDuration}>Duration: {item.duration}</Text>
      
      <View style={styles.serviceActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEditService(item)}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteService(item)}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Services</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddService}
        >
          <Text style={styles.addButtonText}>+ Add Service</Text>
        </TouchableOpacity>
      </View>

      {services.length > 0 ? (
        <FlatList
          data={services}
          renderItem={renderServiceItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No services added yet</Text>
          <TouchableOpacity 
            style={styles.addFirstButton}
            onPress={handleAddService}
          >
            <Text style={styles.addFirstButtonText}>Add Your First Service</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  addButton: {
    backgroundColor: '#4A55A2',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
  },
  serviceCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4A55A2',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  serviceDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  serviceActions: {
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
  editButton: {
    backgroundColor: '#e6f0ff',
  },
  deleteButton: {
    backgroundColor: '#f8d7da',
  },
  actionButtonText: {
    fontSize: 12,
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
    marginBottom: 20,
  },
  addFirstButton: {
    backgroundColor: '#4A55A2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  addFirstButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ServicesScreen;