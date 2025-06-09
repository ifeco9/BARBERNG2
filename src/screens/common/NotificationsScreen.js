import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you would fetch notifications from your API
    // For this prototype, we'll use dummy data
    const dummyNotifications = [
      {
        id: '1',
        title: 'Booking Confirmed',
        message: 'Your appointment with John Doe on Nov 15 at 10:00 AM has been confirmed.',
        time: '2 hours ago',
        read: false,
        type: 'booking',
      },
      {
        id: '2',
        title: 'Special Offer',
        message: 'Get 20% off on all hair products this weekend!',
        time: '1 day ago',
        read: true,
        type: 'promotion',
      },
      {
        id: '3',
        title: 'Booking Reminder',
        message: 'Don\'t forget your appointment tomorrow at 2:30 PM with Jane Smith.',
        time: '2 days ago',
        read: true,
        type: 'reminder',
      },
      {
        id: '4',
        title: 'New Service Available',
        message: 'Try our new premium beard grooming service!',
        time: '1 week ago',
        read: true,
        type: 'service',
      },
    ];
    
    setNotifications(dummyNotifications);
    setLoading(false);
  }, []);

  const markAsRead = (id) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const renderNotificationItem = ({ item }) => {
    const getIconForType = (type) => {
      switch (type) {
        case 'booking': return '📅';
        case 'promotion': return '🎁';
        case 'reminder': return '⏰';
        case 'service': return '✂️';
        default: return '📣';
      }
    };

    return (
      <TouchableOpacity 
        style={[styles.notificationItem, !item.read && styles.unreadNotification]}
        onPress={() => markAsRead(item.id)}
      >
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{getIconForType(item.type)}</Text>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
        {!item.read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.some(n => !n.read) && (
          <TouchableOpacity 
            onPress={() => {
              setNotifications(prevNotifications =>
                prevNotifications.map(notification => ({ ...notification, read: true }))
              );
            }}
          >
            <Text style={styles.markAllRead}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {loading ? (
        <Text style={styles.loadingText}>Loading notifications...</Text>
      ) : notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You don't have any notifications</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  markAllRead: {
    color: '#2196F3',
    fontSize: 14,
  },
  listContainer: {
    paddingVertical: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  unreadNotification: {
    backgroundColor: '#EBF5FB',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E1F5FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 20,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2196F3',
    marginLeft: 8,
    alignSelf: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NotificationsScreen;