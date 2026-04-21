import Taro from '@tarojs/taro';

const API_BASE_URL = process.env.TARO_APP_API_URL || 'http://localhost:18321';

// 请求拦截器
const requestInterceptor = (chain: any) => {
  const requestParams = chain.requestParams;

  console.log(requestParams, '@@@@@@');
  if (!requestParams.url.startsWith('http')) {
    requestParams.url = `${API_BASE_URL}${requestParams.url}`;
  }

  const token = Taro.getStorageSync('token');
  if (token) {
    requestParams.header = {
      ...requestParams.header,
      Authorization: `Bearer ${token}`,
    };
  }

  if (!requestParams.header?.['Content-Type']) {
    requestParams.header = {
      ...requestParams.header,
      'Content-Type': 'application/json',
    };
  }

  return chain.proceed(requestParams).then(res => {
    console.log(`http <-- ${requestParams.url} result:`, res);
    return res;
  });
};

// 响应拦截器
const responseInterceptor = (chain: any) => {
  return chain.proceed().then((res: any) => {
    if (res.statusCode >= 400) {
      let message = '请求失败';
      switch (res.statusCode) {
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
          message = res.data?.message || `请求失败(${res.statusCode})`;
      }
      Taro.showToast({ title: message, icon: 'none' });
      return Promise.reject(new Error(message));
    }

    if (res.data?.code !== undefined && res.data?.code !== 0) {
      Taro.showToast({ title: res.data.message || '操作失败', icon: 'none' });
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

Taro.addInterceptor(requestInterceptor);
Taro.addInterceptor(responseInterceptor);

// 通用请求方法
export async function request<T>(options: Taro.request.Option): Promise<T> {
  console.log(options, 'requestInterceptor');
  const res = await Taro.request(options);
  if (res.data?.code === 0) {
    return res.data.data as T;
  }
  return res.data as T;
}
