import { request } from './request'
import { LoginDto, WechatLoginDto, AuthResponseDto, CreateUserDto } from '../../types/auth'

export const reqPostLogin = (data: LoginDto) =>
  request<AuthResponseDto>({
    url: '/api/auth/login',
    method: 'POST',
    data,
  })

export const reqPostWechatLogin = (data: WechatLoginDto) =>
  request<AuthResponseDto>({
    url: '/api/auth/wechat-login',
    method: 'POST',
    data,
  })

export const reqPostRegister = (data: CreateUserDto) =>
  request<AuthResponseDto>({
    url: '/api/auth/register',
    method: 'POST',
    data,
  })
