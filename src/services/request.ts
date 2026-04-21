import axios, { AxiosRequestConfig, AxiosResponse } from 'taro-axios';
import Taro from '@tarojs/taro';

declare const process: {
  env: {
    TARO_APP_API_URL?: string;
  };
};

const API_BASE_URL = process.env.TARO_APP_API_URL || 'http://localhost:18321';

const httpClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

httpClient.interceptors.request.use(
  (config) => {
    const token = Taro.getStorageSync('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const { status, data } = response;

    if (status >= 400) {
      let message = '请求失败';
      switch (status) {
        case 401:
          message = '登录已过期，请重新登录';
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
          message = data?.message || `请求失败(${status})`;
      }
      Taro.showToast({ title: message, icon: 'none' });
      return Promise.reject(new Error(message));
    }

    if (data?.code !== undefined && data?.code !== 0) {
      Taro.showToast({ title: data.message || '操作失败', icon: 'none' });
      return Promise.reject(new Error(data.message));
    }

    return data;
  },
  (error) => {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      Taro.showToast({ title: '请求超时，请重试', icon: 'none' });
    } else if (error.message?.includes('Network Error') || error.message?.includes('fail')) {
      Taro.showToast({ title: '网络错误，请检查网络', icon: 'none' });
    }
    return Promise.reject(error);
  }
);

export interface RequestOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: unknown;
  header?: Record<string, string>;
}

export async function request<T>(options: RequestOptions): Promise<T> {
  const config: AxiosRequestConfig = {
    url: options.url,
    method: options.method || 'GET',
    data: options.data,
    headers: options.header,
  };

  const res = await httpClient(config);
  return (res as AxiosResponse).data as T;
}

export { httpClient };
