# food-app 项目指南

## 交互语言

请始终使用中文进行对话、问答和项目文档编写。

## 项目定位

`food-app` 是「轻食」客人端微信小程序，基于 `D:\code\githup\food\food-miniapp` 的 Taro 4 客人端实现迁移而来。

本仓库只负责客人模块：菜单浏览、购物车、下单、虚拟支付、订单查看、个人中心。厨师端已经由 `D:\code\githup\food\food-web` 承担，不在本仓库新增厨师页面。

## 技术栈

- 框架：Taro 4 + React 18 + TypeScript
- 构建：Taro Vite Runner
- 小程序目标：微信小程序优先
- 本地状态：Zustand
- 服务端状态：TanStack Query
- 请求层：`src/services/request.ts`
- 样式：Tailwind + SCSS

## 相关项目

- 后端：`D:\code\githup\food\food-service`
- 厨师端 Web：`D:\code\githup\food\food-web`
- 迁移来源：`D:\code\githup\food\food-miniapp`
- PRD：`D:\code\githup\food\food-service\docx\PRD.md`

## 开发命令

```bash
pnpm install
pnpm dev:weapp
pnpm build:weapp
pnpm typecheck
```

## 实现约定

- 新页面优先放在 `src/pages/guest/` 下。
- 业务能力按 `auth/menu/cart/order/profile` 组织，避免把接口、页面状态、展示组件混在一起。
- 购物车使用 Zustand，本地持久化；服务端数据优先通过 TanStack Query 查询和失效刷新。
- API 响应遵循后端统一格式：`{ code, message, data }`。
- 微信支付当前暂缓，继续使用 `/api/orders/{id}/pay` 虚拟支付。
- 真实微信能力接入前，不要把 appid、secret、token 等敏感配置写入仓库。
