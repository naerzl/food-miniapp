import { UserRole, UserStatus } from './common';

export interface User {
  id: string;
  username?: string;
  nickname?: string;
  phone?: string;
  email?: string;
  openId?: string;
  unionId?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  totalSpent?: number;
  orderCount?: number;
}

export interface UpdateUserDto {
  username?: string;
  nickname?: string;
  phone?: string;
  email?: string;
  password?: string;
  avatar?: string;
  role?: UserRole;
  status?: UserStatus;
}
