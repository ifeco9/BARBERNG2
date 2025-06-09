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
      if (authListener) authListener.unsubscribe();
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
  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Social login (Apple)
  const signInWithApple = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  };

  // Phone verification
  const verifyPhone = async (phone, code) => {
    // Implementation will depend on the SMS verification service used
    // This is a placeholder for the actual implementation
  };

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
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
        signInWithGoogle,
        signInWithApple,
        verifyPhone,
        signOut,
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