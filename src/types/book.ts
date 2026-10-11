import type { PaginatedResponse } from './common';

export type { PaginatedResponse };

export interface Book {
  id: number;
  title: string;
  author: string;
  image: string;
  category: string;
  description: string;
  pdf?: string;
  avgRating?: number;
  reviewCount?: number;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  image?: string;
  category: string;
  description?: string;
  pdf?: string;
}

export type BooksPageResponse = PaginatedResponse<Book>;