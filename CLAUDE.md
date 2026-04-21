# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

家庭点菜系统 (Family Ordering System) - A Taro (React) mini-program with two user roles:
- **Guest (客人)**: WeChat mini-program for browsing menu, ordering, and virtual payment
- **Chef (厨师)**: Subpackage for dish management, order processing, and statistics

## Tech Stack

- **Framework**: Taro 4.x (React) with TypeScript
- **State Management**: React Context + useReducer (see `src/store/index.tsx`)
- **API Layer**: Custom request wrapper with interceptors (see `src/services/api.ts`)
- **Styling**: SCSS modules + common styles

## Build Commands

```bash
# Development
npm run dev:weapp    # WeChat mini-program
npm run dev:h5       # H5 web version

# Production build
npm run build:weapp  # WeChat mini-program
npm run build:h5     # H5 web version
```

## Architecture

### Page Structure

```
src/
├── app.config.ts          # Global config: pages, tabBar, subpackages
├── app.tsx                # Root component with AppStoreProvider
├── pages/
│   ├── index/             # Entry/redirect page
│   ├── guest/             # Guest-facing pages (main package, tabBar)
│   │   ├── menu/          # Menu browsing
│   │   ├── cart/          # Shopping cart
│   │   ├── confirm/       # Order confirmation
│   │   ├── orders/        # Order history
│   │   ├── order-detail/  # Order details
│   │   └── profile/       # User profile
│   └── chef/              # Chef pages (subpackage, no tabBar)
│       ├── login/
│       ├── layout/        # Chef layout wrapper
│       ├── dish/          # Dish list
│       ├── dish/edit/     # Dish editor
│       ├── category/      # Category management
│       ├── order/         # Order management
│       ├── customer/      # Customer management
│       └── stat/          # Statistics dashboard
├── components/
│   └── DishCard/          # Shared dish card component
├── services/
│   └── api.ts             # API client with auth interceptors
├── store/
│   └── index.tsx          # Global state: AuthContext, CartContext
└── styles/
    ├── common.scss        # Global styles, Tailwind base
    └── theme.scss         # Theme variables

types/
├── api.ts                 # All API DTOs and domain types
└── global.d.ts            # Taro type extensions
```

### State Management

- `AppStoreProvider` wraps entire app (src/app.tsx)
- `useAuth()` - authentication state and login/logout actions
- `useCart()` - shopping cart with items, totalCount, totalAmount

### API Patterns

- API base URL: `http://localhost:18321` (configurable via `TARO_APP_API_URL`)
- All requests automatically include `Authorization: Bearer {token}` from storage
- 401 responses auto-redirect to index page
- Use named exports: `authApi`, `userApi`, `categoryApi`, `dishApi`, `orderApi`, `statisticsApi`

### Key Types

- `UserRole`: 'admin' | 'merchant' | 'user'
- `OrderStatus`: 'pending_payment' | 'paid' | 'preparing' | 'completed' | 'cancelled'

## Development Notes

- Chef subpackage requires authentication; use `useAuth().role === 'chef'` check
- Guest pages are in main package with tabBar navigation
- All page configs (*.config.ts) control Taro-specific settings (navigation bar, etc.)

### Git 提交规范
使用中文提交信息，格式：`{类型}: {描述}`

| 类型 | 说明 |
|------|------|
| feat | 新功能 |
| fix | 修复bug |
| docs | 文档变更 |
| style | 代码格式（不影响功能） |
| refactor | 重构（不是bug修复） |
| test | 测试相关 |
| chore | 构建/工具变更 |

示例：
```bash
git commit -m "docs: 添加产品需求文档"
git commit -m "feat(auth): 增加微信登录功能"
git commit -m "fix(order): 修复订单状态流转问题"
```
