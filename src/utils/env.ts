import Taro from '@tarojs/taro'

/**
 * 判断是否是微信小程序环境
 */
export const isWeapp = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

/**
 * 判断是否是 H5 环境
 */
export const isH5 = Taro.getEnv() === Taro.ENV_TYPE.WEB

/**
 * 获取登录页面路径
 * 微信小程序环境跳转到微信登录页面，其他环境跳转到账号登录页面
 */
export const getLoginUrl = (): string => {
  return isWeapp ? '/pages/guest/wechat-login/index' : '/pages/guest/login/index'
}
