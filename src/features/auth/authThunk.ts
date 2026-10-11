// Backwards-compatibility re-exports: thunks live in authSlice.ts (single
// source of truth). The admin app has login + logout only - no register.
export {
  initializeAuth,
  login,
  logout,
} from './authSlice';
