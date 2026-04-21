import { request } from './request';
import { ApiResponse } from '../../types/common';
import { Dish, CreateDishDto, UpdateDishDto, BatchTodaySupplyDto, BatchSoldOutDto, BatchAvailableDto } from '../../types/dish';

export const dishApi = {
  getDishes: (categoryId?: string) =>
    request<ApiResponse<Dish[]>>({
      url: '/api/dishes',
      method: 'GET',
      data: categoryId ? { categoryId } : undefined,
    }).then(res => res.data),

  getTodayDishes: () =>
    request<ApiResponse<Dish[]>>({
      url: '/api/dishes/today',
      method: 'GET',
    }).then(res => res.data),

  getDishById: (id: string) =>
    request<ApiResponse<Dish>>({
      url: `/api/dishes/${id}`,
      method: 'GET',
    }).then(res => res.data),

  createDish: (data: CreateDishDto) =>
    request<ApiResponse<Dish>>({
      url: '/api/dishes',
      method: 'POST',
      data,
    }).then(res => res.data),

  updateDish: (id: string, data: UpdateDishDto) =>
    request<ApiResponse<Dish>>({
      url: `/api/dishes/${id}`,
      method: 'PATCH',
      data,
    }).then(res => res.data),

  deleteDish: (id: string) =>
    request<void>({
      url: `/api/dishes/${id}`,
      method: 'DELETE',
    }),

  setSoldOut: (id: string, soldOut: boolean) =>
    request<ApiResponse<Dish>>({
      url: `/api/dishes/${id}/sold-out`,
      method: 'PATCH',
      data: { soldOut },
    }).then(res => res.data),

  setTodaySupply: (id: string, todaySupply: boolean) =>
    request<ApiResponse<Dish>>({
      url: `/api/dishes/${id}/today-supply`,
      method: 'PATCH',
      data: { todaySupply },
    }).then(res => res.data),

  batchSetTodaySupply: (data: BatchTodaySupplyDto) =>
    request<ApiResponse<{ success: boolean; updatedCount: number; message: string }>>({
      url: '/api/dishes/batch/today-supply',
      method: 'POST',
      data,
    }).then(res => res.data),

  batchSetSoldOut: (data: BatchSoldOutDto) =>
    request<ApiResponse<{ success: boolean; updatedCount: number; message: string }>>({
      url: '/api/dishes/batch/sold-out',
      method: 'POST',
      data,
    }).then(res => res.data),

  batchSetAvailable: (data: BatchAvailableDto) =>
    request<ApiResponse<{ success: boolean; updatedCount: number; message: string }>>({
      url: '/api/dishes/batch/available',
      method: 'POST',
      data,
    }).then(res => res.data),
};
