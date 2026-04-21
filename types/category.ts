import { Dish } from './dish';

export interface Category {
  id: string;
  name: string;
  sortOrder: number;
  enabled: boolean;
  dishes?: Dish[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryDto {
  name: string;
  sortOrder?: number;
  enabled?: boolean;
}

export interface UpdateCategoryDto {
  name?: string;
  sortOrder?: number;
  enabled?: boolean;
}
