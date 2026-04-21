import { request } from './request';
import { LoginDto, WechatLoginDto, AuthResponseDto, CreateUserDto } from '../../types/auth';

export const authApi = {
  login: (data: LoginDto) =>
    request<AuthResponseDto>({
      url: '/api/auth/login',
      method: 'POST',
      data,
    }),

  wechatLogin: (data: WechatLoginDto) =>
    request<AuthResponseDto>({
      url: '/api/auth/wechat-login',
      method: 'POST',
      data,
    }),

  register: (data: CreateUserDto) =>
    request<AuthResponseDto>({
      url: '/api/auth/register',
      method: 'POST',
      data,
    }),
};
