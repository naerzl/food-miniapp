# API 与类型规范

## API 请求命名

**命名格式**: `req` + `${METHOD}` + 业务语义

```typescript
// src/api/user.ts
import type { UserParams, UserResponse } from '@/types/user'

export const reqGetUserData = (params: UserParams) => { ... }
export const reqPostLogin = (payload: LoginPayload) => { ... }
export const reqPutProfile = (id: number, payload: ProfilePayload) => { ... }
export const reqDeleteItem = (id: number) => { ... }
```

## 类型定义规范

### 存放位置

| 存放位置 | 适用场景 | 示例 |
|----------|----------|------|
| `src/types/index.ts` | 全局通用类型 | `IAxiosResponse` |
| `src/types/[feature].ts` | 某个 API 模块的请求/响应类型，与 `src/api/[feature].ts` 一一对应 | `IReqXxxParams`, `IResXxxData` |
| `src/pages/xxx/types.ts` | 页面私有类型（非共享） | 页面级 UI 状态类型 |

### 命名规范

```
请求类型：IReq + 业务语义 + Params
响应类型：IRes + 业务语义 + Response
实体类型：I + 业务语义 + Item/Entity
枚举类型：E + 业务语义（用于 status、type 等字段）
```

### 类型定义示例

```ts
// src/types/models.ts - 类型与 API 模块一一对应
export interface IReqModelsParams {
  page?: number
  page_size?: number
}

export interface IResModelsListResponse {
  list: IModelItem[]
  total: number
}

export interface IModelItem {
  id: number
  name: string
  status: string
}

// src/api/models.ts - Axios 函数使用类型约束
import request from '@/api/request'
import type { IReqModelsParams, IResModelsListResponse } from '@/types/models'

export const reqGetModels = (params?: IReqModelsParams) =>
  request.get<IResModelsListResponse>('/models/list', { params })
```

## API 模块结构规范

每个 API 模块按以下结构组织，**API 函数与类型定义一一对应、分开存放**：

```
src/api/
├── request.ts              # Axios 实例和拦截器（已有）
├── endpoints.ts            # API 端点路径常量（已有）
├── codingPlan.ts           # API 函数
└── [feature].ts            # 按业务域命名，与 src/types/ 一一对应

src/types/
├── index.ts                # 全局通用类型
├── codingPlan.ts           # 与 src/api/codingPlan.ts 一一对应
└── [feature].ts            # 类型定义与 API 模块一一对应
```

### 新增 API 模块检查清单

```
□ API 函数命名遵循 req + Method + 业务语义
□ 类型文件在 src/types/ 下与 src/api/ 模块名一一对应
□ 请求类型以 IReq 开头、Params 结尾
□ 响应类型以 IRes 开头、Response 结尾
□ 实体类型以 I 开头、Item 或 Entity 结尾
□ API 函数使用对应的类型约束参数和返回值
```

## 数据解构注意事项

Axios 响应拦截器返回 `response.data`（剥离 HTTP 层），组件中访问业务数据时注意：

- `/maas/` 路径响应格式：`{ code, data, msg }`
- `/api/` 代理路径响应格式：`{ status, message, result }`
- 访问数据时需要通过 `result` 字段：如 `(res as any)?.result?.data`
