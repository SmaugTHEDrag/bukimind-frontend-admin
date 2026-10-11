import type { PaginatedResponse } from './common';

export interface UserAccount {
  id: number;
  username: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
}

export type UsersPageResponse = PaginatedResponse<UserAccount>;