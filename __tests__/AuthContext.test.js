// Create basic unit tests for authentication
import React from 'react';
import { render, act, waitFor } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';

// Mock Supabase
jest.mock('../src/api/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

const TestComponent = () => {
  const { user, loading } = useAuth();
  return (
    <>
      {loading ? <div>Loading...</div> : null}
      {user ? <div>User is logged in</div> : <div>User is not logged in</div>}
    </>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByText('Loading...')).toBeTruthy();
  });

  it('should show user is not logged in when session is null', async () => {
    require('../src/api/supabase').supabase.auth.getSession.mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });

    const { getByText } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByText('User is not logged in')).toBeTruthy();
    });
  });
});