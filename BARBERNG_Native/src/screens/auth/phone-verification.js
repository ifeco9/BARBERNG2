import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { formatPhoneForDisplay } from '../../utils/phoneUtils';
// Replace expo-router with React Navigation
import { useNavigation, useRoute } from '@react-navigation/native';
import { supabase } from '../../api/supabase';

const PhoneVerificationScreen = () => {
  // Replace useLocalSearchParams with useRoute
  const route = useRoute();
  const { phone } = route.params || {};
  const navigation = useNavigation();
  
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(seconds => seconds - 1);
      }, 1000);
    } else {
      setResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit code');
      return;
    }

    try {
      setLoading(true);
      
      // In a real app, you would verify the code with your backend or auth provider
      // For this prototype, we'll update the user's metadata to mark phone as verified
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase.auth.updateUser({
          data: { 
            phone_verified: true,
            phone: phone
          }
        });
        
        if (error) throw error;
        
        Alert.alert(
          'Success', 
          'Phone number verified successfully!',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      Alert.alert('Verification Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    // In a real app, you would call your backend or auth provider to resend the code
    setTimer(60);
    setResendDisabled(true);
    Alert.alert('Code Sent', 'A new verification code has been sent to your phone.');
  };

  // Add resend code functionality
  const resendVerificationCode = async () => {
    setResendLoading(true);
    try {
      // Call your SMS service API here
      const { error } = await supabase.functions.invoke('send-verification-sms', {
        body: { phone: phoneNumber }
      });
      
      if (error) throw error;
      
      setResendCooldown(60); // 60 second cooldown
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      Alert.alert('Success', 'Verification code resent!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Verify Your Phone</Text>
        <Text style={styles.subtitle}>
          We've sent a verification code to {formatPhoneForDisplay(phone)}
        </Text>

        <View style={styles.codeContainer}>
          <TextInput
            style={styles.codeInput}
            value={code}
            onChangeText={setCode}
            placeholder="Enter 6-digit code"
            keyboardType="number-pad"
            maxLength={6}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Verifying...' : 'Verify'}
          </Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive a code? </Text>
          {resendDisabled ? (
            <Text style={styles.timerText}>Resend in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendLink}>Resend Code</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back to Registration</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  codeContainer: {
    width: '100%',
    marginBottom: 30,
  },
  codeInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 5,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#00a86b', // Changed to green
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  resendText: {
    color: '#666',
  },
  timerText: {
    color: '#999',
  },
  resendLink: {
    color: '#00a86b', // Changed to green
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 40,
  },
  backButtonText: {
    color: '#666',
    fontSize: 16,
  },
});

export default PhoneVerificationScreen;