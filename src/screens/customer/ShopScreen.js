import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ShopScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For this prototype, we'll use dummy data
    const dummyCategories = ['All', 'Shampoo', 'Conditioner', 'Styling', 'Beard Care', 'Tools'];
    
    const dummyProducts = [
      {
        id: '1',
        name: 'Premium Beard Oil',
        price: '₦3,500',
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmVhcmQlMjBvaWx8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
        category: 'Beard Care',
      },
      {
        id: '2',
        name: 'Professional Hair Clipper',
        price: '₦15,000',
        rating: 4.5,
        image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmVhcmQlMjBvaWx8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
        category: 'Tools',
      },
      {
        id: '3',
        name: 'Moisturizing Shampoo',
        price: '₦2,800',
        rating: 4.2,
        image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmVhcmQlMjBvaWx8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
        category: 'Shampoo',
      },
      {
        id: '4',
        name: 'Hair Styling Pomade',
        price: '₦2,500',
        rating: 4.6,
        image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmVhcmQlMjBvaWx8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
        category: 'Styling',
      },
      {
        id: '5',
        name: 'Deep Conditioner',
        price: '₦3,200',
        rating: 4.3,
        image: 'https://images.unsplash.com/photo-1621607512214-68297480165e?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YmVhcmQlMjBvaWx8ZW58MHx8MHx8&ixlib=rb-1.2.1&w=1000&q=80',
        category: 'Conditioner',
      },
    ];
    
    setCategories(dummyCategories);
    setProducts(dummyProducts);
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.categoryItem, selectedCategory === item && styles.selectedCategory]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text style={[styles.categoryText, selectedCategory === item && styles.selectedCategoryText]}>
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetails', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.ratingText}>★ {item.rating}</Text>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={() => alert('Added to cart!')}
      >
        <Text style={styles.addToCartText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hair Products</Text>
      
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <FlatList
        horizontal
        data={categories}
        renderItem={renderCategoryItem}
        keyExtractor={item => item}
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesList}
      />
      
      <FlatList
        data={filteredProducts}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.productsList}
      />
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
    marginBottom: 16,
    color: '#333',
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoriesList: {
    maxHeight: 50,
    marginBottom: 16,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedCategory: {
    backgroundColor: '#2196F3',
    borderColor: '#2196F3',
  },
  categoryText: {
    color: '#555',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  productsList: {
    paddingBottom: 20,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 120,
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFC107',
    fontWeight: 'bold',
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#2196F3',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ShopScreen;