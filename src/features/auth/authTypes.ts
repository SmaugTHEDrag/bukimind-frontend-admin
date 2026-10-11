export interface User {
  login: string;
  role: 'ADMIN' | 'CUSTOMER';
}

/** Result of a successful login/restore: user profile + access token. */
export interface AuthSession {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  initialized: boolean;
  loading: boolean;
  error: string | null;
}