import { request } from './request';
import { ApiResponse } from '../../types/common';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../../types/category';

export const categoryApi = {
  getCategories: () =>
    request<ApiResponse<Category[]>>({
      url: '/api/categories',
      method: 'GET',
    }).then(res => res.data),

  getCategoryById: (id: string) =>
    request<ApiResponse<Category>>({
      url: `/api/categories/${id}`,
      method: 'GET',
    }).then(res => res.data),

  createCategory: (data: CreateCategoryDto) =>
    request<ApiResponse<Category>>({
      url: '/api/categories',
      method: 'POST',
      data,
    }).then(res => res.data),

  updateCategory: (id: string, data: UpdateCategoryDto) =>
    request<ApiResponse<Category>>({
      url: `/api/categories/${id}`,
      method: 'PATCH',
      data,
    }).then(res => res.data),

  deleteCategory: (id: string) =>
    request<void>({
      url: `/api/categories/${id}`,
      method: 'DELETE',
    }),
};
