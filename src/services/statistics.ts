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
  request<IResGetMyStatsResponse>({
    url: '/api/statistics/my',
    method: 'GET',
  })

export const reqGetUserStats = (userId: string) =>
  request<IResGetMyStatsResponse>({
    url: `/api/statistics/users/${userId}`,
    method: 'GET',
  })
