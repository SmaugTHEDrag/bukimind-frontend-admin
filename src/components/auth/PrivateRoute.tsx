import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import {
  selectAuthInitialized,
  selectAuthLoading,
  selectIsAdmin,
  selectIsAuthenticated,
} from '@features/auth/authSelectors';
import { initializeAuth } from '@features/auth/authSlice';
import { ROUTES } from '@constants/routes';

/**
 * AdminRoute - protects admin routes with BOTH authentication AND the ADMIN role.
 *
 * Auth state is initialised ONCE by AuthProvider (`initializeAuth` refreshes
 * the stored tokens and re-checks the ADMIN role), so this guard only reads
 * Redux state:
 *   not authenticated -> /login (in-app username/password form)
 *   authenticated + ADMIN -> render
 *   authenticated + CUSTOMER -> Access Denied (never treated as admin)
 *
 * The backend remains the final authorization authority (CUSTOMER token on an
 * ADMIN API -> 403); this route check is a UX/safety layer, not a boundary.
 */
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isAdmin = useAppSelector(selectIsAdmin);
  const initialized = useAppSelector(selectAuthInitialized);
  const loading = useAppSelector(selectAuthLoading);
  const location = useLocation();

  React.useEffect(() => {
    if (!initialized && !loading) {
      void dispatch(initializeAuth());
    }
  }, [dispatch, initialized, loading]);

  if (!initialized || loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (isAdmin) {
    return <>{children}</>;
  }

  // Authenticated but NOT admin (e.g. CUSTOMER) -> deny admin routes.
  return <Navigate to={ROUTES.LOGIN} state={{ from: location, accessDenied: true }} replace />;
};

export default AdminRoute;
