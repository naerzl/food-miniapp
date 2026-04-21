# 家庭点菜系统 - 客人端 UI 重设计实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将客人端 6 个页面（菜单、购物车、确认订单、订单列表、订单详情、个人中心）从当前样式重构为温暖家庭风 UI 设计

**Architecture:** 更新 SCSS 主题变量统一色彩规范，逐页面修改组件样式文件，保持功能逻辑不变，仅调整视觉呈现

**Tech Stack:** Taro + React + SCSS + Taro UI

---

## 文件结构

| 文件 | 职责 |
|------|------|
| `src/styles/theme.scss` | 主题变量：色彩、间距、圆角、阴影 |
| `src/styles/common.scss` | 全局样式、按钮、输入框、空状态 |
| `src/components/DishCard.scss` | 菜品卡片组件样式 |
| `src/components/DishCard.tsx` | 菜品卡片组件（仅样式调整） |
| `src/pages/guest/menu/index.scss` | 菜单页样式 |
| `src/pages/guest/menu/index.tsx` | 菜单页（结构已有，调整样式类名） |
| `src/pages/guest/cart/index.scss` | 购物车页样式 |
| `src/pages/guest/cart/index.tsx` | 购物车页（结构已有） |
| `src/pages/guest/confirm/index.scss` | 确认订单页样式 |
| `src/pages/guest/confirm/index.tsx` | 确认订单页（结构已有） |
| `src/pages/guest/orders/index.scss` | 订单列表页样式 |
| `src/pages/guest/orders/index.tsx` | 订单列表页（结构已有） |
| `src/pages/guest/order-detail/index.scss` | 订单详情页样式 |
| `src/pages/guest/order-detail/index.tsx` | 订单详情页（结构已有） |
| `src/pages/guest/profile/index.scss` | 个人中心页样式 |
| `src/pages/guest/profile/index.tsx` | 个人中心页（结构已有） |

---

## 任务清单

### Task 1: 更新主题变量

**Files:**
- Modify: `src/styles/theme.scss`

- [ ] **Step 1: 备份并更新主题变量**

替换 `theme.scss` 中的色彩变量为温暖家庭风配色：

```scss
// ==================== 主色调（温暖家庭风）====================
$primary: #FF8C42;           // 主色：活力暖橙
$primary-light: #FF9E6B;     // 浅主色
$primary-dark: #E5753A;      // 深主色，用于hover/按下状态
$primary-bg: #FFF5EE;        // 主色浅背景

// ==================== 背景色 ====================
$bg-color: #FFF9F5;          // 页面背景 - 暖白色
$bg-color-light: #FFFFFF;    // 卡片背景 - 纯白
$bg-color-warm: #FFF7F0;     // 暖色背景
```

- [ ] **Step 2: 验证变量更新**

确认所有颜色变量已更新，无遗漏

- [ ] **Step 3: 提交**

```bash
git add src/styles/theme.scss
git commit -m "style(theme): 更新主题色为温暖家庭风"
```

---

### Task 2: 更新全局样式

**Files:**
- Modify: `src/styles/common.scss`

- [ ] **Step 1: 更新全局样式**

更新 `common.scss` 中的全局样式、按钮样式、空状态样式

- [ ] **Step 2: 提交**

```bash
git add src/styles/common.scss
git commit -m "style: 更新全局样式适配温暖家庭风"
```

---

### Task 3: 更新菜品卡片组件

**Files:**
- Modify: `src/components/DishCard.scss`
- Modify: `src/components/DishCard.tsx`

- [ ] **Step 1: 更新 DishCard 样式**

根据设计规范更新 `DishCard.scss`，包括：
- 卡片圆角 `16rpx`
- 卡片阴影
- 价格颜色 `#FF8C42`
- 按钮样式

- [ ] **Step 2: 检查组件结构**

确认 `DishCard.tsx` 结构无需调整

- [ ] **Step 3: 提交**

```bash
git add src/components/DishCard.scss src/components/DishCard.tsx
git commit -m "style(DishCard): 更新菜品卡片为温暖家庭风"
```

---

### Task 4: 更新菜单页样式

**Files:**
- Modify: `src/pages/guest/menu/index.scss`
- Modify: `src/pages/guest/menu/index.tsx`

- [ ] **Step 1: 更新菜单页样式**

更新 `menu/index.scss`：
- 分类标签样式（选中态/未选中态）
- 菜品网格布局
- 购物车悬浮按钮样式
- 空状态样式

