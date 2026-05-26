# 小程序接口完善实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 对照后端实际接口，补全小程序客人端缺失的 service 定义，重构命名规范，修复 WebSocket，增强页面功能。

**Architecture:** 新增 statistics/file service 文件，重构现有 xxxApi 对象为 req+Method 独立函数，修复 WebSocket 订阅逻辑，增强个人中心和订单列表页面。

**Tech Stack:** Taro 4.x, React, TypeScript, Zustand, Tailwind CSS, taro-axios

---

## File Structure

| 操作 | 文件 | 职责 |
|------|------|------|
| Create | `src/services/statistics.ts` | 统计接口（reqGetMyStats, reqGetUserStats） |
| Create | `src/services/file.ts` | 文件上传接口（reqPostCheckFile 等） |
| Modify | `src/services/auth.ts` | 重构为 req+Method 命名 |
| Modify | `src/services/order.ts` | 重构命名 + 新增 reqGetLatestOrder + 修复 filterOrders 参数 |
| Modify | `src/services/dish.ts` | 重构为 req+Method 命名 |
| Modify | `src/services/category.ts` | 重构命名 + 新增 reqPatchReorderCategories |
| Modify | `src/services/user.ts` | 重构为 req+Method 命名 |
| Modify | `src/services/index.ts` | 更新 re-export 为独立函数 |
| Modify | `src/services/websocket.ts` | 修复房间订阅 + 监听 orderUpdate |
| Modify | `src/pages/guest/profile/index.tsx` | 增加消费统计卡片 + 更新 import |
| Modify | `src/pages/guest/orders/index.tsx` | 下拉刷新 + WebSocket 实时更新 + 更新 import |
| Modify | `src/pages/guest/order-detail/index.tsx` | 更新 import |
| Modify | `src/pages/guest/confirm/index.tsx` | 更新 import |
| Modify | `src/pages/guest/menu/index.tsx` | 更新 import |
| Modify | `src/store/authStore.ts` | 登录时连接 WebSocket，登出时断开 |

---

### Task 1: 重构 auth.ts 为 req+Method 命名

**Files:**
- Modify: `src/services/auth.ts`

- [ ] **Step 1: 重写 auth.ts**

将 `authApi` 对象改为独立导出函数：

```typescript
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
```

- [ ] **Step 2: 提交**

```bash
git add src/services/auth.ts
git commit -m "refactor(services): auth.ts 重构为 req+Method 命名规范"
```

---

### Task 2: 重构 user.ts 为 req+Method 命名

**Files:**
- Modify: `src/services/user.ts`

- [ ] **Step 1: 重写 user.ts**

```typescript
import { request } from './request'
import { ApiResponse, ApiListResponse } from '../../types/common'
import { User, UpdateUserDto } from '../../types/user'

export const reqGetProfile = () =>
  request<ApiResponse<User>>({
    url: '/api/users/profile',
    method: 'GET',
  }).then(res => res.data)

export const reqGetUsers = (page = 1, limit = 20) =>
  request<ApiListResponse<User>>({
    url: '/api/users',
    method: 'GET',
    data: { page, limit },
  })

export const reqGetUserDetail = (id: string) =>
  request<ApiResponse<User>>({
    url: `/api/users/${id}`,
    method: 'GET',
  }).then(res => res.data)

export const reqPatchUpdateUser = (id: string, data: UpdateUserDto) =>
  request<ApiResponse<User>>({
    url: `/api/users/${id}`,
    method: 'PATCH',
    data,
  }).then(res => res.data)

export const reqDeleteUser = (id: string) =>
  request<void>({
    url: `/api/users/${id}`,
    method: 'DELETE',
  })
```

- [ ] **Step 2: 提交**

```bash
git add src/services/user.ts
git commit -m "refactor(services): user.ts 重构为 req+Method 命名规范"
```

---

### Task 3: 重构 dish.ts 为 req+Method 命名

**Files:**
- Modify: `src/services/dish.ts`

- [ ] **Step 1: 重写 dish.ts**

