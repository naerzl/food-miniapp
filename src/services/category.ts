import { request } from './request';
import { ApiResponse } from '../../types/common';
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../../types/category';

export const reqGetCategories = () =>
  request<ApiResponse<Category[]>>({
    url: '/api/categories',
    method: 'GET',
  }).then(res => res.data);

export const reqGetCategoryDetail = (id: string) =>
  request<ApiResponse<Category>>({
    url: `/api/categories/${id}`,
    method: 'GET',
  }).then(res => res.data);

export const reqPostCreateCategory = (data: CreateCategoryDto) =>
  request<ApiResponse<Category>>({
    url: '/api/categories',
    method: 'POST',
    data,
  }).then(res => res.data);

export const reqPatchUpdateCategory = (id: string, data: UpdateCategoryDto) =>
  request<ApiResponse<Category>>({
    url: `/api/categories/${id}`,
    method: 'PATCH',
    data,
  }).then(res => res.data);

export const reqDeleteCategory = (id: string) =>
  request<void>({
    url: `/api/categories/${id}`,
    method: 'DELETE',
  });

export const reqPatchReorderCategories = (items: { id: string; sortOrder: number }[]) =>
  request<ApiResponse<Category[]>>({
    url: '/api/categories/reorder',
    method: 'PATCH',
    data: { items },
  }).then(res => res.data);
