import Taro from '@tarojs/taro';

// 请求拦截器
const requestInterceptor = (chain: any) => {
  const requestParams = chain.requestParams;
  // 添加 token 等逻辑
  return chain.proceed(requestParams);
};

// 响应拦截器
const responseInterceptor = (chain: any) => {
  return chain.proceed().then((res: any) => {
    // 统一处理错误等逻辑
    if (res.statusCode !== 200) {
      Taro.showToast({ title: '请求失败', icon: 'none' });
    }
    return res;
  });
};

// 应用拦截器
Taro.addInterceptor(requestInterceptor);
Taro.addInterceptor(responseInterceptor);

// API 方法
export const api = {
  // 菜品相关
  getDishes: () => Taro.request({ url: '/api/dishes' }),
  getDishById: (id: number) => Taro.request({ url: `/api/dishes/${id}` }),
  
  // 订单相关
  createOrder: (data: any) => Taro.request({ url: '/api/orders', method: 'POST', data }),
  getOrders: (status?: string) => Taro.request({ url: '/api/orders', data: { status } }),
  getOrderById: (id: number) => Taro.request({ url: `/api/orders/${id}` }),
  cancelOrder: (id: number) => Taro.request({ url: `/api/orders/${id}/cancel`, method: 'POST' }),
  
  // 用户相关
  getUserInfo: () => Taro.request({ url: '/api/user' }),
  
  // 私厨相关
  login: (data: { username: string; password: string }) => Taro.request({ url: '/api/chef/login', method: 'POST', data }),
  getChefDishes: () => Taro.request({ url: '/api/chef/dishes' }),
  createDish: (data: any) => Taro.request({ url: '/api/chef/dishes', method: 'POST', data }),
  updateDish: (id: number, data: any) => Taro.request({ url: `/api/chef/dishes/${id}`, method: 'PUT', data }),
  deleteDish: (id: number) => Taro.request({ url: `/api/chef/dishes/${id}`, method: 'DELETE' }),
  getChefOrders: () => Taro.request({ url: '/api/chef/orders' }),
  updateOrderStatus: (id: number, status: string) => Taro.request({ url: `/api/chef/orders/${id}/status`, method: 'PUT', data: { status } }),
  getCustomers: () => Taro.request({ url: '/api/chef/customers' }),
  updateCustomerStatus: (id: number, disabled: boolean) => Taro.request({ url: `/api/chef/customers/${id}/status`, method: 'PUT', data: { disabled } }),
};
