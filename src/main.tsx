import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';
import { store } from '@app/store';
import { router } from '@app/router';
import { theme } from '@theme/theme';
import { initializeAuth } from '@features/auth/authSlice';
import { useAppSelector } from '@app/hooks';
import { selectAuthInitialized } from '@features/auth/authSelectors';
import './index.css';

/**
 * AuthProvider - runs `initializeAuth()` exactly once on boot. Stored tokens
 * are refreshed against the backend (POST /api/auth/refresh) and the ADMIN
 * role is re-checked, so a still-valid ADMIN session is restored without
 * another login = session restoration across browser refresh.
 */
const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialized = useAppSelector(selectAuthInitialized);

  React.useEffect(() => {
    void store.dispatch(initializeAuth());
  }, []);

  if (!initialized) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);