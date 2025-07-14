import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../api/supabase';
import * as Keychain from 'react-native-keychain';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkUser = async () => {
    try {
      const credentials = await Keychain.getGenericPassword({ service: 'supabase-session' });
      if (credentials) {
        const session = JSON.parse(credentials.password);
        setUser(session.user);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check for existing session
    checkUser();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session ? 'session exists' : 'no session');
        if (session) {
          setUser(session.user);
          await Keychain.setGenericPassword('supabase-session', JSON.stringify(session), { service: 'supabase-session' });
        } else {
          setUser(null);
          await Keychain.resetGenericPassword({ service: 'supabase-session' });
        }
        setLoading(false);
      }
    );
  
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

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
  
  // Social login (Apple)
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

  // Refresh session
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      setUser(data.user);
      return data;
    } catch (error) {
      console.error('Session refresh error:', error);
      throw error;
    }
  };

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
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};