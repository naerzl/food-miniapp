import { request } from './request'

export interface IFavoriteDishItem {
  name: string
  count: number
}

export interface IResGetMyStatsResponse {
  totalSpent: number
  totalOrders: number
  monthlySpent: number
  monthlyOrders: number
  monthlyGrowth?: number
  favoriteDish?: IFavoriteDishItem
}

export const reqGetMyStats = () =>
  request<{ code: number; message: string; data: IResGetMyStatsResponse }>({
    url: '/api/statistics/my',
    method: 'GET',
  }).then(res => res.data)

export const reqGetUserStats = (userId: string) =>
  request<{ code: number; message: string; data: IResGetMyStatsResponse }>({
    url: `/api/statistics/users/${userId}`,
    method: 'GET',
  }).then(res => res.data)
