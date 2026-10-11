import axios from 'axios';
import { authService } from '@features/auth/authService';
import { tokenStorage } from '@services/storage/tokenStorage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Centralized token injection: every request carries a fresh access token as
// `Authorization: Bearer <token>`. Tokens are obtained via /api/auth/* on the
// backend - the browser never talks to Keycloak. The token is refreshed when
// it is close to expiry, so services never manage headers themselves.
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await authService.getFreshAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch {
      // No valid session - send unauthenticated.
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      if (status === 401) {
        // Session is no longer valid (refresh also failed): clear local state
        // and send the user to the in-app login form. No Keycloak redirects.
        tokenStorage.clearAll();
        window.location.href = '/login';
      }

      // Return error message from server if available
      const message = data?.message || data?.error || 'An error occurred';
      return Promise.reject(new Error(message));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error('No response from server. Please check your connection.'));
    } else {
      // Something happened in setting up the request
      return Promise.reject(new Error(error.message || 'Request failed'));
    }
  }
);

export default api;
