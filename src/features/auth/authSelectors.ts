import type { RootState } from '@app/store';

export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectIsAdmin = (state: RootState) => state.auth.isAdmin;
export const selectUserRole = (state: RootState) => state.auth.user?.role;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthInitialized = (state: RootState) => state.auth.initialized;