```typescript
import { request } from './request'
import { ApiResponse } from '../../types/common'
import { Dish, CreateDishDto, UpdateDishDto, BatchTodaySupplyDto, BatchSoldOutDto, BatchAvailableDto } from '../../types/dish'

export const reqGetDishes = (categoryId?: string) =>
  request<ApiResponse<Dish[]>>({
    url: '/api/dishes',
    method: 'GET',
    data: categoryId ? { categoryId } : undefined,
  }).then(res => res.data)

export const reqGetTodayDishes = () =>
  request<ApiResponse<Dish[]>>({
    url: '/api/dishes/today',
    method: 'GET',
  }).then(res => res.data)

export const reqGetDishDetail = (id: string) =>
  request<ApiResponse<Dish>>({
    url: `/api/dishes/${id}`,
    method: 'GET',
  }).then(res => res.data)

export const reqPostCreateDish = (data: CreateDishDto) =>
  request<ApiResponse<Dish>>({
    url: '/api/dishes',
    method: 'POST',
    data,
  }).then(res => res.data)

export const reqPatchUpdateDish = (id: string, data: UpdateDishDto) =>
  request<ApiResponse<Dish>>({
    url: `/api/dishes/${id}`,
    method: 'PATCH',
    data,
  }).then(res => res.data)

export const reqDeleteDish = (id: string) =>
  request<void>({
    url: `/api/dishes/${id}`,
    method: 'DELETE',
  })

export const reqPatchSoldOut = (id: string, soldOut: boolean) =>
  request<ApiResponse<Dish>>({
    url: `/api/dishes/${id}/sold-out`,
    method: 'PATCH',
    data: { soldOut },
  }).then(res => res.data)

export const reqPatchTodaySupply = (id: string, todaySupply: boolean) =>
  request<ApiResponse<Dish>>({
    url: `/api/dishes/${id}/today-supply`,
    method: 'PATCH',
    data: { todaySupply },
  }).then(res => res.data)

export const reqPostBatchTodaySupply = (data: BatchTodaySupplyDto) =>
  request<ApiResponse<{ success: boolean; updatedCount: number; message: string }>>({
    url: '/api/dishes/batch/today-supply',
    method: 'POST',
    data,
  }).then(res => res.data)

export const reqPostBatchSoldOut = (data: BatchSoldOutDto) =>
  request<ApiResponse<{ success: boolean; updatedCount: number; message: string }>>({
    url: '/api/dishes/batch/sold-out',
    method: 'POST',
    data,
  }).then(res => res.data)

export const reqPostBatchAvailable = (data: BatchAvailableDto) =>
  request<ApiResponse<{ success: boolean; updatedCount: number; message: string }>>({
    url: '/api/dishes/batch/available',
    method: 'POST',
    data,
  }).then(res => res.data)
```

- [ ] **Step 2: 提交**

```bash
git add src/services/dish.ts
git commit -m "refactor(services): dish.ts 重构为 req+Method 命名规范"
```

---

### Task 4: 重构 category.ts + 新增 reorder 接口

**Files:**
- Modify: `src/services/category.ts`

- [ ] **Step 1: 重写 category.ts**

```typescript
import { request } from './request'
import { ApiResponse } from '../../types/common'
import { Category, CreateCategoryDto, UpdateCategoryDto } from '../../types/category'

export const reqGetCategories = () =>
  request<ApiResponse<Category[]>>({
    url: '/api/categories',
    method: 'GET',
  }).then(res => res.data)

export const reqGetCategoryDetail = (id: string) =>
  request<ApiResponse<Category>>({
    url: `/api/categories/${id}`,
    method: 'GET',
  }).then(res => res.data)

export const reqPostCreateCategory = (data: CreateCategoryDto) =>
  request<ApiResponse<Category>>({
    url: '/api/categories',
    method: 'POST',
    data,
  }).then(res => res.data)

export const reqPatchUpdateCategory = (id: string, data: UpdateCategoryDto) =>
  request<ApiResponse<Category>>({
    url: `/api/categories/${id}`,
    method: 'PATCH',
    data,
  }).then(res => res.data)

export const reqDeleteCategory = (id: string) =>
  request<void>({
    url: `/api/categories/${id}`,
    method: 'DELETE',
  })

export const reqPatchReorderCategories = (items: { id: string; sortOrder: number }[]) =>
  request<ApiResponse<Category[]>>({
    url: '/api/categories/reorder',
    method: 'PATCH',
    data: { items },
  }).then(res => res.data)
```

- [ ] **Step 2: 提交**

```bash
git add src/services/category.ts
git commit -m "refactor(services): category.ts 重构为 req+Method 命名 + 新增 reorder 接口"
```

