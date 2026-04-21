import { request } from './request';
import { ApiResponse } from '../types/common';
import { Order, CreateOrderDto, UpdateOrderDto, OrderFilterParams, PaginatedOrders } from '../types/order';

export const orderApi = {
  createOrder: (data: CreateOrderDto) =>
    request<ApiResponse<Order>>({
      url: '/api/orders',
      method: 'POST',
      data,
    }).then(res => res.data),

  getOrders: (status?: string, page = 1, limit = 20) =>
    request<ApiResponse<PaginatedOrders>>({
      url: '/api/orders',
      method: 'GET',
      data: { status, page, limit },
    }).then(res => res.data),

  getOrderById: (id: string) =>
    request<ApiResponse<Order>>({
      url: `/api/orders/${id}`,
      method: 'GET',
    }).then(res => res.data),

  payOrder: (id: string) =>
    request<ApiResponse<Order>>({
      url: `/api/orders/${id}/pay`,
      method: 'POST',
    }).then(res => res.data),

  cancelOrder: (id: string) =>
    request<ApiResponse<Order>>({
      url: `/api/orders/${id}/cancel`,
      method: 'POST',
    }).then(res => res.data),

  updateOrder: (id: string, data: UpdateOrderDto) =>
    request<ApiResponse<Order>>({
      url: `/api/orders/${id}`,
      method: 'PATCH',
      data,
    }).then(res => res.data),

  updateOrderStatus: (id: string, status: string) =>
    request<ApiResponse<Order>>({
      url: `/api/orders/${id}/status`,
      method: 'PATCH',
      data: { status },
    }).then(res => res.data),

  filterOrders: (params: OrderFilterParams) =>
    request<ApiResponse<PaginatedOrders>>({
      url: '/api/orders/filter',
      method: 'GET',
      data: params,
    }).then(res => res.data),
};