- [ ] **Step 2: 检查组件类名**

确认 TSX 中的类名与 SCSS 匹配

- [ ] **Step 3: 提交**

```bash
git add src/pages/guest/menu/index.scss src/pages/guest/menu/index.tsx
git commit -m "style(menu): 更新菜单页为温暖家庭风"
```

---

### Task 5: 更新购物车页样式

**Files:**
- Modify: `src/pages/guest/cart/index.scss`
- Modify: `src/pages/guest/cart/index.tsx`

- [ ] **Step 1: 更新购物车页样式**

更新 `cart/index.scss`：
- 商品项布局（图片、名称、价格、数量调整）
- 结算栏样式（固定底部、按钮样式）
- 空购物车样式

- [ ] **Step 2: 检查组件结构**

- [ ] **Step 3: 提交**

```bash
git add src/pages/guest/cart/index.scss src/pages/guest/cart/index.tsx
git commit -m "style(cart): 更新购物车页为温暖家庭风"
```

---

### Task 6: 更新确认订单页样式

**Files:**
- Modify: `src/pages/guest/confirm/index.scss`
- Modify: `src/pages/guest/confirm/index.tsx`

- [ ] **Step 1: 更新确认订单页样式**

更新 `confirm/index.scss`：
- 订单商品列表样式
- 备注输入框样式
- 提交按钮样式

- [ ] **Step 2: 检查组件结构**

- [ ] **Step 3: 提交**

```bash
git add src/pages/guest/confirm/index.scss src/pages/guest/confirm/index.tsx
git commit -m "style(confirm): 更新确认订单页为温暖家庭风"
```

---

### Task 7: 更新订单列表页样式

**Files:**
- Modify: `src/pages/guest/orders/index.scss`
- Modify: `src/pages/guest/orders/index.tsx`

- [ ] **Step 1: 更新订单列表页样式**

更新 `orders/index.scss`：
- 订单卡片样式（圆角、阴影、内边距）
- 状态标签样式（5种状态对应不同颜色）
- 操作按钮样式

- [ ] **Step 2: 检查组件结构**

- [ ] **Step 3: 提交**

```bash
git add src/pages/guest/orders/index.scss src/pages/guest/orders/index.tsx
git commit -m "style(orders): 更新订单列表页为温暖家庭风"
```

---

### Task 8: 更新订单详情页样式

**Files:**
- Modify: `src/pages/guest/order-detail/index.scss`
- Modify: `src/pages/guest/order-detail/index.tsx`

- [ ] **Step 1: 更新订单详情页样式**

更新 `order-detail/index.scss`：
- 状态展示区样式（大图标）
- 信息卡片样式
- 底部操作按钮样式

- [ ] **Step 2: 检查组件结构**

- [ ] **Step 3: 提交**

```bash
git add src/pages/guest/order-detail/index.scss src/pages/guest/order-detail/index.tsx
git commit -m "style(order-detail): 更新订单详情页为温暖家庭风"
```

---

### Task 9: 更新个人中心页样式

**Files:**
- Modify: `src/pages/guest/profile/index.scss`
- Modify: `src/pages/guest/profile/index.tsx`

- [ ] **Step 1: 更新个人中心页样式**

更新 `profile/index.scss`：
- 用户信息区样式（头像、渐变背景）
- 统计卡片样式（2列网格）
- 最爱菜品展示样式

- [ ] **Step 2: 检查组件结构**

- [ ] **Step 3: 提交**

```bash
git add src/pages/guest/profile/index.scss src/pages/guest/profile/index.tsx
git commit -m "style(profile): 更新个人中心页为温暖家庭风"
```

---

## 自检清单

- [ ] 所有页面色彩变量已更新为主题色 `#FF8C42`
- [ ] 背景色统一为 `#FFF9F5`
- [ ] 卡片圆角统一为 `16rpx`
- [ ] 按钮圆角统一为 `20rpx`
- [ ] 状态标签颜色对应正确
- [ ] 无遗留的旧色彩变量

---

## 验证步骤

1. 运行 `npm run dev:weapp` 启动小程序开发模式
2. 在微信开发者工具中预览 6 个客人端页面
3. 检查：
   - 色彩是否符合设计规范
   - 圆角、间距是否统一
   - 按钮样式是否一致
   - 状态标签颜色是否正确

---

**Plan saved to:** `docs/superpowers/plans/2026-04-21-guest-ui-implementation.md`

**Two execution options:**

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration

**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

**Which approach?**
