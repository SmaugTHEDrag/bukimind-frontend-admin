import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authService } from './authService';
import { tokenStorage } from '@services/storage/tokenStorage';
import type { AuthSession, AuthState } from './authTypes';

// Initial state is intentionally unauthenticated. AuthProvider runs
// `initializeAuth` once on boot: it refreshes the tokens stored in
// localStorage, so a still-valid ADMIN session is restored without another
// login (session restoration across browser refresh). Nothing here trusts
// localStorage directly - validity is confirmed by the backend/Keycloak and
// the ADMIN role comes from the access token.
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isAdmin: false,
  initialized: false,
  loading: false,
  error: null,
};

const applySession = (state: AuthState, session: AuthSession): void => {
  state.user = session.user;
  state.token = session.token;
  state.isAuthenticated = true;
  state.isAdmin = session.user.role === 'ADMIN';
  state.error = null;
};

const clearSession = (state: AuthState): void => {
  state.user = null;
  state.token = null;
  state.isAuthenticated = false;
  state.isAdmin = false;
};

/** Restore the stored session on boot (never blocks the app with an error). */
export const initializeAuth = createAsyncThunk<AuthSession | null, void, { rejectValue: string }>(
  'auth/initialize',
  async () => {
    try {
      return await authService.restoreSession();
    } catch {
      tokenStorage.clearAll();
      return null;
    }
  },
);

// Login = username + password through the backend (POST /api/auth/login).
// A non-ADMIN account (e.g. CUSTOMER) is rejected here with
// "This account does not have access" and its tokens are cleared.
export const login = createAsyncThunk<
  AuthSession,
  { username: string; password: string },
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    return await authService.login(credentials.username, credentials.password);
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
  }
});

/** Logout: POST /api/auth/logout (best effort) + always clear local state. */
export const logout = createAsyncThunk<void, void>('auth/logout', async () => {
  await authService.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAuth: (state) => {
      clearSession(state);
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        if (action.payload) {
          applySession(state, action.payload);
        } else {
          clearSession(state);
        }
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        clearSession(state);
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        applySession(state, action.payload);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        clearSession(state);
        state.error = action.payload ?? 'Login failed';
      })
      .addCase(logout.fulfilled, (state) => {
        clearSession(state);
        state.error = null;
      });
  },
});

export const { clearError, clearAuth } = authSlice.actions;
export default authSlice.reducer;
