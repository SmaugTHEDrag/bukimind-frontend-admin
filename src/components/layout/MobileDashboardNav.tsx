import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Avatar,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { ROUTES } from '@constants/routes';
import { useAppSelector } from '@app/hooks';
import { selectUser } from '@features/auth/authSelectors';

const MobileDashboardNav: React.FC = () => {
  const [open, setOpen] = useState(false);
  const user = useAppSelector(selectUser);

  const links = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD },
    { label: 'Upload Book', path: ROUTES.DASHBOARD_UPLOAD },
    { label: 'Manage Books', path: ROUTES.DASHBOARD_MANAGE },
    { label: 'Manage Users', path: ROUTES.DASHBOARD_MANAGE_USERS },
    { label: 'Sign out', path: ROUTES.LOGOUT },
  ];

  return (
    <Box sx={{ px: 2, py: 1 }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Box sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#1d4ed8', flexGrow: 1 }}>📚</Box>
          <Avatar sx={{ width: 32, height: 32, mr: 1 }}>{user?.login?.[0]?.toUpperCase()}</Avatar>
          <IconButton onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 250 }}>
          {links.map((link) => (
            <ListItemButton key={link.path} component={Link} to={link.path} onClick={() => setOpen(false)}>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default MobileDashboardNav;