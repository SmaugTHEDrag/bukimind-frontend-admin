import React from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useAppDispatch } from '@app/hooks';
import { logout } from '@features/auth/authSlice';

const LogoutPage: React.FC = () => {
  const [open, setOpen] = React.useState(true);
  const dispatch = useAppDispatch();

  const handleSignOut = () => {
    // Backend logout: revokes the refresh token at Keycloak and clears local
    // state. Never just drop the token.
    void dispatch(logout());
    setOpen(false);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Click here to Logout
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Sign out</DialogTitle>
        <DialogContent>Are you sure you want to sign out? This will end your Keycloak session.</DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleSignOut}>
            Yes, I want to sign out!
          </Button>
          <Button onClick={() => setOpen(false)} color="inherit">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LogoutPage;
