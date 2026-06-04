import { request } from './request'
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../../types/category'

export const reqGetCategories = () =>
  request<Category[]>({
    url: '/api/categories',
    method: 'GET',
  })

export const reqGetCategoryDetail = (id: string) =>
  request<Category>({
    url: `/api/categories/${id}`,
    method: 'GET',
  })

export const reqPostCreateCategory = (data: CreateCategoryDto) =>
  request<Category>({
    url: '/api/categories',
    method: 'POST',
    data,
  })

export const reqPatchUpdateCategory = (id: string, data: UpdateCategoryDto) =>
  request<Category>({
    url: `/api/categories/${id}`,
    method: 'PATCH',
    data,
  })

export const reqDeleteCategory = (id: string) =>
  request<void>({
    url: `/api/categories/${id}`,
    method: 'DELETE',
  })

export const reqPatchReorderCategories = (items: { id: string; sortOrder: number }[]) =>
  request<Category[]>({
    url: '/api/categories/reorder',
    method: 'PATCH',
    data: { items },
  })
