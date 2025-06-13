import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

const ProductsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch products from your API
    // For this prototype, we'll use dummy data
    const dummyProducts = [
      {
        id: '1',
        name: 'Hair Wax',
        description: 'Professional styling wax for all hair types',
        price: '₦1,800',
        stock: 24,
        image: 'https://images.unsplash.com/photo-1597854408833-ef0ec1fb3b5d?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aGFpciUyMHdheHxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      },
      {
        id: '2',
        name: 'Beard Oil',
        description: 'Nourishing oil for beard growth and maintenance',
        price: '₦2,200',
        stock: 18,
        image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmVhcmQlMjBvaWx8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
      },
      {
        id: '3',
        name: 'Shaving Cream',
        description: 'Smooth shaving cream for sensitive skin',
        price: '₦1,500',
        stock: 32,
        image: 'https://images.unsplash.com/photo-1626808642875-0aa545482dfb?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c2hhdmluZyUyMGNyZWFtfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80',
      },
      {
        id: '4',
        name: 'Hair Pomade',
        description: 'Classic styling pomade for a strong hold',
        price: '₦2,000',
        stock: 15,
        image: 'https://images.unsplash.com/photo-1626808643265-e9b1f3c5b3a6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8aGFpciUyMHBvbWFkZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&w=1000&q=80',
      },
    ];
    
    setProducts(dummyProducts);
    setLoading(false);
  }, []);

  const handleAddProduct = () => {
    Alert.alert('Add Product', 'This feature is coming soon');
  };

  const handleEditProduct = (product) => {
    Alert.alert('Edit Product', `Edit ${product.name}`);
  };

  const handleDeleteProduct = (product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete ${product.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive' },
      ]
    );
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productCard}>
      <Image 
        source={{ uri: item.image }} 
        style={styles.productImage} 
      />
      <View style={styles.productInfo}>
        <View style={styles.productHeader}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>{item.price}</Text>
        </View>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productStock}>In Stock: {item.stock}</Text>
        
        <View style={styles.productActions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditProduct(item)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteProduct(item)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Products</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddProduct}
        >
          <Text style={styles.addButtonText}>+ Add Product</Text>
        </TouchableOpacity>
      </View>

      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No products added yet</Text>
          <TouchableOpacity 
            style={styles.addFirstButton}
            onPress={handleAddProduct}
          >
            <Text style={styles.addFirstButtonText}>Add Your First Product</Text>
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
  productCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  productInfo: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    elevation: 2,
  },
  productActions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    elevation: 2,
  },
});