import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';

const UsersScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch users from your API
    // For this prototype, we'll use dummy data
    const dummyUsers = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john.smith@example.com',
        role: 'customer',
        status: 'active',
        joinDate: '2023-10-15',
      },
      {
        id: '2',
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        role: 'provider',
        status: 'active',
        joinDate: '2023-09-22',
      },
      {
        id: '3',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        role: 'seller',
        status: 'active',
        joinDate: '2023-10-05',
      },
      {
        id: '4',
        name: 'David Wilson',
        email: 'david.wilson@example.com',
        role: 'customer',
        status: 'inactive',
        joinDate: '2023-08-18',
      },
      {
        id: '5',
        name: 'Emily Davis',
        email: 'emily.davis@example.com',
        role: 'provider',
        status: 'active',
        joinDate: '2023-09-10',
      },
      {
        id: '6',
        name: 'James Williams',
        email: 'james.williams@example.com',
        role: 'seller',
        status: 'inactive',
        joinDate: '2023-07-25',
      },
    ];
    
    setUsers(dummyUsers);
    setLoading(false);
  }, []);

  const filteredUsers = users.filter(user => {
    // Filter by search query
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by role tab
    const matchesTab = 
      activeTab === 'all' || 
      user.role === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const handleUserAction = (user, action) => {
    switch(action) {
      case 'view':
        Alert.alert('View User', `View details for ${user.name}`);
        break;
      case 'edit':
        Alert.alert('Edit User', `Edit details for ${user.name}`);
        break;
      case 'status':
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        Alert.alert(
          'Change Status',
          `Change ${user.name}'s status to ${newStatus}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Confirm', 
              onPress: () => {
                // In a real app, you would update the user status via API
                Alert.alert('Status Updated', `${user.name}'s status changed to ${newStatus}`);
              } 
            },
          ]
        );
        break;
      case 'delete':
        Alert.alert(
          'Delete User',
          `Are you sure you want to delete ${user.name}?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Delete', 
              style: 'destructive',
              onPress: () => {
                // In a real app, you would delete the user via API
                Alert.alert('User Deleted', `${user.name} has been deleted`);
              } 
            },
          ]
        );
        break;
    }
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.userMeta}>
          <View style={[styles.badge, styles[`${item.role}Badge`]]}>  
            <Text style={styles.badgeText}>
              {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
            </Text>
          </View>
          <View style={[styles.statusBadge, item.status === 'active' ? styles.activeBadge : styles.inactiveBadge]}>  
            <Text style={styles.statusBadgeText}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
          <Text style={styles.joinDate}>Joined: {item.joinDate}</Text>
        </View>
      </View>
      
      <View style={styles.userActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.viewButton]}
          onPress={() => handleUserAction(item, 'view')}
        >
          <Text style={styles.actionButtonText}>View</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleUserAction(item, 'edit')}
        >
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, item.status === 'active' ? styles.deactivateButton : styles.activateButton]}
          onPress={() => handleUserAction(item, 'status')}
        >
          <Text style={styles.actionButtonText}>
            {item.status === 'active' ? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleUserAction(item, 'delete')}
        >
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => setActiveTab('all')}
        >
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'customer' && styles.activeTab]}
          onPress={() => setActiveTab('customer')}
        >
          <Text style={[styles.tabText, activeTab === 'customer' && styles.activeTabText]}>Customers</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'provider' && styles.activeTab]}
          onPress={() => setActiveTab('provider')}
        >
          <Text style={[styles.tabText, activeTab === 'provider' && styles.activeTabText]}>Providers</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'seller' && styles.activeTab]}
          onPress={() => setActiveTab('seller')}
        >
          <Text style={[styles.tabText, activeTab === 'seller' && styles.activeTabText]}>Sellers</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.usersList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => Alert.alert('Add User', 'This feature is coming soon')}
      >
        <Text style={styles.addButtonText}>+ Add New User</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 5,
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
  usersList: {
    padding: 15,
    paddingBottom: 80, // Extra padding for the add button
  },
  userCard: {
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
  userInfo: {
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  userMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
  },
  customerBadge: {
    backgroundColor: '#e9ecef',
  },
  providerBadge: {
    backgroundColor: '#cff4fc',
  },
  sellerBadge: {
    backgroundColor: '#d1e7dd',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
  },
  activeBadge: {
    backgroundColor: '#d1e7dd',
  },
  inactiveBadge: {
    backgroundColor: '#f8d7da',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
  },
  joinDate: {
    fontSize: 12,
    color: '#999',
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 5,
    flex: 1,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  viewButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#6c757d',
  },
  editButton: {
    backgroundColor: '#ffc107',
  },
  activateButton: {
    backgroundColor: '#28a745',
  },
  deactivateButton: {
    backgroundColor: '#6c757d',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
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
  addButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UsersScreen;