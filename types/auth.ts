import { User, UserRole } from './common';

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
  user: User;
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
