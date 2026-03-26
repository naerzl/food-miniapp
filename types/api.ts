// 菜品类型
export interface Dish {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
  available: boolean;
  todaySupply: boolean;
  categoryId: number;
  categoryName?: string;
}

// 菜品分类类型
export interface Category {
  id: number;
  name: string;
  sortOrder: number;
}

// 订单状态类型
export type OrderStatus = 'pending_payment' | 'paid' | 'preparing' | 'completed' | 'cancelled';

// 订单项类型
export interface OrderItem {
  id: number;
  orderId: number;
  dishId: number;
  quantity: number;
  price: number;
  dishName?: string;
}

// 订单类型
export interface Order {
  id: number;
  orderNo: string;
  userId: number;
  totalAmount: number;
  status: OrderStatus;
  remark?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
  user?: User;
}

// 用户类型
export interface User {
  id: number;
  openId: string;
  nickname: string;
  avatarUrl: string;
  createdAt: string;
  disabled: boolean;
  totalSpent?: number;
  orderCount?: number;
}

// 创建订单请求数据
export interface CreateOrderData {
  dishes: {
    dishId: number;
    quantity: number;
  }[];
  remark?: string;
}

// 登录请求数据
export interface LoginData {
  username: string;
  password: string;
}

// 登录响应数据
export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

// API响应通用类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
