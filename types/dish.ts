export interface Dish {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  available: boolean;
  todaySupply: boolean;
  soldOut: boolean;
  sortOrder: number;
  deletedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  categoryName?: string;
}

export interface CreateDishDto {
  categoryId: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
  available?: boolean;
  todaySupply?: boolean;
  sortOrder?: number;
}

export interface UpdateDishDto {
  categoryId?: string;
  name?: string;
  price?: number;
  image?: string;
  description?: string;
  available?: boolean;
  todaySupply?: boolean;
  soldOut?: boolean;
  sortOrder?: number;
}

export interface BatchTodaySupplyDto {
  dishIds: string[];
  todaySupply: boolean;
}

export interface BatchSoldOutDto {
  dishIds: string[];
  soldOut: boolean;
}

export interface BatchAvailableDto {
  dishIds: string[];
  available: boolean;
}