---

### Task 5: 重构 order.ts + 新增 latestOrder + 修复 filterOrders

**Files:**
- Modify: `src/services/order.ts`

- [ ] **Step 1: 重写 order.ts**

```typescript
import { request } from './request'
import { ApiResponse } from '../types/common'
import { Order, CreateOrderDto, UpdateOrderDto, OrderFilterParams, PaginatedOrders } from '../types/order'

export const reqPostCreateOrder = (data: CreateOrderDto) =>
  request<ApiResponse<Order>>({
    url: '/api/orders',
    method: 'POST',
    data,
  }).then(res => res.data)

export const reqGetOrders = (status?: string, page = 1, limit = 20) =>
  request<ApiResponse<PaginatedOrders>>({
    url: '/api/orders',
    method: 'GET',
    data: { status, page, limit },
  }).then(res => res.data)

export const reqGetOrderDetail = (id: string) =>
  request<ApiResponse<Order>>({
    url: `/api/orders/${id}`,
    method: 'GET',
  }).then(res => res.data)

export const reqPostPayOrder = (id: string) =>
  request<ApiResponse<Order>>({
    url: `/api/orders/${id}/pay`,
    method: 'POST',
  }).then(res => res.data)

export const reqPostCancelOrder = (id: string) =>
  request<ApiResponse<Order>>({
    url: `/api/orders/${id}/cancel`,
    method: 'POST',
  }).then(res => res.data)

export const reqPatchUpdateOrder = (id: string, data: UpdateOrderDto) =>
  request<ApiResponse<Order>>({
    url: `/api/orders/${id}`,
    method: 'PATCH',
    data,
  }).then(res => res.data)

export const reqPatchOrderStatus = (id: string, status: string) =>
  request<ApiResponse<Order>>({
    url: `/api/orders/${id}/status`,
    method: 'PATCH',
    data: { status },
  }).then(res => res.data)

export const reqGetFilterOrders = (params: OrderFilterParams) =>
  request<ApiResponse<PaginatedOrders>>({
    url: '/api/orders/filter',
    method: 'GET',
    data: params,
  }).then(res => res.data)

export const reqGetLatestOrder = () =>
  request<ApiResponse<Order>>({
    url: '/api/orders/latest',
    method: 'GET',
  }).then(res => res.data)
```

- [ ] **Step 2: 修复 OrderFilterParams 类型**

在 `src/types/order.ts` 中，将 `OrderFilterParams` 的 `status` 改为 `statuses: OrderStatus[]`，`limit` 改为 `pageSize`：

```typescript
export interface OrderFilterParams {
  statuses?: OrderStatus[]
  dateRange?: string
  startDate?: string
  endDate?: string
  userId?: string
  orderNo?: string
  minAmount?: number
  maxAmount?: number
  sortBy?: string
  page?: number
  pageSize?: number
}
```

- [ ] **Step 3: 提交**

```bash
git add src/services/order.ts src/types/order.ts
git commit -m "refactor(services): order.ts 重构为 req+Method 命名 + 新增 latestOrder + 修复 filterOrders 参数"
```

---

### Task 6: 新增 statistics.ts

**Files:**
- Create: `src/services/statistics.ts`

- [ ] **Step 1: 创建 statistics.ts**

```typescript
import { request } from './request'

export interface IFavoriteDishItem {
  name: string
  count: number
}

export interface IResGetMyStatsResponse {
  totalSpent: number
  totalOrders: number
  monthlySpent: number
  monthlyOrders: number
  monthlyGrowth?: number
  favoriteDish?: IFavoriteDishItem
}

export const reqGetMyStats = () =>
  request<{ code: number; message: string; data: IResGetMyStatsResponse }>({
    url: '/api/statistics/my',
    method: 'GET',
  }).then(res => res.data)

export const reqGetUserStats = (userId: string) =>
  request<{ code: number; message: string; data: IResGetMyStatsResponse }>({
    url: `/api/statistics/users/${userId}`,
    method: 'GET',
  }).then(res => res.data)
```

- [ ] **Step 2: 提交**

```bash
git add src/services/statistics.ts
git commit -m "feat(services): 新增 statistics.ts 统计接口"
```

---

### Task 7: 新增 file.ts

**Files:**
- Create: `src/services/file.ts`

- [ ] **Step 1: 创建 file.ts**

