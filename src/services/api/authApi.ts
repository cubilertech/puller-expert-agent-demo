import { USE_MOCK_DATA, AUTH_TOKEN_KEY } from '@/config/api';
import { apiClient } from './client';
import type { LoginRequest, LoginResponse, SessionResponse } from './types';

/** Demo credentials — only used when USE_MOCK_DATA is true */
const DEMO_CREDENTIALS = { email: 'zac@puller.ai', password: '123456' };

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    if (USE_MOCK_DATA) {
      await new Promise((r) => setTimeout(r, 800));
      if (
        email.toLowerCase() === DEMO_CREDENTIALS.email &&
        password === DEMO_CREDENTIALS.password
      ) {
        const mockResponse: LoginResponse = {
          token: 'demo-token-xyz',
          user: { id: 'demo-1', email },
        };
        localStorage.setItem(AUTH_TOKEN_KEY, mockResponse.token);
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.setItem('userEmail', email);
        return mockResponse;
      }
      throw { status: 401, message: 'Invalid email or password. Please try again.' };
    }

    const res = await apiClient.post<LoginResponse>('/auth/login', { email, password } as LoginRequest);
    localStorage.setItem(AUTH_TOKEN_KEY, res.token);
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('userEmail', res.user.email);
    return res;
  },

  async logout(): Promise<void> {
    if (!USE_MOCK_DATA) {
      try {
        await apiClient.post('/auth/logout');
      } catch {
        // best-effort
      }
    }
    localStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userEmail');
  },

  async getSession(): Promise<SessionResponse> {
    if (USE_MOCK_DATA) {
      const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
      const email = sessionStorage.getItem('userEmail');
      return {
        authenticated: isAuthenticated,
        user: isAuthenticated && email ? { id: 'demo-1', email } : null,
      };
    }
    return apiClient.get<SessionResponse>('/auth/session');
  },
};
