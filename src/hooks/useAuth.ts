import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/services/api';

/**
 * Authentication hook
 * 
 * Uses authApi service which transparently handles both mock (demo)
 * and real API modes based on USE_MOCK_DATA config flag.
 */
interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userEmail: null,
  });
  const navigate = useNavigate();

  // Check auth state on mount via the API service
  useEffect(() => {
    authApi.getSession().then((session) => {
      setAuthState({
        isAuthenticated: session.authenticated,
        userEmail: session.user?.email ?? null,
      });
    });
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setAuthState({ isAuthenticated: false, userEmail: null });
    navigate('/login');
  }, [navigate]);

  const requireAuth = useCallback(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }
    return true;
  }, [navigate]);

  return {
    ...authState,
    logout,
    requireAuth,
  };
}