```typescript
import { request } from './request'

export interface IReqGetPresignedUrlParams {
  md5: string
  filename: string
  contentType: string
  folder?: string
}

export interface IReqConfirmUploadParams {
  md5: string
  filename: string
  contentType: string
  size: number
  folder?: string
}

export interface IResCheckFileResponse {
  exists: boolean
  url?: string
}

export interface IResGetPresignedUrlResponse {
  uploadUrl: string
  fileUrl: string
}

export interface IResConfirmUploadResponse {
  id: string
  url: string
  filename: string
  contentType: string
  size: number
}

export const reqPostCheckFile = (md5: string) =>
  request<{ code: number; message: string; data: IResCheckFileResponse }>({
    url: '/api/files/check',
    method: 'POST',
    data: { md5 },
  }).then(res => res.data)

export const reqPostPresignedUrl = (data: IReqGetPresignedUrlParams) =>
  request<{ code: number; message: string; data: IResGetPresignedUrlResponse }>({
    url: '/api/files/presigned-url',
    method: 'POST',
    data,
  }).then(res => res.data)

export const reqPostConfirmUpload = (data: IReqConfirmUploadParams) =>
  request<{ code: number; message: string; data: IResConfirmUploadResponse }>({
    url: '/api/files/confirm',
    method: 'POST',
    data,
  }).then(res => res.data)

export const reqPostReleaseFile = (fileId: string) =>
  request<void>({
    url: '/api/files/release',
    method: 'POST',
    data: { fileId },
  })
```

- [ ] **Step 2: 提交**

```bash
git add src/services/file.ts
git commit -m "feat(services): 新增 file.ts 文件上传接口"
```

---

### Task 8: 更新 services/index.ts

**Files:**
- Modify: `src/services/index.ts`

- [ ] **Step 1: 重写 index.ts**

```typescript
export { reqPostLogin, reqPostWechatLogin, reqPostRegister } from './auth'
export { reqGetProfile, reqGetUsers, reqGetUserDetail, reqPatchUpdateUser, reqDeleteUser } from './user'
export { reqGetCategories, reqGetCategoryDetail, reqPostCreateCategory, reqPatchUpdateCategory, reqDeleteCategory, reqPatchReorderCategories } from './category'
export { reqGetDishes, reqGetTodayDishes, reqGetDishDetail, reqPostCreateDish, reqPatchUpdateDish, reqDeleteDish, reqPatchSoldOut, reqPatchTodaySupply, reqPostBatchTodaySupply, reqPostBatchSoldOut, reqPostBatchAvailable } from './dish'
export { reqPostCreateOrder, reqGetOrders, reqGetOrderDetail, reqPostPayOrder, reqPostCancelOrder, reqPatchUpdateOrder, reqPatchOrderStatus, reqGetFilterOrders, reqGetLatestOrder } from './order'
export { reqGetMyStats, reqGetUserStats } from './statistics'
export { reqPostCheckFile, reqPostPresignedUrl, reqPostConfirmUpload, reqPostReleaseFile } from './file'
export { connectWebSocket, disconnectWebSocket, subscribeNewOrder, isWebSocketConnected } from './websocket'
```

- [ ] **Step 2: 提交**

```bash
git add src/services/index.ts
git commit -m "refactor(services): index.ts 更新为 req+Method 函数导出"
```

---

### Task 9: 更新所有页面的 import 和 API 调用

**Files:**
- Modify: `src/pages/guest/menu/index.tsx`
- Modify: `src/pages/guest/confirm/index.tsx`
- Modify: `src/pages/guest/orders/index.tsx`
- Modify: `src/pages/guest/order-detail/index.tsx`
- Modify: `src/pages/guest/profile/index.tsx`

- [ ] **Step 1: 更新 menu/index.tsx**

替换 import 和调用：

```typescript
// 旧
import { dishApi, categoryApi } from '../../../services'
// 新
import { reqGetTodayDishes, reqGetCategories } from '../../../services'
```

调用替换：
- `categoryApi.getCategories()` → `reqGetCategories()`
- `dishApi.getTodayDishes()` → `reqGetTodayDishes()`

- [ ] **Step 2: 更新 confirm/index.tsx**

```typescript
// 旧
import { orderApi } from '../../../services'
// 新
import { reqPostCreateOrder } from '../../../services'
```

