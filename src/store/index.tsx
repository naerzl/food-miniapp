import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import Taro from '@tarojs/taro';

// ==================== 类型定义 ====================

export interface CartItem {
  dishId: number | string;
  dishName: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface UserInfo {
  id: string;
  username?: string;
  nickname?: string;
  avatar?: string;
  role: 'admin' | 'merchant' | 'user';
  status?: string;
  openId?: string;
}

export interface AuthState {
  isLogin: boolean;
  token: string | null;
  userInfo: UserInfo | null;
  role: 'guest' | 'chef' | null;
}

export interface CartState {
  items: CartItem[];
}

export interface AppState {
  auth: AuthState;
  cart: CartState;
}

// ==================== Action 类型 ====================

type AuthAction =
  | { type: 'LOGIN'; payload: { token: string; userInfo: UserInfo; role: 'guest' | 'chef' } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER_INFO'; payload: UserInfo };

type CartAction =
  | { type: 'ADD_TO_CART'; payload: CartItem }
  | { type: 'REMOVE_FROM_CART'; payload: { dishId: number | string } }
  | { type: 'UPDATE_QUANTITY'; payload: { dishId: number | string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART'; payload: CartItem[] };

type AppAction = AuthAction | CartAction;

// ==================== 初始状态 ====================

const getInitialAuthState = (): AuthState => {
  const token = Taro.getStorageSync('token') || null;
  const userInfo = Taro.getStorageSync('userInfo') || null;
  const role = Taro.getStorageSync('role') || null;
  return {
    isLogin: !!token,
    token,
    userInfo,
    role,
  };
};

const getInitialCartState = (): CartState => {
  const items = Taro.getStorageSync('cartItems') || [];
  return { items };
};

const initialState: AppState = {
  auth: getInitialAuthState(),
  cart: getInitialCartState(),
};

// ==================== Reducer ====================

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      Taro.setStorageSync('token', action.payload.token);
      Taro.setStorageSync('userInfo', action.payload.userInfo);
      Taro.setStorageSync('role', action.payload.role);
      return {
        ...state,
        isLogin: true,
        token: action.payload.token,
        userInfo: action.payload.userInfo,
        role: action.payload.role,
      };
    case 'LOGOUT':
      Taro.removeStorageSync('token');
      Taro.removeStorageSync('userInfo');
      Taro.removeStorageSync('role');
      return {
        ...state,
        isLogin: false,
        token: null,
        userInfo: null,
        role: null,
      };
    case 'UPDATE_USER_INFO':
      Taro.setStorageSync('userInfo', action.payload);
      return {
        ...state,
        userInfo: action.payload,
      };
    default:
      return state;
  }
}

function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState;
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingIndex = state.items.findIndex(
        item => item.dishId === action.payload.dishId
      );
      if (existingIndex >= 0) {
        const newItems = [...state.items];
        newItems[existingIndex].quantity += action.payload.quantity;
        newState = { ...state, items: newItems };
      } else {
        newState = { ...state, items: [...state.items, action.payload] };
      }
      Taro.setStorageSync('cartItems', newState.items);
      return newState;
    case 'REMOVE_FROM_CART':
      newState = {
        ...state,
        items: state.items.filter(item => item.dishId !== action.payload.dishId),
      };
      Taro.setStorageSync('cartItems', newState.items);
      return newState;
    case 'UPDATE_QUANTITY':
      newState = {
        ...state,
        items: state.items.map(item =>
          item.dishId === action.payload.dishId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
      Taro.setStorageSync('cartItems', newState.items);
      return newState;
    case 'CLEAR_CART':
      Taro.removeStorageSync('cartItems');
      return { ...state, items: [] };
    case 'SET_CART':
      Taro.setStorageSync('cartItems', action.payload);
      return { ...state, items: action.payload };
    default:
      return state;
  }
}

function appReducer(state: AppState, action: AppAction): AppState {
  return {
    auth: authReducer(state.auth, action as AuthAction),
    cart: cartReducer(state.cart, action as CartAction),
  };
}

// ==================== Context ====================

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// ==================== Provider ====================

export const AppStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// ==================== Hooks ====================

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppStoreProvider');
  }
  return context.state;
};

export const useAppDispatch = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within AppStoreProvider');
  }
  return context.dispatch;
};

export const useAuth = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  return {
    ...state.auth,
    login: (token: string, userInfo: UserInfo, role: 'guest' | 'chef') => {
      dispatch({ type: 'LOGIN', payload: { token, userInfo, role } });
    },
    logout: () => {
      dispatch({ type: 'LOGOUT' });
    },
    updateUserInfo: (userInfo: UserInfo) => {
      dispatch({ type: 'UPDATE_USER_INFO', payload: userInfo });
    },
  };
};

export const useCart = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const totalCount = state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = state.cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    items: state.cart.items,
    totalCount,
    totalAmount,
    addToCart: (item: CartItem) => {
      dispatch({ type: 'ADD_TO_CART', payload: item });
    },
    removeFromCart: (dishId: number | string) => {
      dispatch({ type: 'REMOVE_FROM_CART', payload: { dishId } });
    },
    updateQuantity: (dishId: number | string, quantity: number) => {
      if (quantity <= 0) {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { dishId } });
      } else {
        dispatch({ type: 'UPDATE_QUANTITY', payload: { dishId, quantity } });
      }
    },
    clearCart: () => {
      dispatch({ type: 'CLEAR_CART' });
    },
    setCart: (items: CartItem[]) => {
      dispatch({ type: 'SET_CART', payload: items });
    },
  };
};
