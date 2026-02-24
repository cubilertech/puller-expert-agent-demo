/**
 * API Configuration
 * 
 * Controls whether the app uses mock demo data or a real backend API.
 * Set VITE_USE_MOCK_DATA=false and VITE_API_BASE_URL to your API endpoint
 * to switch to real API mode.
 */

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || '';

/** Defaults to true — app works with demo data until a real backend is configured */
export const USE_MOCK_DATA: boolean = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

/** Key used to store the JWT token in localStorage */
export const AUTH_TOKEN_KEY = 'puller_auth_token';
