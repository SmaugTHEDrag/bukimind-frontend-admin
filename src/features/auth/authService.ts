import { authApi, type AuthTokens } from '@services/api/authApi';
import { tokenStorage } from '@services/storage/tokenStorage';
import { isAccessTokenStale, roleFromToken, usernameFromToken } from './tokenUtils';
import type { AuthSession, User } from './authTypes';

/**
 * Authentication against the BACKEND only (no Keycloak redirects ever):
 *
 *   login    -> POST /api/auth/login   (username + password)
 *   refresh  -> POST /api/auth/refresh (automatic, before expiry)
 *   logout   -> POST /api/auth/logout  (revokes the session at Keycloak)
 *
 * There is NO signup here: ADMIN accounts are provisioned via Keycloak
 * administration. After every login/restore the access token's realm roles
 * are checked - a non-ADMIN (e.g. CUSTOMER) account is rejected and its
 * tokens are cleared.
 *
 * Tokens live in localStorage so the session survives a page reload
 * (XSS trade-off documented in the project report). The backend remains the
 * only authority that authorizes anything.
 */

export const NO_ADMIN_ACCESS = 'This account does not have access';

/** Build an ADMIN session from tokens, or null (and clear) when not ADMIN. */
const adminSession = (tokens: AuthTokens): AuthSession | null => {
  const role = roleFromToken(tokens.accessToken);
  if (role !== 'ADMIN') {
    tokenStorage.clearAll();
    return null;
  }
  const login =
    usernameFromToken(tokens.accessToken) ?? tokenStorage.getUsername() ?? 'user';
  const user: User = { login, role };
  tokenStorage.setToken(tokens.accessToken);
  tokenStorage.setRefreshToken(tokens.refreshToken);
  tokenStorage.setUser(user);
  tokenStorage.setUsername(login);
  return { user, token: tokens.accessToken };
};

// Serialize concurrent refreshes: parallel API requests share one refresh call.
let refreshInFlight: Promise<string | null> | null = null;

const refreshAccess = async (): Promise<string | null> => {
  const access = tokenStorage.getToken();
  const refresh = tokenStorage.getRefreshToken();

  if (!access && !refresh) return null;
  if (access && !isAccessTokenStale(access)) return access;
  if (!refresh) return null;

  try {
    const tokens = await authApi.refresh(refresh);
    tokenStorage.setToken(tokens.accessToken);
    tokenStorage.setRefreshToken(tokens.refreshToken);
    return tokens.accessToken;
  } catch {
    // Refresh failed (revoked/expired session): fall back to a still-valid
    // access token if any, otherwise report "no session".
    return access && !isAccessTokenStale(access, 0) ? access : null;
  }
};

export const authService = {
  /**
   * Username + password login through the backend. Rejects non-ADMIN
   * accounts with NO_ADMIN_ACCESS after clearing their tokens.
   */
  login: async (username: string, password: string): Promise<AuthSession> => {
    const session = adminSession(await authApi.login(username, password));
    if (!session) throw new Error(NO_ADMIN_ACCESS);
    return session;
  },

  /**
   * Return an access token that is not about to expire, refreshing it first
   * when needed. Used by the axios request interceptor on every call.
   */
  getFreshAccessToken: (): Promise<string | null> => {
    if (!refreshInFlight) {
      refreshInFlight = refreshAccess().finally(() => {
        refreshInFlight = null;
      });
    }
    return refreshInFlight;
  },

  /**
   * Restore the session after a page reload: refresh the stored tokens
   * (validates them server-side) and rebuild the Redux session. A stored
   * non-ADMIN session is cleared and reported as "no session".
   */
  restoreSession: async (): Promise<AuthSession | null> => {
    const token = await authService.getFreshAccessToken();
    if (!token) {
      tokenStorage.clearAll();
      return null;
    }
    if (roleFromToken(token) !== 'ADMIN') {
      tokenStorage.clearAll();
      return null;
    }
    const login =
      usernameFromToken(token) ?? tokenStorage.getUsername() ?? 'user';
    const user: User = { login, role: 'ADMIN' };
    tokenStorage.setUser(user);
    tokenStorage.setUsername(login);
    return { user, token };
  },

  /** Logout: revoke the refresh token server-side and clear local state. */
  logout: async (): Promise<void> => {
    const refresh = tokenStorage.getRefreshToken();
    tokenStorage.clearAll();
    if (refresh) await authApi.logout(refresh);
  },
};
