import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useAuth } from '../../../src/contexts/AuthContext';
import { supabase } from '../../../src/api/supabase';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [profileData, setProfileData] = useState({
    firstName: user?.user_metadata?.first_name || '',
    lastName: user?.user_metadata?.last_name || '',
    phone: user?.user_metadata?.phone || '',
    email: user?.email || '',
    address: '',
    profileImage: user?.user_metadata?.profile_image || 'https://randomuser.me/api/portraits/men/32.jpg',
  });
  
  useEffect(() => {
    fetchProfileData();
  }, []);
  
  const fetchProfileData = async () => {
    try {
      setLoading(true);
      
      // In a real app, fetch from Supabase
      // const { data, error } = await supabase
      //   .from('profiles')
      //   .select('*, customer_profiles(*)')
      //   .eq('id', user.id)
      //   .single();
      
      // if (error) throw error;
      
      // setProfileData({
      //   firstName: data.first_name || '',
      //   lastName: data.last_name || '',
      //   phone: data.phone || '',
      //   email: user.email || '',
      //   address: data.customer_profiles?.address || '',
      //   profileImage: data.profile_image || 'https://randomuser.me/api/portraits/men/32.jpg',
      // });
      
      // For prototype, using dummy data
      // Already initialized with user metadata
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };
  
  const pickImage = async () => {
    try {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 800,
        maxWidth: 800,
        quality: 0.8,
        selectionLimit: 1,
      };
      
      const result = await launchImageLibrary(options);
      
      if (!result.didCancel && result.assets && result.assets.length > 0) {
        setProfileData(prev => ({ ...prev, profileImage: result.assets[0].uri }));
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };
  
  const uploadImage = async (uri) => {
    try {
      setUploading(true);
      
      // In a real app, upload to Supabase Storage
      // const fileName = `${user.id}-${Date.now()}`;
      // const filePath = `profiles/${fileName}`;
      // const response = await fetch(uri);
      // const blob = await response.blob();
      
      // const { error } = await supabase.storage
      //   .from('avatars')
      //   .upload(filePath, blob);
      
      // if (error) throw error;
      
      // const { data: { publicUrl } } = supabase.storage
      //   .from('avatars')
      //   .getPublicUrl(filePath);
      
      // Update profile with new image URL
      // await supabase
      //   .from('profiles')
      //   .update({ profile_image: publicUrl })
      //   .eq('id', user.id);
      
      // For prototype, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Profile picture updated');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };
  
  const saveProfile = async () => {
    try {
      setLoading(true);
      
      // Validate inputs
      if (!profileData.firstName || !profileData.lastName) {
        Alert.alert('Error', 'First name and last name are required');
        setLoading(false);
        return;
      }
      
      // In a real app, update in Supabase
      // First update auth metadata
      // const { error: metadataError } = await supabase.auth.updateUser({
      //   data: {
      //     first_name: profileData.firstName,
      //     last_name: profileData.lastName,
      //     phone: profileData.phone,
      //     profile_image: profileData.profileImage
      //   }
      // });
      
      // if (metadataError) throw metadataError;
      
      // Then update profiles table
      // const { error: profileError } = await supabase
      //   .from('profiles')
      //   .update({
      //     first_name: profileData.firstName,
      //     last_name: profileData.lastName,
      //     phone: profileData.phone,
      //     profile_image: profileData.profileImage,
      //     updated_at: new Date()
      //   })
      //   .eq('id', user.id);
      
      // if (profileError) throw profileError;
      
      // Update customer_profiles table
      // const { error: customerError } = await supabase
      //   .from('customer_profiles')
      //   .update({
      //     address: profileData.address,
      //     updated_at: new Date()
      //   })
      //   .eq('id', user.id);
      
      // if (customerError) throw customerError;
      
      // Refresh user data in context
      // await refreshUser();
      
      // For prototype, just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading && !profileData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0066CC" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Edit Profile</Text>
        </View>
        
        <View style={styles.imageContainer}>
          {uploading ? (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator size="small" color="#0066CC" />
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          ) : (
            <Image 
              source={{ uri: profileData.profileImage }} 
              style={styles.profileImage} 
            />
          )}
          
          <TouchableOpacity 
            style={styles.changePhotoButton}
            onPress={pickImage}
            disabled={uploading}
          >
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={profileData.firstName}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, firstName: text }))}
              placeholder="Enter your first name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={profileData.lastName}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, lastName: text }))}
              placeholder="Enter your last name"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={profileData.phone}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, phone: text }))}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={profileData.email}
              editable={false}
            />
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              value={profileData.address}
              onChangeText={(text) => setProfileData(prev => ({ ...prev, address: text }))}
              placeholder="Enter your address"
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={saveProfile}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  uploadingContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadingText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
  changePhotoButton: {
    marginTop: 10,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  changePhotoText: {
    color: '#0066CC',
    fontSize: 14,
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: '#f9f9f9',
    color: '#999',
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: '#0066CC',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;