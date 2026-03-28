import Taro from '@tarojs/taro';
import {
  ApiResponse,
  ApiListResponse,
  AuthResponseDto,
  LoginDto,
  WechatLoginDto,
  User,
  CreateUserDto,
  UpdateUserDto,
  Category,
  CreateCategoryDto,
  UpdateCategoryDto,
  Dish,
  CreateDishDto,
  UpdateDishDto,
  BatchTodaySupplyDto,
  BatchSoldOutDto,
  BatchAvailableDto,
  Order,
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
  OrderFilterParams,
  PaginatedOrders,
  DashboardOverviewDto,
  TrendResponseDto,
  HourlyDistributionDto,
  DishRankingItemDto,
  UserRankingItemDto,
  UserStatisticsDto,
  PaginatedUserRanking,
} from '../../types/api';

// API 基础配置
const API_BASE_URL = process.env.TARO_APP_API_URL || 'http://localhost:18321';

// 请求拦截器
const requestInterceptor = (chain: any) => {
  const requestParams = chain.requestParams;

  // 添加基础 URL
  if (!requestParams.url.startsWith('http')) {
    requestParams.url = `${API_BASE_URL}${requestParams.url}`;
  }

  // 添加 token
  const token = Taro.getStorageSync('token');
  if (token) {
    requestParams.header = {
      ...requestParams.header,
      Authorization: `Bearer ${token}`,
    };
  }

  // 设置默认 Content-Type
  if (!requestParams.header?.['Content-Type']) {
    requestParams.header = {
      ...requestParams.header,
      'Content-Type': 'application/json',
    };
  }

  return chain.proceed(requestParams);
};

// 响应拦截器
const responseInterceptor = (chain: any) => {
  return chain.proceed().then((res: any) => {
    // 处理 HTTP 错误
    if (res.statusCode >= 400) {
      let message = '请求失败';
      switch (res.statusCode) {
        case 401:
          message = '登录已过期，请重新登录';
          // 清除登录态并跳转登录页
          Taro.removeStorageSync('token');
          Taro.removeStorageSync('userInfo');
          Taro.removeStorageSync('role');
          setTimeout(() => {
            Taro.redirectTo({ url: '/pages/index/index' });
          }, 1500);
          break;
        case 403:
          message = '没有权限执行此操作';
          break;
        case 404:
          message = '请求的资源不存在';
          break;
        case 500:
          message = '服务器内部错误';
          break;
        default:
          message = res.data?.message || `请求失败(${res.statusCode})`;
      }
      Taro.showToast({ title: message, icon: 'none' });
      return Promise.reject(new Error(message));
    }

    // 处理业务错误 (code !== 0)
    if (res.data?.code !== undefined && res.data?.code !== 0) {
      Taro.showToast({
        title: res.data.message || '操作失败',
        icon: 'none'
      });
      return Promise.reject(new Error(res.data.message));
    }

    return res;
  }).catch((err: any) => {
    if (err.errMsg?.includes('timeout')) {
      Taro.showToast({ title: '请求超时，请重试', icon: 'none' });
    } else if (err.errMsg?.includes('fail')) {
      Taro.showToast({ title: '网络错误，请检查网络', icon: 'none' });
    }
    return Promise.reject(err);
  });
};

// 应用拦截器
Taro.addInterceptor(requestInterceptor);
Taro.addInterceptor(responseInterceptor);

// 通用请求方法
async function request<T>(options: Taro.request.Option): Promise<T> {
  const res = await Taro.request(options);
  // 处理两种响应格式：{code, message, data} 或直接返回数据
  if (res.data?.code === 0) {
    return res.data.data as T;
  }
  return res.data as T;
}

// ==================== 认证相关 ====================

export const authApi = {
  // 用户登录
  login: (data: LoginDto) =>
    request<AuthResponseDto>({
      url: '/api/auth/login',
      method: 'POST',
      data,
    }),

  // 微信登录
  wechatLogin: (data: WechatLoginDto) =>
    request<AuthResponseDto>({
      url: '/api/auth/wechat-login',
      method: 'POST',
      data,
    }),

  // 用户注册
  register: (data: CreateUserDto) =>
    request<AuthResponseDto>({
      url: '/api/auth/register',
      method: 'POST',
      data,
    }),
};

