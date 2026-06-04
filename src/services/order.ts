import { request } from './request'
import {
  Order,
  CreateOrderDto,
  UpdateOrderDto,
  OrderFilterParams,
  PaginatedOrders,
} from '../../types/order'

export const reqPostCreateOrder = (data: CreateOrderDto) =>
  request<Order>({
    url: '/api/orders',
    method: 'POST',
    data,
  })

export const reqGetOrders = (status?: string, page = 1, limit = 20) =>
  request<PaginatedOrders>({
    url: '/api/orders',
    method: 'GET',
    data: Object.fromEntries(Object.entries({ status, page, limit }).filter(([, v]) => v !== undefined)),
  })

export const reqGetOrderDetail = (id: string) =>
  request<Order>({
    url: `/api/orders/${id}`,
    method: 'GET',
  })

export const reqPostPayOrder = (id: string) =>
  request<Order>({
    url: `/api/orders/${id}/pay`,
    method: 'POST',
  })

export const reqPostCancelOrder = (id: string) =>
  request<Order>({
    url: `/api/orders/${id}/cancel`,
    method: 'POST',
  })

export const reqPatchUpdateOrder = (id: string, data: UpdateOrderDto) =>
  request<Order>({
    url: `/api/orders/${id}`,
    method: 'PATCH',
    data,
  })

export const reqPatchOrderStatus = (id: string, status: string) =>
  request<Order>({
    url: `/api/orders/${id}/status`,
    method: 'PATCH',
    data: { status },
  })

export const reqGetFilterOrders = (params: OrderFilterParams) =>
  request<PaginatedOrders>({
    url: '/api/orders/filter',
    method: 'GET',
    data: params,
  })

export const reqGetLatestOrder = () =>
  request<Order>({
    url: '/api/orders/latest',
    method: 'GET',
  })
