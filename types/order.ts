import { OrderStatus, DateRange, SortBy } from './common';

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

export interface OrderFilterParams {
  statuses?: OrderStatus[]
  dateRange?: string
  startDate?: string
  endDate?: string
  userId?: string
  orderNo?: string
  minAmount?: number
  maxAmount?: number
  sortBy?: string
  page?: number
  pageSize?: number
}

export interface PaginatedOrders {
  list: Order[]
  total: number
  page: number
  pageSize: number
  totalPages: number
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
  user?: any;
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
  statuses?: OrderStatus[];
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