import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Taro from '@tarojs/taro';

export interface CartItem {
  dishId: number | string;
  dishName: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
}

interface CartActions {
  addToCart: (item: CartItem) => void;
  removeFromCart: (dishId: number | string) => void;
  updateQuantity: (dishId: number | string, quantity: number) => void;
  clearCart: () => void;
  setCart: (items: CartItem[]) => void;
}

type CartStore = CartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (item) => {
        const items = get().items;
        const existingIndex = items.findIndex((i) => i.dishId === item.dishId);
        let newItems: CartItem[];
        if (existingIndex >= 0) {
          newItems = [...items];
          newItems[existingIndex].quantity += item.quantity;
        } else {
          newItems = [...items, item];
        }
        Taro.setStorageSync('cartItems', newItems);
        set({ items: newItems });
      },

      removeFromCart: (dishId) => {
        const newItems = get().items.filter((i) => i.dishId !== dishId);
        Taro.setStorageSync('cartItems', newItems);
        set({ items: newItems });
      },

      updateQuantity: (dishId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(dishId);
          return;
        }
        const newItems = get().items.map((item) =>
          item.dishId === dishId ? { ...item, quantity } : item
        );
        Taro.setStorageSync('cartItems', newItems);
        set({ items: newItems });
      },

      clearCart: () => {
        Taro.removeStorageSync('cartItems');
        set({ items: [] });
      },

      setCart: (items) => {
        Taro.setStorageSync('cartItems', items);
        set({ items });
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

// 计算属性的 hook
export const useCart = () => {
  const store = useCartStore();
  const totalCount = store.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = store.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { ...store, totalCount, totalAmount };
};
