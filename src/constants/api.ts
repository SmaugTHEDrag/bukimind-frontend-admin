export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/login',
  },

  BOOKS: {
    BASE: '/api/books',
    BY_ID: (id: number | string) => `/api/books/${id}`,
    UPLOAD: '/api/books/upload',
    UPLOAD_BY_ID: (id: number | string) => `/api/books/${id}/upload`,
  },

  USERS: {
    BASE: '/api/users',
    BY_ID: (id: number | string) => `/api/users/${id}`,
    UPDATE_ROLE: (id: number | string) => `/api/users/${id}/role`,
  },
} as const;