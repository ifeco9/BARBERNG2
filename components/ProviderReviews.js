import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../src/api/supabase';
import { COLORS } from '../src/constants/colors';
import { AntDesign } from '@expo/vector-icons';

const ProviderReviews = ({ providerId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [providerId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Fetch reviews for this provider
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          customer_id,
          profiles:customer_profiles!inner(profiles(first_name, last_name, profile_image))
        `)
        .eq('booking_id.provider_id', providerId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setReviews(data || []);
      
      // Calculate average rating
      if (data && data.length > 0) {
        const total = data.reduce((sum, review) => sum + review.rating, 0);
        setAverageRating((total / data.length).toFixed(1));
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <AntDesign
          key={i}
          name={i <= rating ? 'star' : 'staro'}
          size={16}
          color={i <= rating ? COLORS.warning : COLORS.textLight}
          style={{ marginRight: 2 }}
        />
      );
    }
    return <View style={{ flexDirection: 'row' }}>{stars}</View>;
  };

  const renderReviewItem = ({ item }) => {
    const reviewDate = new Date(item.created_at);
    const formattedDate = reviewDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    return (
      <View style={styles.reviewItem}>
        <View style={styles.reviewHeader}>
          <Text style={styles.customerName}>
            {item.profiles.first_name} {item.profiles.last_name}
          </Text>
          <Text style={styles.reviewDate}>{formattedDate}</Text>
        </View>
        
        <View style={styles.ratingContainer}>
          {renderStars(item.rating)}
        </View>
        
        {item.comment && (
          <Text style={styles.comment}>{item.comment}</Text>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading reviews...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reviews</Text>
        {reviews.length > 0 && (
          <View style={styles.ratingOverview}>
            <Text style={styles.averageRating}>{averageRating}</Text>
            {renderStars(Math.round(averageRating))}
            <Text style={styles.reviewCount}>({reviews.length})</Text>
          </View>
        )}
      </View>
      
      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={renderReviewItem}
          keyExtractor={item => item.id}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.emptyText}>No reviews yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  ratingOverview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  averageRating: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginRight: 8,
  },
  reviewCount: {
    fontSize: 14,
    color: COLORS.textLight,
    marginLeft: 8,
  },
  reviewItem: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  reviewDate: {
    fontSize: 14,
    color: COLORS.textLight,
  },
  ratingContainer: {
    marginBottom: 8,
  },
  comment: {
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
  loadingContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    padding: 16,
  },
});

export default ProviderReviews;