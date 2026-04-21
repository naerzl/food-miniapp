import { request } from './request';
import { ApiResponse, ApiListResponse } from '../../types/common';
import { User, UpdateUserDto } from '../../types/user';

export const userApi = {
  getProfile: () =>
    request<ApiResponse<User>>({
      url: '/api/users/profile',
      method: 'GET',
    }).then(res => res.data),

  getUsers: (page = 1, limit = 20) =>
    request<ApiListResponse<User>>({
      url: '/api/users',
      method: 'GET',
      data: { page, limit },
    }),

  getUserById: (id: string) =>
    request<ApiResponse<User>>({
      url: `/api/users/${id}`,
      method: 'GET',
    }).then(res => res.data),

  updateUser: (id: string, data: UpdateUserDto) =>
    request<ApiResponse<User>>({
      url: `/api/users/${id}`,
      method: 'PATCH',
      data,
    }).then(res => res.data),

  deleteUser: (id: string) =>
    request<void>({
      url: `/api/users/${id}`,
      method: 'DELETE',
    }),
};
