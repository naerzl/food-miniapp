// ==================== 枚举类型 ====================

export type OrderStatus = 'pending_payment' | 'paid' | 'preparing' | 'completed' | 'cancelled';

export type UserRole = 'admin' | 'merchant' | 'user';
export type UserStatus = 'active' | 'inactive' | 'banned';

export type DateRange = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom';
export type SortBy = 'createdAt_desc' | 'createdAt_asc' | 'totalAmount_desc' | 'totalAmount_asc';
export type RankingType = 'sales' | 'revenue' | 'popularity' | 'unsold';
export type TrendType = 'order' | 'revenue' | 'both';

// ==================== 用户相关 ====================

export interface User {
  id: string;
  username?: string;
  nickname?: string;
  phone?: string;
  email?: string;
  openId?: string;
  unionId?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  // 扩展字段
  totalSpent?: number;
  orderCount?: number;
}

export interface LoginDto {
  username?: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface WechatLoginDto {
  code: string;
}

export interface AuthResponseDto {
  accessToken: string;
  expiresIn: number;
  user: User;
}

export interface CreateUserDto {
  username?: string;
  nickname?: string;
  phone?: string;
  email?: string;
  password: string;
  avatar?: string;
  role?: UserRole;
}

export interface UpdateUserDto {
  username?: string;
  nickname?: string;
  phone?: string;
  email?: string;
  password?: string;
  avatar?: string;
  role?: UserRole;
  status?: UserStatus;
}

// ==================== 分类相关 ====================

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  enabled: boolean;
  dishes?: Dish[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  sortOrder?: number;
  enabled?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  sortOrder?: number;
  enabled?: boolean;
}

// ==================== 菜品相关 ====================

export interface Dish {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  available: boolean;
  todaySupply: boolean;
  soldOut: boolean;
  sortOrder: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  // 前端扩展字段
  categoryName?: string;
}

export interface CreateDishDto {
  categoryId: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  available?: boolean;
  todaySupply?: boolean;
  sortOrder?: number;
}

export interface UpdateDishDto {
  categoryId?: string;
  name?: string;
  price?: number;
  image?: string;
  description?: string;
  available?: boolean;
  todaySupply?: boolean;
  soldOut?: boolean;
  sortOrder?: number;
}

export interface BatchTodaySupplyDto {
  dishIds: string[];
  todaySupply: boolean;
}

export interface BatchSoldOutDto {
  dishIds: string[];
  soldOut: boolean;
}

export interface BatchAvailableDto {
  dishIds: string[];
  available: boolean;
}

// ==================== 订单相关 ====================

export interface OrderItem {
  id?: string;
  orderId?: string;
  dishId: string;
  dishName: string;
  price: number;
  quantity: number;
  subtotal?: number;
  remark?: string;
}

export interface Order {
  id: string;
  orderNo: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  remark?: string;
  paidAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  user?: User;
}

export interface CreateOrderItemDto {
  dishId: string;
  quantity: number;
  remark?: string;
}

export interface CreateOrderDto {
  items: CreateOrderItemDto[];
  remark?: string;
}

export interface UpdateOrderDto {
  remark?: string;
  status?: OrderStatus;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
}

export interface OrderFilterParams {
  status?: OrderStatus | OrderStatus[];
  dateRange?: DateRange;
  startDate?: string;
  endDate?: string;
  userId?: string;
  orderNo?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: SortBy;
  page?: number;
  pageSize?: number;
}

export interface PaginatedOrders {
  items: Order[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ==================== 统计相关 ====================

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

// ==================== API 响应类型 ====================

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface ApiListResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