调用替换：
- `orderApi.createOrder(...)` → `reqPostCreateOrder(...)`

- [ ] **Step 3: 更新 orders/index.tsx**

```typescript
// 旧
import { orderApi } from '../../../services'
// 新
import { reqGetOrders } from '../../../services'
```

调用替换：
- `orderApi.getOrders(...)` → `reqGetOrders(...)`

- [ ] **Step 4: 更新 order-detail/index.tsx**

```typescript
// 旧
import { orderApi } from '../../../services'
// 新
import { reqGetOrderDetail, reqPostPayOrder, reqPostCancelOrder } from '../../../services'
```

调用替换：
- `orderApi.getOrderById(...)` → `reqGetOrderDetail(...)`
- `orderApi.payOrder(...)` → `reqPostPayOrder(...)`
- `orderApi.cancelOrder(...)` → `reqPostCancelOrder(...)`

- [ ] **Step 5: 更新 profile/index.tsx**

```typescript
// 旧
import { userApi, authApi } from '../../../services'
// 新
import { reqGetProfile, reqPostWechatLogin } from '../../../services'
```

调用替换：
- `userApi.getProfile()` → `reqGetProfile()`
- `authApi.wechatLogin(...)` → `reqPostWechatLogin(...)`

- [ ] **Step 6: 提交**

```bash
git add src/pages/guest/menu/index.tsx src/pages/guest/confirm/index.tsx src/pages/guest/orders/index.tsx src/pages/guest/order-detail/index.tsx src/pages/guest/profile/index.tsx
git commit -m "refactor(pages): 所有页面更新为 req+Method API 调用"
```

---

### Task 10: 修复 WebSocket 订阅逻辑

**Files:**
- Modify: `src/services/websocket.ts`

- [ ] **Step 1: 重写 websocket.ts**

核心修改：
1. 移除硬编码 `joinRoom('merchants')`
2. `connectWebSocket` 接收 `userId` 参数，加入 `order:user_{userId}` 房间
3. 监听 `orderUpdate` 事件
4. 增加 `orderUpdateCallbacks` 回调列表

```typescript
import Taro from '@tarojs/taro'
import { getBaseUrl } from './request'

let socket: Taro.SocketTask | null = null
let isConnected = false
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_INTERVAL = 5000

type OrderCallback = (order: any) => void
const orderCallbacks: OrderCallback[] = []
const orderUpdateCallbacks: OrderCallback[] = []

let currentUserId: string | null = null

export function connectWebSocket(userId: string): Promise<void> {
  currentUserId = userId
  return new Promise((resolve, reject) => {
    if (isConnected) {
      resolve()
      return
    }

    const baseUrl = getBaseUrl()
    const wsUrl = baseUrl.replace(/^http/, 'ws') + '/ws'

    try {
      socket = Taro.connectSocket({
        url: wsUrl,
        success: () => {
          console.log('WebSocket 连接成功')
          isConnected = true
          reconnectAttempts = 0
          setupSocketListeners()
          resolve()
        },
        fail: (err) => {
          console.error('WebSocket 连接失败:', err)
          isConnected = false
          reject(err)
        }
      })
    } catch (error) {
      console.error('WebSocket 连接异常:', error)
      reject(error)
    }
  })
}

function setupSocketListeners() {
  if (!socket) return

  socket.onOpen(() => {
    console.log('WebSocket 已打开')
    isConnected = true
    reconnectAttempts = 0
    if (currentUserId) {
      sendMessage('joinRoom', `order:user_${currentUserId}`)
    }
  })

  socket.onMessage((res) => {
    try {
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
      console.log('WebSocket 收到消息:', data)

      if (data.type === 'newOrder' || data.event === 'newOrder') {
        const order = data.order || data.data
        orderCallbacks.forEach(cb => cb(order))
      }

      if (data.type === 'orderUpdate' || data.event === 'orderUpdate') {
        const order = data.order || data.data
        orderUpdateCallbacks.forEach(cb => cb(order))
      }
    } catch (error) {
      console.error('解析 WebSocket 消息失败:', error)
    }
  })

  socket.onClose(() => {
    console.log('WebSocket 已关闭')
    isConnected = false
    socket = null
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS && currentUserId) {
      reconnectAttempts++
      console.log(`${RECONNECT_INTERVAL / 1000}秒后尝试重连...`)
      setTimeout(() => {
        connectWebSocket(currentUserId!).catch(console.error)
      }, RECONNECT_INTERVAL)
    }
  })

  socket.onError((err) => {
    console.error('WebSocket 错误:', err)
    isConnected = false
  })
}

function sendMessage(event: string, data: any) {
  if (!socket || !isConnected) {
    console.warn('WebSocket 未连接，无法发送消息')
    return
  }
  const message = JSON.stringify({ event, data })
  socket.send({ data: message })
}

export function disconnectWebSocket() {
  currentUserId = null
  if (socket) {
    socket.close({
      success: () => {
        console.log('WebSocket 主动关闭')
        isConnected = false
        socket = null
      }
    })
  }
}

export function subscribeNewOrder(callback: OrderCallback) {
  orderCallbacks.push(callback)
  return () => {
    const index = orderCallbacks.indexOf(callback)
    if (index > -1) orderCallbacks.splice(index, 1)
  }
}

export function subscribeOrderUpdate(callback: OrderCallback) {
  orderUpdateCallbacks.push(callback)
  return () => {
    const index = orderUpdateCallbacks.indexOf(callback)
    if (index > -1) orderUpdateCallbacks.splice(index, 1)
  }
}

export function isWebSocketConnected(): boolean {
  return isConnected
}
```

