import axios from 'axios';

/**
 * Dedicated, interceptor-free axios client for the public /api/auth/* endpoints.
 * It deliberately does NOT use the main `api` instance so auth calls never
 * trigger the Bearer/refresh/401-redirect interceptors (no recursion).
 *
 * The admin app has login/logout/refresh only - no registration endpoint.
 */

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

const authClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

/** Pull {"message": "..."} from backend errors; never expose raw internals. */
const messageFrom = (error: unknown, fallback: string): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string } | undefined;
    if (data?.message) return data.message;
    if (!error.response) return 'No response from server. Please check your connection.';
  }
  return fallback;
};

export const authApi = {
  /** POST /api/auth/login */
  login: async (username: string, password: string): Promise<AuthTokens> => {
    try {
      const { data } = await authClient.post<AuthTokens>('/api/auth/login', { username, password });
      return data;
    } catch (error) {
      throw new Error(messageFrom(error, 'Login failed'));
    }
  },

  /** POST /api/auth/refresh */
  refresh: async (refreshToken: string): Promise<AuthTokens> => {
    try {
      const { data } = await authClient.post<AuthTokens>('/api/auth/refresh', { refreshToken });
      return data;
    } catch (error) {
      throw new Error(messageFrom(error, 'Session expired - please log in again'));
    }
  },

  /** POST /api/auth/logout - best effort, errors are swallowed by the caller. */
  logout: async (refreshToken: string): Promise<void> => {
    try {
      await authClient.post('/api/auth/logout', { refreshToken });
    } catch {
      // Local logout must succeed even if the network/Keycloak call fails.
    }
  },
};
