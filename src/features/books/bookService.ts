import api from '@services/api/axios';
import { API_ENDPOINTS } from '@constants/api';
import type { Book, BooksPageResponse, CreateBookRequest } from '@app-types/book';

export const bookService = {
  getBooks: async (page = 0, size = 10): Promise<BooksPageResponse> => {
    const response = await api.get<BooksPageResponse>(API_ENDPOINTS.BOOKS.BASE, {
      params: { page, size },
    });
    return response.data;
  },

  getBookById: async (id: number | string): Promise<Book> => {
    const response = await api.get<Book>(API_ENDPOINTS.BOOKS.BY_ID(id));
    return response.data;
  },

  createBook: async (data: CreateBookRequest): Promise<Book> => {
    const response = await api.post<Book>(API_ENDPOINTS.BOOKS.BASE, data);
    return response.data;
  },

  uploadBook: async (formData: FormData): Promise<Book> => {
    const response = await api.post<Book>(API_ENDPOINTS.BOOKS.UPLOAD, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateBook: async (id: number | string, data: Partial<CreateBookRequest>): Promise<Book> => {
    const response = await api.put<Book>(API_ENDPOINTS.BOOKS.BY_ID(id), data);
    return response.data;
  },

  updateBookWithUpload: async (id: number | string, formData: FormData): Promise<Book> => {
    const response = await api.put<Book>(API_ENDPOINTS.BOOKS.UPLOAD_BY_ID(id), formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteBook: async (id: number | string): Promise<void> => {
    await api.delete(API_ENDPOINTS.BOOKS.BY_ID(id));
  },
};