- [ ] **Step 2: 更新 services/index.ts 导出**

在 index.ts 中补充 `subscribeOrderUpdate` 导出（Task 8 已包含，此处确认）。

- [ ] **Step 3: 提交**

```bash
git add src/services/websocket.ts
git commit -m "fix(websocket): 修复房间订阅逻辑，加入客人端房间，监听 orderUpdate 事件"
```

---

### Task 11: authStore 集成 WebSocket 连接/断开

**Files:**
- Modify: `src/store/authStore.ts`

- [ ] **Step 1: 修改 authStore**

在 `login` action 中连接 WebSocket，在 `logout` action 中断开：

```typescript
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import Taro from '@tarojs/taro'
import { connectWebSocket, disconnectWebSocket } from '../services/websocket'

interface UserInfo {
  id: string
  username?: string
  nickname?: string
  avatar?: string
  role: 'admin' | 'merchant' | 'user'
  status?: string
  openId?: string
}

interface AuthState {
  isLogin: boolean
  token: string | null
  userInfo: UserInfo | null
}

interface AuthActions {
  login: (token: string, userInfo: UserInfo) => void
  logout: () => void
  updateUserInfo: (userInfo: UserInfo) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLogin: false,
      token: null,
      userInfo: null,

      login: (token, userInfo) => {
        Taro.setStorageSync('token', token)
        Taro.setStorageSync('userInfo', userInfo)
        set({ isLogin: true, token, userInfo })
        connectWebSocket(userInfo.id).catch(err => {
          console.error('WebSocket 连接失败:', err)
        })
      },

      logout: () => {
        disconnectWebSocket()
        Taro.removeStorageSync('token')
        Taro.removeStorageSync('userInfo')
        set({ isLogin: false, token: null, userInfo: null })
      },

      updateUserInfo: (userInfo) => {
        Taro.setStorageSync('userInfo', userInfo)
        set({ userInfo })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        userInfo: state.userInfo,
        isLogin: state.isLogin,
      }),
    }
  )
)

export const useAuth = () => {
  const store = useAuthStore()
  return {
    ...store,
    login: (token: string, userInfo: UserInfo) => store.login(token, userInfo),
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/store/authStore.ts
git commit -m "feat(auth): 登录时连接 WebSocket，登出时断开"
```

---

### Task 12: 个人中心增加消费统计卡片

**Files:**
- Modify: `src/pages/guest/profile/index.tsx`

- [ ] **Step 1: 在 profile 页面增加统计卡片**

在用户卡片下方、主菜单上方，增加消费统计区域：

1. 新增 state: `myStats` 和 `statsLoading`
2. 在 `loadUserData` 中并行调用 `reqGetMyStats()`
3. 在用户卡片后渲染统计卡片（4 个指标：累计消费、本月消费、订单总数、最爱菜品）

统计卡片 Tailwind 样式：

