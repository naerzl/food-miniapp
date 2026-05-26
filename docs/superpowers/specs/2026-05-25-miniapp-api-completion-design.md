# 小程序接口完善设计

## 背景

后端 food-service 已有完整的 API（45个端点），小程序 service 层存在缺失和参数不匹配问题。本次完善目标是对照后端实际接口，补全客人端（Guest）所需的 service 定义和页面功能。

**项目范围**：仅客人端，不做管理端页面（依据 `.claude/rules/project-scope.md`）。

## 后端接口验证

所有接口已通过 `localhost:18321` 实际调用验证，响应格式以实际返回为准。

## 一、新增 Service 文件

> **命名规范**：按 `api-and-types.md`，请求函数命名为 `req` + `${METHOD}` + 业务语义。所有 service（包括新增和现有）统一采用此规范，消除 `xxxApi` 对象风格的不一致性。

### 1. `src/services/statistics.ts`

客人端统计接口：

| 方法 | 路径 | 说明 |
|------|------|------|
| `reqGetMyStats()` | `GET /api/statistics/my` | 获取当前用户消费统计 |

响应类型 `IResGetMyStatsResponse`：
```typescript
interface IResGetMyStatsResponse {
  totalSpent: number        // 累计消费
  totalOrders: number       // 累计订单数
  monthlySpent: number      // 本月消费
  monthlyOrders: number     // 本月订单数
  monthlyGrowth?: number    // 月环比增长率
  favoriteDish?: {
    name: string
    count: number
  }
}
```

备用接口（暂不在页面使用）：
| `reqGetUserStats(userId)` | `GET /api/statistics/users/:id` | 查看指定用户统计 |

### 2. `src/services/file.ts`

文件上传全流程接口：

| 方法 | 路径 | 说明 |
|------|------|------|
| `reqPostCheckFile(md5)` | `POST /api/files/check` | 检查文件是否已存在（秒传） |
| `reqPostPresignedUrl(data)` | `POST /api/files/presigned-url` | 获取预签名上传地址 |
| `reqPostConfirmUpload(data)` | `POST /api/files/confirm` | 确认上传完成 |
| `reqPostReleaseFile(fileId)` | `POST /api/files/release` | 释放未确认的文件 |

请求类型：
```typescript
interface IReqGetPresignedUrlParams {
  md5: string
  filename: string
  contentType: string
  folder?: string
}

interface IReqConfirmUploadParams {
  md5: string
  filename: string
  contentType: string
  size: number
  folder?: string
}
```

响应类型：
```typescript
interface IResCheckFileResponse {
  exists: boolean
  url?: string      // 已存在时返回文件URL
}

interface IResGetPresignedUrlResponse {
  uploadUrl: string  // 预签名上传地址
  fileUrl: string    // 上传成功后的文件访问URL
}

interface IResConfirmUploadResponse {
  id: string
  url: string
  filename: string
  contentType: string
  size: number
}
```

## 二、补充现有 Service

### `src/services/order.ts`

- 新增 `reqGetLatestOrder()` → `GET /api/orders/latest` — 获取最近一笔订单
- 修复 `filterOrders` 参数：
  - `status` → `statuses: OrderStatus[]`（后端接收数组）
  - `limit` → `pageSize`（后端分页参数名）

修复前：
```typescript
filterOrders(params: { status?: OrderStatus; page?: number; limit?: number })
```

修复后：
```typescript
filterOrders(params: { statuses?: OrderStatus[]; page?: number; pageSize?: number })
```

### `src/services/category.ts`

- 新增 `reqPatchReorderCategories(items: { id: string; sortOrder: number }[])` → `PATCH /api/categories/reorder`

## 三、新增类型定义

在 `src/types/` 下新增文件，按 `api-and-types.md` 规范命名：

