import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Pagination,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { userService } from '@features/users/userService';
import type { UserAccount } from '@app-types/user';

const PAGE_SIZE = 10;

const ManageUsersPage: React.FC = () => {
  const [content, setContent] = useState<UserAccount[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [newRole, setNewRole] = useState<'ADMIN' | 'CUSTOMER'>('CUSTOMER');
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async (page = 0) => {
    setLoading(true);
    try {
      const data = await userService.getUsers(page, PAGE_SIZE);
      setContent(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error loading users:', err);
      alert('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await userService.deleteUser(id);
      alert('User deleted successfully!');

      const remainingItemsOnCurrentPage = content.length - 1;
      if (remainingItemsOnCurrentPage === 0 && currentPage > 0) {
        setCurrentPage(currentPage - 1);
      } else {
        fetchUsers(currentPage);
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete user');
    }
  };

  const handleEdit = (userId: number, currentRole: 'ADMIN' | 'CUSTOMER') => {
    setEditingUserId(userId);
    setNewRole(currentRole);
  };

  const handleUpdateRole = async () => {
    if (editingUserId === null) return;
    try {
      await userService.updateUserRole(editingUserId, newRole);
      alert('Role updated successfully!');
      fetchUsers(currentPage);
      setEditingUserId(null);
    } catch (err) {
      console.error('Error updating role:', err);
      alert('Error updating role');
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setNewRole('CUSTOMER');
  };

  if (loading && content.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          maxWidth: 1180,
          mx: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 10,
        }}
      >
        <CircularProgress size={48} sx={{ color: '#2563eb', mb: 2 }} />
        <Typography sx={{ color: 'grey.600', fontSize: '1.125rem', fontWeight: 500 }}>
          Loading users...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, my: 6 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 'bold' }}>
        Manage Users
      </Typography>

      {content.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ color: 'grey.500' }}>No users found.</Typography>
        </Box>
      ) : (
        <>
          <TableContainer sx={{ maxWidth: 1180 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>No.</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {content.map((user, index) => (
                  <TableRow key={user.id} sx={{ bgcolor: 'background.paper' }}>
                    <TableCell>{currentPage * PAGE_SIZE + index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 500, color: 'grey.900', whiteSpace: 'nowrap' }}>
                      {user.username}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {editingUserId === user.id ? (
                        <Select
                          value={newRole}
                          onChange={(e) => setNewRole(e.target.value as 'ADMIN' | 'CUSTOMER')}
                          size="small"
                          disabled={loading}
                          sx={{ minWidth: 120 }}
                        >
                          <MenuItem value="ADMIN">Admin</MenuItem>
                          <MenuItem value="CUSTOMER">Customer</MenuItem>
                        </Select>
                      ) : (
                        <Box
                          component="span"
                          sx={{
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            bgcolor: user.role === 'ADMIN' ? '#dbeafe' : '#dcfce7',
                            color: user.role === 'ADMIN' ? '#1e40af' : '#166534',
                          }}
                        >
                          {user.role}
                        </Box>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingUserId === user.id ? (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            onClick={handleUpdateRole}
                            disabled={loading}
                            sx={{
                              bgcolor: '#16a34a',
                              color: 'white',
                              textTransform: 'none',
                              '&:hover': { bgcolor: '#15803d' },
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            size="small"
                            onClick={handleCancelEdit}
                            disabled={loading}
                            sx={{
                              bgcolor: '#9ca3af',
                              color: 'white',
                              textTransform: 'none',
                              '&:hover': { bgcolor: '#6b7280' },
                            }}
                          >
                            Cancel
                          </Button>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            size="small"
                            onClick={() => handleEdit(user.id, user.role)}
                            disabled={loading}
                            sx={{
                              bgcolor: '#eab308',
                              color: 'white',
                              textTransform: 'none',
                              '&:hover': { bgcolor: '#ca8a04' },
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleDelete(user.id)}
                            disabled={loading}
                            sx={{
                              bgcolor: '#dc2626',
                              color: 'white',
                              textTransform: 'none',
                              '&:hover': { bgcolor: '#b91c1c' },
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={currentPage + 1}
                onChange={(_, page) => setCurrentPage(page - 1)}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default ManageUsersPage;