export interface DashboardOverviewDto {
  today: {
    orderCount: number;
    revenue: number;
    pendingOrders: number;
    preparingOrders: number;
  };
  comparison: {
    orderCountChange: number;
    revenueChange: number;
  };
}

export interface TrendData {
  date: string;
  orderCount: number;
  revenue: number;
}

export interface TrendSummary {
  totalOrders: number;
  totalRevenue: number;
  avgOrderAmount: number;
}

export interface TrendResponseDto {
  trend: TrendData[];
  summary: TrendSummary;
}

export interface HourlyDistributionDto {
  hours: number[];
  orderCounts: number[];
  peakHour: number;
}

export interface DishRankingItemDto {
  dishId: string;
  dishName: string;
  categoryName?: string;
  orderCount: number;
  revenue: number;
  quantity: number;
}

export interface UserRankingItemDto {
  userId: string;
  nickname: string;
  avatar?: string;
  orderCount: number;
  totalSpent: number;
}

export interface UserStatisticsDto {
  userId: string;
  nickname: string;
  avatar?: string;
  totalOrders: number;
  totalSpent: number;
  thisMonthOrders: number;
  thisMonthSpent: number;
  favoriteDish?: {
    dishId: string;
    dishName: string;
    orderCount: number;
  };
}

export interface PaginatedUserRanking {
  code: number;
  message: string;
  data: UserRankingItemDto[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
  };
}