- `src/types/statistics.ts` — `IResGetMyStatsResponse`, `IFavoriteDishItem`
- `src/types/file.ts` — `IReqGetPresignedUrlParams`, `IReqConfirmUploadParams`, `IResCheckFileResponse`, `IResGetPresignedUrlResponse`, `IResConfirmUploadResponse`

补充 `src/types/order.ts`：
- `OrderFilterParams.statuses` 改为 `OrderStatus[]`

## 四、WebSocket 修复

`src/services/websocket.ts` 修改：

1. 移除 `joinRoom('merchants')` — 这是管理端房间
2. 登录后根据用户信息加入客人端房间：`joinRoom('order:user_{userId}')`
3. 监听 `orderUpdate` 事件，触发订单列表刷新
4. 登出时断开 WebSocket 连接

## 五、页面增强

### 1. 个人中心 — 消费统计卡片

`src/pages/guest/profile/index.tsx`：

- 页面顶部增加统计卡片区域
- 调用 `statistics/my` 接口
- 展示：累计消费、本月消费、订单总数、最爱菜品
- Tailwind CSS 温暖家庭风设计
- 骨架屏加载态
- 未登录态隐藏

### 2. 订单列表 — 下拉刷新 + 实时更新

`src/pages/guest/orders/index.tsx`：

- 启用 Taro 下拉刷新 `usePullDownRefresh`
- 监听 WebSocket `orderUpdate` 事件自动刷新列表
- 显示订单状态变更的 Toast 提示

## 六、现有 Service 重构

所有现有 `xxxApi` 对象风格改为独立导出函数，方法名遵循 `req + Method + 业务语义` 规范。

### `src/services/auth.ts`

| 原命名 | 新命名 |
|--------|--------|
| `authApi.login()` | `reqPostLogin()` |
| `authApi.register()` | `reqPostRegister()` |
| `authApi.getProfile()` | `reqGetProfile()` |
| `authApi.updateProfile()` | `reqPatchProfile()` |

### `src/services/order.ts`

| 原命名 | 新命名 |
|--------|--------|
| `orderApi.getOrders()` | `reqGetOrders()` |
| `orderApi.getOrderDetail()` | `reqGetOrderDetail()` |
| `orderApi.createOrder()` | `reqPostCreateOrder()` |
| `orderApi.cancelOrder()` | `reqPatchCancelOrder()` |
| `orderApi.filterOrders()` | `reqGetFilterOrders()` |

### `src/services/dish.ts`

| 原命名 | 新命名 |
|--------|--------|
| `dishApi.getDishes()` | `reqGetDishes()` |
| `dishApi.getTodayDishes()` | `reqGetTodayDishes()` |
| `dishApi.getDishDetail()` | `reqGetDishDetail()` |

### `src/services/category.ts`

| 原命名 | 新命名 |
|--------|--------|
| `categoryApi.getCategories()` | `reqGetCategories()` |
| `categoryApi.createCategory()` | `reqPostCreateCategory()` |
| `categoryApi.updateCategory()` | `reqPatchUpdateCategory()` |
| `categoryApi.deleteCategory()` | `reqDeleteCategory()` |

### `src/services/user.ts`

| 原命名 | 新命名 |
|--------|--------|
| `userApi.getUsers()` | `reqGetUsers()` |
| `userApi.getUserDetail()` | `reqGetUserDetail()` |
| `userApi.createUser()` | `reqPostCreateUser()` |
| `userApi.updateUser()` | `reqPatchUpdateUser()` |
| `userApi.deleteUser()` | `reqDeleteUser()` |

### `src/services/index.ts`

- 移除所有 `xxxApi` 对象的 re-export
- 改为 re-export 独立函数
- 同步更新所有页面中的 import 和调用

## 不在范围内

以下内容依据 `project-scope.md` 不在本次范围内：
- 管理端 service（customers、statistics/dashboard、statistics/trends 等）
- 菜品详情页（PRD P1 但本次聚焦接口完善）
- 文件上传页面（头像上传等 UI）
- 客人管理页面
