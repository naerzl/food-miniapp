# food-miniapp Project Guide


## 交互语言要求

**重要提示：** 请始终使用**中文**进行对话、问答以及文档编写。


## Project Overview
This is a Taro (React) WeChat miniapp for a family ordering system.

## Architecture
- **Framework**: Taro 4.x with React
- **State Management**: Zustand in `src/store/`
- **API Layer**: Taro-axios in `src/services/`
- **Styling**: SCSS modules in `src/styles/`
- **Components**: Shared components in `src/components/`

## Key Files
- `src/app.config.ts` - App configuration
- `src/app.tsx` - App entry
- `src/services/api.ts` - API service layer

## User Roles
- **Guest** (客人): Uses pages in `src/pages/guest/`
- **Chef** (厨师): Uses pages in `src/pages/chef/`

## Development
```bash
pnpm dev:weapp  # Start development
pnpm build:weapp  # Build for production
```

## Important Patterns
- Use Taro's API for navigation: `Taro.navigateTo()`, `Taro.switchTab()`
- Use `useCallback` and `useMemo` for performance
- Follow existing SCSS patterns with theme variables

## Context
- PRD Document: `D:\code\github\food\food-service\docx`
- Backend API: `D:\code\github\food\food-service`
- Related projects: `food-service` (backend), `food-web` (admin panel)
