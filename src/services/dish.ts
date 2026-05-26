import { request } from './request';
import { ApiResponse } from '../../types/common';
import { Dish, CreateDishDto, UpdateDishDto, BatchTodaySupplyDto, BatchSoldOutDto, BatchAvailableDto } from '../../types/dish';

export const reqGetDishes = (categoryId?: string) =>
  request<ApiResponse<Dish[]>>({
    url: '/api/dishes',
    method: 'GET',
    data: categoryId ? { categoryId } : undefined,
  }).then(res => res.data);

export const reqGetTodayDishes = () =>
  request<ApiResponse<Dish[]>>({
    url: '/api/dishes/today',
    method: 'GET',
  }).then(res => res.data);

export const reqGetDishDetail = (id: string) =>
  request<ApiResponse<Dish>>({
    url: `/api/dishes/${id}`,
    method: 'GET',
  }).then(res => res.data);

export const reqPostCreateDish = (data: CreateDishDto) =>
  request<ApiResponse<Dish>>({
    url: '/api/dishes',
    method: 'POST',
    data,
  }).then(res => res.data);

export const reqPatchUpdateDish = (id: string, data: UpdateDishDto) =>
  request<ApiResponse<Dish>>({
    url: `/api/dishes/${id}`,
    method: 'PATCH',
    data,
  }).then(res => res.data);

export const reqDeleteDish = (id: string) =>
  request<void>({
    url: `/api/dishes/${id}`,
    method: 'DELETE',
  });

export const reqPatchSoldOut = (id: string, soldOut: boolean) =>
  request<ApiResponse<Dish>>({
    url: `/api/dishes/${id}/sold-out`,
    method: 'PATCH',
    data: { soldOut },
  }).then(res => res.data);

export const reqPatchTodaySupply = (id: string, todaySupply: boolean) =>
  request<ApiResponse<Dish>>({
    url: `/api/dishes/${id}/today-supply`,
    method: 'PATCH',
    data: { todaySupply },
  }).then(res => res.data);

export const reqPostBatchTodaySupply = (data: BatchTodaySupplyDto) =>
  request<ApiResponse<{ success: boolean; updatedCount: number; message: string }>>({
    url: '/api/dishes/batch/today-supply',
    method: 'POST',
    data,
  }).then(res => res.data);

export const reqPostBatchSoldOut = (data: BatchSoldOutDto) =>
  request<ApiResponse<{ success: boolean; updatedCount: number; message: string }>>({
    url: '/api/dishes/batch/sold-out',
    method: 'POST',
    data,
  }).then(res => res.data);

export const reqPostBatchAvailable = (data: BatchAvailableDto) =>
  request<ApiResponse<{ success: boolean; updatedCount: number; message: string }>>({
    url: '/api/dishes/batch/available',
    method: 'POST',
    data,
  }).then(res => res.data);
