import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../api/supabase';
import * as SecureStore from 'expo-secure-store';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    checkUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'session exists' : 'no session');
        if (session) {
          setUser(session.user);
          await SecureStore.setItemAsync('supabase-session', JSON.stringify(session));
        } else {
          setUser(null);
          await SecureStore.deleteItemAsync('supabase-session');
        }
        setLoading(false);
      }
    );

    return () => {
      // Fix: Check if authListener and authListener.subscription exist before calling unsubscribe
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const checkUser = async () => {
    try {
      const sessionStr = await SecureStore.getItemAsync('supabase-session');
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        setUser(session.user);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Email/password signup
  const signUp = async (email, password, phone, userType) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            phone,
            user_type: userType,
          },
        },
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Email/password login
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Social login (Google)
  // Add social login methods
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: 'com.barberng://login-callback/'
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  };
  
  const signInWithApple = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: 'com.barberng://login-callback/'
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Apple sign in error:', error);
      throw error;
    }
  };

  // Phone verification
  const verifyPhone = async (phone, code) => {
    try {
      // Validate the verification code with your backend/Supabase
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: code,
        type: 'sms'
      });
      
      if (error) throw error;
      
      // Update user metadata to mark phone as verified
      await supabase.auth.updateUser({
        data: { phone_verified: true }
      });
      
      return { success: true };
    } catch (error) {
      console.error('Phone verification error:', error);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (userData) => {
    try {
      // Update user metadata
      const { data, error } = await supabase.auth.updateUser({
        data: userData
      });
      
      if (error) throw error;
      
      // Update local user state
      setUser(data.user);
      
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'barberng://reset-password',
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  // Update password
  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  };

  // Add the refreshSession function inside the AuthProvider component
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  };

  // Return the AuthContext.Provider with all values including refreshSession
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
        signInWithApple,
        resetPassword,
        updatePassword,
        verifyPhone,
        updateUserProfile,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; // End of AuthProvider

// Keep only one useAuth export at the end of the file
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};