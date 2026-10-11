import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@app/hooks';
import { ROUTES } from '@constants/routes';
import { login } from '../authSlice';
import { selectAuthError, selectAuthInitialized, selectAuthLoading, selectIsAuthenticated } from '../authSelectors';
import { loginSchema, type LoginFormValues } from '../authSchema';

/**
 * Admin login: a plain username + password form submitted to the backend
 * (POST /api/auth/login). The browser never redirects to Keycloak. The
 * ADMIN role is checked against the access token - a CUSTOMER account gets
 * "This account does not have access" and its tokens are cleared. There is
 * NO sign-up here.
 */
export const LoginForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const initialized = useAppSelector(selectAuthInitialized);

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  // Success (ADMIN session): redirect to the admin dashboard.
  React.useEffect(() => {
    if (initialized && isAuthenticated) {
      navigate(from ?? ROUTES.DASHBOARD, { replace: true });
    }
  }, [initialized, isAuthenticated, navigate, from]);

  const onSubmit = (values: LoginFormValues) => {
    void dispatch(login(values));
  };

  // A non-admin authenticated fine but was denied admin routes -> show
  // Access Denied instead of the login form (route-guard UX layer).
  const state = location.state as { accessDenied?: boolean } | null;
  const isAccessDenied = state?.accessDenied === true;

  if (isAccessDenied) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Access Denied
        </Typography>
        <Typography sx={{ mb: 3 }}>
          You are not authorized to access this admin area. Only users with the
          ADMIN role can access this application.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate(ROUTES.LOGIN, { replace: true, state: null })}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Back to login'}
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ py: 4, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Please Login to Admin Dashboard
      </Typography>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <TextField
        label="Username"
        fullWidth
        autoComplete="username"
        autoFocus
        error={Boolean(errors.username)}
        helperText={errors.username?.message}
        sx={{ mb: 2, textAlign: 'left' }}
        {...register('username')}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        autoComplete="current-password"
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        sx={{ mb: 3, textAlign: 'left' }}
        {...register('password')}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        sx={{ bgcolor: '#3b82f6', px: 3, py: 0.5, borderRadius: 1, textTransform: 'none' }}
      >
        {loading ? 'Loading...' : 'Login'}
      </Button>

      <Typography variant="body2" sx={{ mt: 2 }}>
        Only accounts with the ADMIN role can access this application.
        A CUSTOMER account will be rejected.
      </Typography>
    </Box>
  );
};
