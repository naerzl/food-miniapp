import { request } from './request';
import { ApiResponse } from '../types/common';
import { Order, CreateOrderDto, UpdateOrderDto, OrderFilterParams, PaginatedOrders } from '../types/order';

export const reqPostCreateOrder = (data: CreateOrderDto) =>
  request<ApiResponse<Order>>({
    url: '/api/orders',
    method: 'POST',
    data,
  }).then(res => res.data);

export const reqGetOrders = (status?: string, page = 1, limit = 20) =>
  request<ApiResponse<PaginatedOrders>>({
    url: '/api/orders',
    method: 'GET',
    data: { status, page, limit },
  }).then(res => res.data);

export const reqGetOrderDetail = (id: string) =>
  request<ApiResponse<Order>>({
    url: `/api/orders/${id}`,
    method: 'GET',
  }).then(res => res.data);

export const reqPostPayOrder = (id: string) =>
  request<ApiResponse<Order>>({
    url: `/api/orders/${id}/pay`,
    method: 'POST',
  }).then(res => res.data);

export const reqPostCancelOrder = (id: string) =>
  request<ApiResponse<Order>>({
    url: `/api/orders/${id}/cancel`,
    method: 'POST',
  }).then(res => res.data);

export const reqPatchUpdateOrder = (id: string, data: UpdateOrderDto) =>
  request<ApiResponse<Order>>({
    url: `/api/orders/${id}`,
    method: 'PATCH',
    data,
  }).then(res => res.data);

export const reqPatchOrderStatus = (id: string, status: string) =>
  request<ApiResponse<Order>>({
    url: `/api/orders/${id}/status`,
    method: 'PATCH',
    data: { status },
  }).then(res => res.data);

export const reqGetFilterOrders = (params: OrderFilterParams) =>
  request<ApiResponse<PaginatedOrders>>({
    url: '/api/orders/filter',
    method: 'GET',
    data: params,
  }).then(res => res.data);

export const reqGetLatestOrder = () =>
  request<ApiResponse<Order>>({
    url: '/api/orders/latest',
    method: 'GET',
  }).then(res => res.data);
