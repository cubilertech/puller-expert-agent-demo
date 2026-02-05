import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

 /**
  * ⚠️ DEMO AUTHENTICATION HOOK
  * 
  * This hook provides simple session-based authentication for demo purposes only.
  * It uses sessionStorage which is NOT secure for production applications.
  * 
  * For production, implement:
  * - Secure token-based authentication (JWT)
  * - HTTP-only cookies for session management
  * - Proper backend authentication service
  * - Secure logout with token invalidation
  */
interface AuthState {
  isAuthenticated: boolean;
  userEmail: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    userEmail: null
  });
  const navigate = useNavigate();

  // Check auth state on mount
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
    const userEmail = sessionStorage.getItem('userEmail');
    setAuthState({ isAuthenticated, userEmail });
  }, []);

  // Logout function
  const logout = useCallback(() => {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userEmail');
    setAuthState({ isAuthenticated: false, userEmail: null });
    navigate('/login');
  }, [navigate]);

  // Require auth - redirect if not authenticated
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
    requireAuth
  };
}
