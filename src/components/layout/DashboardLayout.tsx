import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import DescriptionIcon from '@mui/icons-material/Description';
import { useAppSelector } from '@app/hooks';
import { selectIsAdmin, selectUser } from '@features/auth/authSelectors';
import { ROUTES } from '@constants/routes';
import MobileDashboardNav from './MobileDashboardNav';

const DRAWER_WIDTH = 260;

const DashboardSidebar: React.FC = () => {
  const user = useAppSelector(selectUser);
  const isAdmin = useAppSelector(selectIsAdmin);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: <DashboardIcon />, show: true },
    { label: 'Upload Book', path: ROUTES.DASHBOARD_UPLOAD, icon: <CloudUploadIcon />, show: isAdmin },
    { label: 'Manage Books', path: ROUTES.DASHBOARD_MANAGE, icon: <MenuBookIcon />, show: isAdmin },
    { label: 'Users', path: ROUTES.DASHBOARD_MANAGE_USERS, icon: <PeopleIcon />, show: isAdmin },
    { label: 'Log out', path: ROUTES.LOGOUT, icon: <LogoutIcon />, show: true },
  ];

  if (isMobile) {
    return <MobileDashboardNav />;
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', pt: 2 },
      }}
    >
      <Box sx={{ px: 2, pb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box
          component="img"
          src="https://static.vecteezy.com/system/resources/previews/036/437/096/large_2x/illustration-of-book-vector.jpg"
          alt="Logo"
          sx={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
        />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {user?.login || 'Demo User'}
        </Typography>
      </Box>

      <List>
        {navItems
          .filter((item) => item.show)
          .map((item) => (
            <ListItemButton key={item.path} component={Link} to={item.path}>
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
      </List>

      {isAdmin && (
        <List sx={{ mt: 'auto' }}>
          <ListItemButton
            component="a"
            href={`${import.meta.env.VITE_API_BASE_URL}/swagger-ui/index.html`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary="Documentation" />
          </ListItemButton>
        </List>
      )}
    </Drawer>
  );
};

const DashboardLayout: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <DashboardSidebar />
      <Box component="main" sx={{ flexGrow: 1, p: isMobile ? 1 : 2, width: '100%', overflow: 'auto' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;