import api from '@services/api/axios';
import { API_ENDPOINTS } from '@constants/api';
import type { UsersPageResponse, UserAccount } from '@app-types/user';

export const userService = {
  getUsers: async (page = 0, size = 10): Promise<UsersPageResponse> => {
    const response = await api.get<UsersPageResponse>(API_ENDPOINTS.USERS.BASE, {
      params: { page, size },
    });
    return response.data;
  },

  deleteUser: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.USERS.BY_ID(id));
  },

  updateUserRole: async (id: number | string, role: 'ADMIN' | 'CUSTOMER'): Promise<UserAccount> => {
    const response = await api.put<UserAccount>(API_ENDPOINTS.USERS.UPDATE_ROLE(id), { role });
    return response.data;
  },
};