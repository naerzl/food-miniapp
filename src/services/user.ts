import { request } from './request'
import { User, UpdateUserDto } from '../../types/user'

export const reqGetProfile = () =>
  request<User>({
    url: '/api/users/profile',
    method: 'GET',
  })

export const reqGetUsers = (page = 1, limit = 20) =>
  request<{ items: User[]; page: number; limit: number; total: number; totalPages: number }>({
    url: '/api/users',
    method: 'GET',
    data: { page, limit },
  })

export const reqGetUserDetail = (id: string) =>
  request<User>({
    url: `/api/users/${id}`,
    method: 'GET',
  })

export const reqPatchUpdateUser = (id: string, data: UpdateUserDto) =>
  request<User>({
    url: `/api/users/${id}`,
    method: 'PATCH',
    data,
  })

export const reqDeleteUser = (id: string) =>
  request<void>({
    url: `/api/users/${id}`,
    method: 'DELETE',
  })