// ==================== 用户相关 ====================

export const userApi = {
  // 获取当前用户信息
  getProfile: () =>
    request<ApiResponse<User>>({
      url: '/api/users/profile',
      method: 'GET',
    }).then(res => res.data),

  // 获取用户列表
  getUsers: (page = 1, limit = 20) =>
    request<ApiListResponse<User>>({
      url: '/api/users',
      method: 'GET',
      data: { page, limit },
    }),

  // 获取用户详情
  getUserById: (id: string) =>
    request<ApiResponse<User>>({
      url: `/api/users/${id}`,
      method: 'GET',
    }).then(res => res.data),

  // 更新用户信息
  updateUser: (id: string, data: UpdateUserDto) =>
    request<ApiResponse<User>>({
      url: `/api/users/${id}`,
      method: 'PATCH',
      data,
    }).then(res => res.data),

  // 删除用户
  deleteUser: (id: string) =>
    request<void>({
      url: `/api/users/${id}`,
      method: 'DELETE',
    }),
};

// ==================== 分类相关 ====================

export const categoryApi = {
  // 获取分类列表
  getCategories: () =>
    request<ApiResponse<Category[]>>({
      url: '/api/categories',
      method: 'GET',
    }).then(res => res.data),

  // 获取分类详情
  getCategoryById: (id: string) =>
    request<ApiResponse<Category>>({
      url: `/api/categories/${id}`,
      method: 'GET',
    }).then(res => res.data),

  // 创建分类
  createCategory: (data: CreateCategoryDto) =>
    request<ApiResponse<Category>>({
      url: '/api/categories',
      method: 'POST',
      data,
    }).then(res => res.data),

  // 更新分类
  updateCategory: (id: string, data: UpdateCategoryDto) =>
    request<ApiResponse<Category>>({
      url: `/api/categories/${id}`,
      method: 'PATCH',
      data,
    }).then(res => res.data),

  // 删除分类
  deleteCategory: (id: string) =>
    request<void>({
      url: `/api/categories/${id}`,
      method: 'DELETE',
    }),
};

// ==================== 菜品相关 ====================

export const dishApi = {
  // 获取菜品列表
  getDishes: (categoryId?: string) =>
    request<ApiResponse<Dish[]>>({
      url: '/api/dishes',
      method: 'GET',
      data: categoryId ? { categoryId } : undefined,
    }).then(res => res.data),

  // 获取今日供应菜品
  getTodayDishes: () =>
    request<ApiResponse<Dish[]>>({
      url: '/api/dishes/today',
      method: 'GET',
    }).then(res => res.data),

  // 获取菜品详情
  getDishById: (id: string) =>
    request<ApiResponse<Dish>>({
      url: `/api/dishes/${id}`,
      method: 'GET',
    }).then(res => res.data),

  // 创建菜品
  createDish: (data: CreateDishDto) =>
    request<ApiResponse<Dish>>({
      url: '/api/dishes',
      method: 'POST',
      data,
    }).then(res => res.data),

  // 更新菜品
  updateDish: (id: string, data: UpdateDishDto) =>
    request<ApiResponse<Dish>>({
      url: `/api/dishes/${id}`,
      method: 'PATCH',
      data,
    }).then(res => res.data),

  // 删除菜品
  deleteDish: (id: string) =>
    request<void>({
      url: `/api/dishes/${id}`,
      method: 'DELETE',
    }),

  // 设置售罄状态
  setSoldOut: (id: string, soldOut: boolean) =>
    request<ApiResponse<Dish>>({
      url: `/api/dishes/${id}/sold-out`,
      method: 'PATCH',
      data: { soldOut },
    }).then(res => res.data),

  // 设置今日供应状态
  setTodaySupply: (id: string, todaySupply: boolean) =>
    request<ApiResponse<Dish>>({
      url: `/api/dishes/${id}/today-supply`,
      method: 'PATCH',
      data: { todaySupply },
    }).then(res => res.data),

  // 批量设置今日供应
  batchSetTodaySupply: (data: BatchTodaySupplyDto) =>
    request<ApiResponse<{ success: boolean; updatedCount: number; message: string }>>({
      url: '/api/dishes/batch/today-supply',
      method: 'POST',
      data,
    }).then(res => res.data),

  // 批量设置售罄
  batchSetSoldOut: (data: BatchSoldOutDto) =>
    request<ApiResponse<{ success: boolean; updatedCount: number; message: string }>>({
      url: '/api/dishes/batch/sold-out',
      method: 'POST',
      data,
    }).then(res => res.data),

  // 批量设置上架状态
  batchSetAvailable: (data: BatchAvailableDto) =>
    request<ApiResponse<{ success: boolean; updatedCount: number; message: string }>>({
      url: '/api/dishes/batch/available',
      method: 'POST',
      data,
    }).then(res => res.data),
};

