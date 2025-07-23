import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../../src/contexts/AuthContext';
import { supabase } from '../../../src/api/supabase';
import { COLORS } from '../../../src/constants/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';

const AddReviewScreen = () => {
  const { user } = useAuth();
  const params = useLocalSearchParams();
  const { bookingId, providerId, providerName, serviceName } = params;
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }

    try {
      setLoading(true);
      
      // Check if a review already exists for this booking
      const { data: existingReview, error: checkError } = await supabase
        .from('reviews')
        .select('id')
        .eq('booking_id', bookingId)
        .eq('customer_id', user.id)
        .single();
      
      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }
      
      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({
            rating,
            comment,
            updated_at: new Date()
          })
          .eq('id', existingReview.id);
        
        if (error) throw error;
        
        Alert.alert('Success', 'Your review has been updated!');
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert({
            customer_id: user.id,
            booking_id: bookingId,
            rating,
            comment,
          });
        
        if (error) throw error;
        
        Alert.alert('Success', 'Your review has been submitted!');
      }
      
      router.back();
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={() => setRating(i)}
          style={styles.starContainer}
        >
          <AntDesign
            name={i <= rating ? 'star' : 'staro'}
            size={32}
            color={i <= rating ? COLORS.warning : COLORS.textLight}
          />
        </TouchableOpacity>
      );
    }
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Rate Your Experience</Text>
      
      <View style={styles.serviceInfo}>
        <Text style={styles.providerName}>{providerName}</Text>
        <Text style={styles.serviceName}>{serviceName}</Text>
      </View>
      
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>How was your experience?</Text>
        <View style={styles.starsContainer}>
          {renderStars()}
        </View>
        <Text style={styles.ratingText}>
          {rating === 0 ? 'Tap to rate' : 
           rating === 1 ? 'Poor' :
           rating === 2 ? 'Fair' :
           rating === 3 ? 'Good' :
           rating === 4 ? 'Very Good' : 'Excellent'}
        </Text>
      </View>
      
      <View style={styles.commentContainer}>
        <Text style={styles.commentLabel}>Leave a comment (optional)</Text>
        <TextInput
          style={styles.commentInput}
          placeholder="Tell us about your experience..."
          value={comment}
          onChangeText={setComment}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>
      
      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmitReview}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Submit Review</Text>
        )}
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
        disabled={loading}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
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
    marginBottom: 20,
    color: COLORS.text,
    textAlign: 'center',
  },
  serviceInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  providerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  ratingContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: COLORS.text,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  starContainer: {
    padding: 5,
  },
  ratingText: {
    fontSize: 16,
    color: COLORS.textLight,
    marginTop: 4,
  },
  commentContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  commentLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
    color: COLORS.text,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.textLight,
  },
  cancelButtonText: {
    color: COLORS.textLight,
    fontWeight: '500',
    fontSize: 16,
  },
});

export default AddReviewScreen;