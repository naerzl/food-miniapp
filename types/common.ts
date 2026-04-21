// API 响应类型
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

// 枚举类型
export type OrderStatus = 'pending_payment' | 'paid' | 'preparing' | 'completed' | 'cancelled';
export type UserRole = 'admin' | 'merchant' | 'user';
export type UserStatus = 'active' | 'inactive' | 'banned';
export type DateRange = 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom';
export type SortBy = 'createdAt_desc' | 'createdAt_asc' | 'totalAmount_desc' | 'totalAmount_asc';
export type RankingType = 'sales' | 'revenue' | 'popularity' | 'unsold';
export type TrendType = 'order' | 'revenue' | 'both';
