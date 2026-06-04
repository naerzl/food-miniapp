import { request } from './request'
import {
  Dish,
  CreateDishDto,
  UpdateDishDto,
  BatchTodaySupplyDto,
  BatchSoldOutDto,
  BatchAvailableDto,
} from '../../types/dish'

export const reqGetDishes = (categoryId?: string) =>
  request<Dish[]>({
    url: '/api/dishes',
    method: 'GET',
    data: categoryId ? { categoryId } : undefined,
  })

export const reqGetTodayDishes = () =>
  request<Dish[]>({
    url: '/api/dishes/today',
    method: 'GET',
  })

export const reqGetDishDetail = (id: string) =>
  request<Dish>({
    url: `/api/dishes/${id}`,
    method: 'GET',
  })

export const reqPostCreateDish = (data: CreateDishDto) =>
  request<Dish>({
    url: '/api/dishes',
    method: 'POST',
    data,
  })

export const reqPatchUpdateDish = (id: string, data: UpdateDishDto) =>
  request<Dish>({
    url: `/api/dishes/${id}`,
    method: 'PATCH',
    data,
  })

export const reqDeleteDish = (id: string) =>
  request<void>({
    url: `/api/dishes/${id}`,
    method: 'DELETE',
  })

export const reqPatchSoldOut = (id: string, soldOut: boolean) =>
  request<Dish>({
    url: `/api/dishes/${id}/sold-out`,
    method: 'PATCH',
    data: { soldOut },
  })

export const reqPatchTodaySupply = (id: string, todaySupply: boolean) =>
  request<Dish>({
    url: `/api/dishes/${id}/today-supply`,
    method: 'PATCH',
    data: { todaySupply },
  })

export const reqPostBatchTodaySupply = (data: BatchTodaySupplyDto) =>
  request<{ success: boolean; updatedCount: number; message: string }>({
    url: '/api/dishes/batch/today-supply',
    method: 'POST',
    data,
  })

export const reqPostBatchSoldOut = (data: BatchSoldOutDto) =>
  request<{ success: boolean; updatedCount: number; message: string }>({
    url: '/api/dishes/batch/sold-out',
    method: 'POST',
    data,
  })

export const reqPostBatchAvailable = (data: BatchAvailableDto) =>
  request<{ success: boolean; updatedCount: number; message: string }>({
    url: '/api/dishes/batch/available',
    method: 'POST',
    data,
  })
