import React from 'react';
import { Box } from '@mui/material';
import { LoginForm } from '@features/auth/components/LoginForm';

const AuthCardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box
    sx={{
      minHeight: '100vh',
      bgcolor: '#f3f4f6',
      py: 3,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <Box sx={{ position: 'relative', py: 1.5, maxWidth: 576, mx: 'auto', width: '100%', px: 2 }}>
      <Box
        sx={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to right, #93c5fd, #2563eb)',
          boxShadow: 3,
          transform: { xs: 'skewY(-6deg)', sm: 'skewY(0) rotate(-6deg)' },
          borderRadius: 6,
        }}
      />
      <Box
        sx={{
          position: 'relative',
          px: { xs: 2, sm: 5 },
          py: { xs: 5, sm: 10 },
          bgcolor: 'white',
          boxShadow: 3,
          borderRadius: 6,
        }}
      >
        <Box sx={{ maxWidth: 448, mx: 'auto' }}>{children}</Box>
      </Box>
    </Box>
  </Box>
);

const LoginPage: React.FC = () => (
  <AuthCardLayout>
    <LoginForm />
  </AuthCardLayout>
);

export default LoginPage;