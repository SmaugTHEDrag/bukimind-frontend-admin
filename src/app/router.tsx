import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from '@constants/routes';
import React, { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';
import DashboardLayout from '@components/layout/DashboardLayout';
import AdminRoute from '@components/auth/PrivateRoute';

const LoginPage = lazy(() => import('@pages/auth/LoginPage'));
const LogoutPage = lazy(() => import('@pages/auth/LogoutPage'));
const DashboardPage = lazy(() => import('@pages/dashboard/DashboardPage'));
const ManageBooksPage = lazy(() => import('@pages/dashboard/ManageBooksPage'));
const UploadBookPage = lazy(() => import('@pages/dashboard/UploadBookPage'));
const EditBookPage = lazy(() => import('@pages/dashboard/EditBookPage'));
const ManageUsersPage = lazy(() => import('@pages/dashboard/ManageUsersPage'));
const NotFoundPage = lazy(() => import('@pages/NotFoundPage'));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <CircularProgress />
  </Box>
);

const withSuspense = (Component: React.LazyExoticComponent<React.FC>) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: withSuspense(LoginPage),
  },
  {
    path: ROUTES.LOGOUT,
    element: withSuspense(LogoutPage),
  },
  {
    path: '/admin/dashboard',
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      { index: true, element: withSuspense(DashboardPage) },
      { path: 'upload', element: withSuspense(UploadBookPage) },
      { path: 'manage', element: withSuspense(ManageBooksPage) },
      { path: 'manage-users', element: withSuspense(ManageUsersPage) },
      { path: 'edit-books/:id', element: withSuspense(EditBookPage) },
    ],
  },
  {
    path: '*',
    element: withSuspense(NotFoundPage),
  },
]);