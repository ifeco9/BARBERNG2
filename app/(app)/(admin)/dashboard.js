import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../src/contexts/AuthContext';

// Replace:
// onPress={() => navigation.navigate('Users')}
// with:
// onPress={() => router.navigate('/(app)/(admin)/users')}

// Or use Link:
<Link href="/(app)/(admin)/users" asChild>
  <TouchableOpacity style={styles.card}>
    {/* Card content */}
  </TouchableOpacity>
</Link>

const DashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalSellers: 0,
    totalCustomers: 0,
    totalBookings: 0,
    totalProducts: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For this prototype, we'll use dummy data
    const dummyStats = {
      totalUsers: 245,
      totalProviders: 42,
      totalSellers: 28,
      totalCustomers: 175,
      totalBookings: 312,
      totalProducts: 87,
      totalRevenue: '₦1,245,600',
    };
    
    setStats(dummyStats);
    setLoading(false);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome, Admin!</Text>
          <Text style={styles.subGreeting}>Platform Overview</Text>
        </View>

        <View style={styles.statsGrid}>
          <Link href="/(app)/(admin)/users" asChild>
            <TouchableOpacity style={styles.statCard}>
              <Text style={styles.statValue}>{stats.totalUsers}</Text>
              <Text style={styles.statLabel}>Total Users</Text>
            </TouchableOpacity>
          </Link>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalProviders}</Text>
            <Text style={styles.statLabel}>Providers</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalSellers}</Text>
            <Text style={styles.statLabel}>Sellers</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalCustomers}</Text>
            <Text style={styles.statLabel}>Customers</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Platform Activity</Text>
          
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>Bookings</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityValue}>{stats.totalBookings}</Text>
              <Text style={styles.activitySubtext}>Total Bookings</Text>
              <View style={styles.activityStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statItemValue}>124</Text>
                  <Text style={styles.statItemLabel}>This Week</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statItemValue}>+12%</Text>
                  <Text style={styles.statItemLabel}>Growth</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>Products</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityValue}>{stats.totalProducts}</Text>
              <Text style={styles.activitySubtext}>Total Products</Text>
              <View style={styles.activityStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statItemValue}>15</Text>
                  <Text style={styles.statItemLabel}>New This Week</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statItemValue}>+8%</Text>
                  <Text style={styles.statItemLabel}>Growth</Text>
                </View>
              </View>
            </View>
          </View>
          
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>Revenue</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>Details</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityValue}>{stats.totalRevenue}</Text>
              <Text style={styles.activitySubtext}>Total Revenue</Text>
              <View style={styles.activityStats}>
                <View style={styles.statItem}>
                  <Text style={styles.statItemValue}>₦245,800</Text>
                  <Text style={styles.statItemLabel}>This Month</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statItemValue}>+15%</Text>
                  <Text style={styles.statItemLabel}>Growth</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/(app)/(admin)/users')}
            >
              <Text style={styles.actionButtonText}>Manage Users</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
            >
              <Text style={styles.actionButtonText}>System Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Coming Soon', 'This feature is under development')}
            >
              <Text style={styles.actionButtonText}>Generate Reports</Text>
            </TouchableOpacity>
          </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 15,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    width: '48%',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  activityCard: {
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
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007bff',
  },
  activityContent: {
    alignItems: 'center',
  },
  activityValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  activitySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  activityStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statItemValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  statItemLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 3,
  },
  quickActions: {
    padding: 15,
    marginBottom: 20,
  },
  actionButtonsContainer: {
    flexDirection: 'column',
  },
  actionButton: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DashboardScreen;
