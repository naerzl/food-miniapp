# 轻食 App 整体架构

## 目标

「轻食」是家庭点菜系统的客人端微信小程序，只覆盖客人模块。厨师端已由 `food-web` 实现，后端由 `food-service` 提供 NestJS API。

## 架构选型

| 层级 | 技术 | 说明 |
| --- | --- | --- |
| 小程序框架 | Taro 4 + React 18 | 优先输出微信小程序 |
| 语言 | TypeScript | 统一领域类型和接口类型 |
| 构建 | Taro Vite Runner | 与 Taro 4 生态保持一致 |
| 本地状态 | Zustand | 购物车、登录态、本地 UI 状态 |
| 服务端状态 | TanStack Query v5 | 菜单、订单、统计等远程数据缓存和刷新 |
| 网络层 | taro-axios + Taro API | 统一 token、错误提示、后端响应包装 |
| 样式 | Tailwind + SCSS | 快速构建小程序界面，保留局部样式能力 |

## 运行时结构

```text
微信小程序
  ├─ Taro App
  │  ├─ QueryClientProvider
  │  ├─ Auth Store
  │  └─ Cart Store
  ├─ Pages
  │  ├─ menu          今日菜单
  │  ├─ cart          购物车
  │  ├─ confirm       确认订单
  │  ├─ orders        订单列表
  │  ├─ order-detail  订单详情
  │  └─ profile       个人中心
  └─ Services
     ├─ auth
     ├─ category
     ├─ dish
     ├─ order
     └─ statistics
```

## 页面与接口映射

| 页面 | 核心能力 | 后端接口 |
| --- | --- | --- |
| 菜单 | 分类筛选、今日供应、售罄态、加入购物车 | `GET /api/categories`, `GET /api/dishes/today` |
| 购物车 | 数量调整、删除、金额汇总 | 本地 Zustand |
| 确认订单 | 备注、提交订单 | `POST /api/orders` |
| 订单详情 | 虚拟支付、取消、状态查看 | `GET /api/orders/{id}`, `POST /api/orders/{id}/pay`, `POST /api/orders/{id}/cancel` |
| 订单列表 | 历史订单、下拉刷新 | `GET /api/orders` |
| 我的 | 用户信息、消费统计、最爱菜品 | `GET /api/users/profile`, `GET /api/statistics/my` |

## 模块边界

- `src/services/` 只封装接口，不保存页面状态。
- `src/store/` 只保存跨页面本地状态。
- `src/pages/guest/` 承载页面组合和交互流程。
- `src/components/` 放跨页面复用组件，不绑定具体接口。
- `types/` 放与后端契约一致的领域类型。

## 阶段计划

1. 项目基线：从 `food-miniapp` 迁移 Taro 4 客人端到 `food-app`。
2. 基础设施：项目命名、架构文档、请求层、Query Client、开发命令。
3. 客人主流程：菜单、购物车、确认订单、虚拟支付、订单详情。
4. 个人中心：消费统计、订单入口、用户信息。
5. 体验完善：加载态、空态、错误态、售罄态、禁用用户态。
6. 验证交付：类型检查、微信小程序构建、开发者工具真机冒烟。