```tsx
{/* Stats card */}
{myStats && (
  <View className="bg-[#FFFAF5] mx-4 mt-3 rounded-3xl p-5 shadow-sm">
    <Text className="text-xs text-[#A39584] block mb-3">消费统计</Text>
    <View className="grid grid-cols-3 gap-3">
      <View className="text-center">
        <Text className="text-lg font-bold text-[#E8833A] block">¥{myStats.totalSpent}</Text>
        <Text className="text-xs text-[#A39584] mt-1 block">累计消费</Text>
      </View>
      <View className="text-center">
        <Text className="text-lg font-bold text-[#E8833A] block">¥{myStats.monthlySpent}</Text>
        <Text className="text-xs text-[#A39584] mt-1 block">本月消费</Text>
      </View>
      <View className="text-center">
        <Text className="text-lg font-bold text-[#E8833A] block">{myStats.totalOrders}</Text>
        <Text className="text-xs text-[#A39584] mt-1 block">订单总数</Text>
      </View>
    </View>
    {myStats.favoriteDish && (
      <View className="mt-3 pt-3 border-t border-[#F5E6D3] flex items-center justify-between">
        <Text className="text-xs text-[#A39584]">最爱菜品</Text>
        <View className="flex items-center gap-2">
          <Text className="text-sm font-semibold text-[#4A3728]">{myStats.favoriteDish.name}</Text>
          <Text className="text-xs text-[#E8833A]">×{myStats.favoriteDish.count}</Text>
        </View>
      </View>
    )}
  </View>
)}
```

加载态使用骨架屏：

```tsx
{statsLoading && !myStats && (
  <View className="bg-[#FFFAF5] mx-4 mt-3 rounded-3xl p-5 shadow-sm animate-pulse">
    <View className="h-4 w-16 bg-[#E8DDD0] rounded-lg mb-3" />
    <View className="grid grid-cols-3 gap-3">
      {[1,2,3].map(i => (
        <View key={i} className="text-center">
          <View className="h-6 w-12 bg-[#E8DDD0] rounded-lg mx-auto" />
          <View className="h-3 w-10 bg-[#E8DDD0] rounded-lg mx-auto mt-2" />
        </View>
      ))}
    </View>
  </View>
)}
```

- [ ] **Step 2: 提交**

```bash
git add src/pages/guest/profile/index.tsx
git commit -m "feat(profile): 增加消费统计卡片（累计消费、本月消费、订单总数、最爱菜品）"
```

---

### Task 13: 订单列表增加下拉刷新 + WebSocket 实时更新

**Files:**
- Modify: `src/pages/guest/orders/index.tsx`
- Modify: `src/pages/guest/orders/index.config.ts`

- [ ] **Step 1: 启用下拉刷新**

在 `src/pages/guest/orders/index.config.ts` 中添加：

```typescript
export default definePageConfig({
  navigationBarTitleText: '我的订单',
  enablePullDownRefresh: true,
})
```

- [ ] **Step 2: 在 orders 页面增加下拉刷新和 WebSocket 监听**

1. 使用 `Taro.usePullDownRefresh` 实现下拉刷新
2. 使用 `subscribeOrderUpdate` 监听订单状态变更
3. 收到 `orderUpdate` 时自动刷新列表并显示 Toast

关键代码：

```typescript
import { reqGetOrders } from '../../../services'
import { subscribeOrderUpdate } from '../../../services/websocket'

// 在组件内
Taro.usePullDownRefresh(() => {
  loadOrders(1, true).finally(() => {
    Taro.stopPullDownRefresh()
  })
})

useEffect(() => {
  const unsubscribe = subscribeOrderUpdate((updatedOrder) => {
    Taro.showToast({
      title: `订单状态已更新`,
      icon: 'none',
      duration: 2000,
    })
    loadOrders(1, true)
  })
  return unsubscribe
}, [loadOrders])
```

- [ ] **Step 3: 提交**

```bash
git add src/pages/guest/orders/index.tsx src/pages/guest/orders/index.config.ts
git commit -m "feat(orders): 增加下拉刷新 + WebSocket 订单状态实时更新"
```

---

### Task 14: 编译验证

- [ ] **Step 1: 运行 TypeScript 类型检查**

```bash
npx tsc --noEmit
```

Expected: 无类型错误

- [ ] **Step 2: 运行开发构建**

```bash
pnpm dev:weapp
```

Expected: 编译成功，无错误

- [ ] **Step 3: 修复编译错误（如有）**

根据编译输出修复类型或引用错误。

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "fix: 修复编译错误"
```
