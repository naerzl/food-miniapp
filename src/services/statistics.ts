import { request } from './request';
import { DashboardOverviewDto, TrendResponseDto, HourlyDistributionDto, DishRankingItemDto, PaginatedUserRanking, UserStatisticsDto } from '../../types/statistics';

export const statisticsApi = {
  getDashboardOverview: (date?: string) =>
    request<DashboardOverviewDto>({
      url: '/api/statistics/dashboard',
      method: 'GET',
      data: date ? { date } : undefined,
    }),

  getTrends: (range = '7d', type: 'order' | 'revenue' | 'both' = 'both', startDate?: string, endDate?: string) =>
    request<TrendResponseDto>({
      url: '/api/statistics/trends',
      method: 'GET',
      data: { range, type, startDate, endDate },
    }),

  getHourlyDistribution: () =>
    request<HourlyDistributionDto>({
      url: '/api/statistics/hourly-distribution',
      method: 'GET',
    }),

  getDishRanking: (type = 'sales', range = '30d', categoryId?: string, limit = 10) =>
    request<DishRankingItemDto[]>({
      url: '/api/statistics/dishes/ranking',
      method: 'GET',
      data: { type, range, categoryId, limit },
    }),

  getUserRanking: (range = '30d', page = 1, pageSize = 20, keyword?: string) =>
    request<PaginatedUserRanking>({
      url: '/api/statistics/users/ranking',
      method: 'GET',
      data: { range, page, pageSize, keyword },
    }),

  getUserStatistics: (userId: string) =>
    request<UserStatisticsDto>({
      url: `/api/statistics/users/${userId}`,
      method: 'GET',
    }),

  getMyStatistics: () =>
    request<UserStatisticsDto>({
      url: '/api/statistics/my',
      method: 'GET',
    }),
};