// ==================== 订单相关 ====================

export const orderApi = {
  // 创建订单
  createOrder: (data: CreateOrderDto) =>
    request<Order>({
      url: '/api/orders',
      method: 'POST',
      data,
    }),

  // 获取订单列表
  getOrders: (status?: string, page = 1, limit = 20) =>
    request<PaginatedOrders>({
      url: '/api/orders',
      method: 'GET',
      data: { status, page, limit },
    }),

  // 获取订单详情
  getOrderById: (id: string) =>
    request<Order>({
      url: `/api/orders/${id}`,
      method: 'GET',
    }),

  // 支付订单（虚拟支付）
  payOrder: (id: string) =>
    request<Order>({
      url: `/api/orders/${id}/pay`,
      method: 'POST',
    }),

  // 取消订单
  cancelOrder: (id: string) =>
    request<Order>({
      url: `/api/orders/${id}/cancel`,
      method: 'POST',
    }),

  // 更新订单
  updateOrder: (id: string, data: UpdateOrderDto) =>
    request<Order>({
      url: `/api/orders/${id}`,
      method: 'PATCH',
      data,
    }),

  // 更新订单状态
  updateOrderStatus: (id: string, status: string) =>
    request<Order>({
      url: `/api/orders/${id}/status`,
      method: 'PATCH',
      data: { status },
    }),

  // 筛选订单
  filterOrders: (params: OrderFilterParams) =>
    request<PaginatedOrders>({
      url: '/api/orders/filter',
      method: 'GET',
      data: params,
    }),
};

// ==================== 统计相关 ====================

export const statisticsApi = {
  // 获取今日概览
  getDashboardOverview: (date?: string) =>
    request<DashboardOverviewDto>({
      url: '/api/statistics/dashboard',
      method: 'GET',
      data: date ? { date } : undefined,
    }),

  // 获取趋势数据
  getTrends: (range = '7d', type: 'order' | 'revenue' | 'both' = 'both', startDate?: string, endDate?: string) =>
    request<TrendResponseDto>({
      url: '/api/statistics/trends',
      method: 'GET',
      data: { range, type, startDate, endDate },
    }),

  // 获取时段分布
  getHourlyDistribution: () =>
    request<HourlyDistributionDto>({
      url: '/api/statistics/hourly-distribution',
      method: 'GET',
    }),

  // 获取菜品排行
  getDishRanking: (type = 'sales', range = '30d', categoryId?: string, limit = 10) =>
    request<DishRankingItemDto[]>({
      url: '/api/statistics/dishes/ranking',
      method: 'GET',
      data: { type, range, categoryId, limit },
    }),

  // 获取用户消费排行
  getUserRanking: (range = '30d', page = 1, pageSize = 20, keyword?: string) =>
    request<PaginatedUserRanking>({
      url: '/api/statistics/users/ranking',
      method: 'GET',
      data: { range, page, pageSize, keyword },
    }),

  // 获取指定用户统计
  getUserStatistics: (userId: string) =>
    request<UserStatisticsDto>({
      url: `/api/statistics/users/${userId}`,
      method: 'GET',
    }),

  // 获取我的统计
  getMyStatistics: () =>
    request<UserStatisticsDto>({
      url: '/api/statistics/my',
      method: 'GET',
    }),
};

// ==================== 兼容旧版 API 导出 ====================

export const api = {
  ...authApi,
  ...userApi,
  ...categoryApi,
  ...dishApi,
  ...orderApi,
  ...statisticsApi,
};
