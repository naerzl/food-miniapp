import { UserRole } from './common';

export interface LoginDto {
  username?: string;
  email?: string;
  phone?: string;
  password: string;
}

export interface WechatLoginDto {
  code: string;
}

export interface AuthResponseDto {
  accessToken: string;
  expiresIn: number;
  user: {
    id: string;
    username?: string;
    nickname?: string;
    avatar?: string;
    role: string;
  };
}

export interface CreateUserDto {
  username?: string;
  nickname?: string;
  phone?: string;
  email?: string;
  password: string;
  avatar?: string;
  role?: UserRole;
}
