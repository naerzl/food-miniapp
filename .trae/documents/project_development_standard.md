# 私厨点餐助手 - 项目开发规范

## 1. 项目概述

本项目是一个基于 Taro 4.0 + React + TypeScript + Taro UI 的微信小程序，用于私厨点餐管理，包含客人端和私厨端两个主要角色。

## 2. 技术栈

- **框架**：Taro 4.0
- **前端**：React 18 + TypeScript
- **UI 组件库**：Taro UI
- **样式**：Sass
- **构建工具**：Vite
- **代码检查**：ESLint
- **测试**：Jest

## 3. 目录结构规范

```
├── __tests__/           # 测试文件
├── config/              # 配置文件
│   ├── dev.ts           # 开发环境配置
│   ├── prod.ts          # 生产环境配置
│   └── index.ts         # 配置入口
├── docx/                # 文档目录
├── src/                 # 源代码
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── hooks/           # 自定义 hooks
│   ├── pages/           # 页面
│   │   ├── chef/        # 私厨端页面
│   │   └── guest/       # 客人端页面
│   ├── services/        # API 服务
│   ├── store/           # 状态管理
│   ├── utils/           # 工具函数
│   ├── app.config.ts    # 小程序配置
│   ├── app.scss         # 全局样式
│   ├── app.ts           # 应用入口
│   └── index.html       # H5 入口
├── types/               # TypeScript 类型定义
├── .editorconfig        # 编辑器配置
├── .eslintrc            # ESLint 配置
├── .gitignore           # Git 忽略文件
├── babel.config.js      # Babel 配置
├── jest.config.ts       # Jest 配置
├── package.json         # 项目配置
├── project.config.json  # 微信小程序配置
└── tsconfig.json        # TypeScript 配置
```

## 4. 命名规范

### 4.1 文件命名

- **页面文件**：使用小写字母，多词用连字符连接，如 `menu-index.tsx`
- **组件文件**：使用大驼峰命名，如 `DishCard.tsx`
- **工具文件**：使用小写字母，多词用下划线连接，如 `date_utils.ts`
- **样式文件**：与对应组件/页面同名，使用 `.scss` 后缀

### 4.2 变量命名

- **普通变量**：使用小驼峰命名，如 `userInfo`
- **常量**：使用全大写，多词用下划线连接，如 `MAX_ORDER_COUNT`
- **组件**：使用大驼峰命名，如 `UserProfile`
- **函数**：
  - 事件处理函数：使用 `handle` 前缀，如 `handleClick`
  - API 请求函数：使用 `req` + 方法名，如 `reqGetDishes`
  - 数据获取函数：使用 `get` 前缀，如 `getUserInfo`

### 4.3 接口命名

- **接口文件**：使用 `types/` 目录下的文件，如 `types/api.ts`
- **接口名称**：使用大驼峰命名，如 `DishInfo`

## 5. 代码风格规范

### 5.1 ESLint 配置

项目使用 ESLint 进行代码风格检查，遵循 Taro React 规则集，具体配置见 `.eslintrc` 文件。

### 5.2 代码格式

- 使用 2 个空格缩进
- 每行代码长度不超过 100 个字符
- 使用单引号（与 Taro 项目默认保持一致）
- 箭头函数参数只有一个时，省略括号
- 大括号使用同一行风格

### 5.3 注释规范

- **文件头部**：重要文件需添加文件说明注释
- **函数**：复杂函数需添加 JSDoc 注释
- **代码块**：复杂逻辑需添加行内注释

## 6. 组件开发规范

### 6.1 组件结构

```tsx
import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import './ComponentName.scss';

interface ComponentProps {
  // 属性定义
}

const ComponentName: React.FC<ComponentProps> = (props) => {
  // 状态定义
  const [state, setState] = useState<any>(initialState);
  
  // 生命周期
  useEffect(() => {
    // 逻辑
  }, [dependencies]);
  
  // 事件处理
  const handleEvent = () => {
    // 处理逻辑
  };
  
  return (
    <View className="component-name">
      {/* 组件内容 */}
    </View>
  );
};

export default ComponentName;
```

### 6.2 样式规范

- 优先使用 Taro UI 组件的默认样式
- 自定义样式使用 Sass，遵循 BEM 命名规范
- 避免使用内联样式，除非必须动态计算
- 响应式设计使用 rpx 单位

## 7. API 请求规范

### 7.1 API 服务结构

```typescript
// services/api.ts
import Taro from '@tarojs/taro';

// 请求拦截器
const requestInterceptor = (chain) => {
  const requestParams = chain.requestParams;
  // 添加 token 等逻辑
  return chain.proceed(requestParams);
};

// 响应拦截器
const responseInterceptor = (chain) => {
  return chain.proceed().then(res => {
    // 统一处理错误等逻辑
    return res;
  });
};

// 应用拦截器
Taro.addInterceptor(requestInterceptor);
Taro.addInterceptor(responseInterceptor);

// API 方法
export const api = {
  // 菜品相关
  getDishes: () => Taro.request({ url: '/api/dishes' }),
  // 订单相关
  createOrder: (data) => Taro.request({ url: '/api/orders', method: 'POST', data }),
  // 其他 API
};
```

### 7.2 接口调用规范

- 使用 async/await 处理异步请求
- 统一处理 loading 状态和错误提示
- 遵循 RESTful API 设计风格

## 8. 状态管理规范

### 8.1 状态管理方案

- 简单状态：使用 React useState
- 复杂状态：使用 React Context API 或 Redux
- 全局状态：使用 Taro 的全局数据

### 8.2 状态管理最佳实践

- 状态定义清晰，避免冗余
- 状态更新使用函数式更新，避免闭包问题
- 合理使用 useMemo 和 useCallback 优化性能

## 9. 页面开发规范

### 9.1 页面结构

```typescript
// pages/guest/menu/index.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import { AtTabBar, AtCard } from 'taro-ui';
import './index.scss';

const MenuPage: React.FC = () => {
  const [dishes, setDishes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadDishes();
  }, []);
  
  const loadDishes = async () => {
    try {
      setLoading(true);
      // API 调用
      // setDishes(data);
    } catch (error) {
      Taro.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View className="menu-page">
      {/* 页面内容 */}
    </View>
  );
};

export default MenuPage;
```

### 9.2 页面配置

```typescript
// pages/guest/menu/index.config.ts
export default {
  navigationBarTitleText: '菜单',
  enablePullDownRefresh: true,
  backgroundTextStyle: 'dark'
};
```

## 10. 测试规范

### 10.1 测试文件结构

- 测试文件放在 `__tests__` 目录下
- 测试文件命名为 `*.test.js` 或 `*.test.tsx`

### 10.2 测试内容

- 组件测试：测试组件渲染、Props 传递、事件处理
- 工具函数测试：测试工具函数的正确性
- API 测试：测试 API 调用和响应处理

### 10.3 测试运行

```bash
npm test
```

## 11. 版本控制规范

### 11.1 Git 分支管理

- `main`：主分支，用于发布生产版本
- `develop`：开发分支，用于集成开发
- `feature/*`：功能分支，用于开发新功能
- `bugfix/*`：修复分支，用于修复 bug

### 11.2 提交规范

- 提交信息格式：`type(scope): subject`
  - `type`：commit 类型（feat, fix, docs, style, refactor, test, chore）
  - `scope`：修改范围
  - `subject`：提交描述

- 示例：
  - `feat(menu): 添加菜品分类筛选功能`
  - `fix(order): 修复订单状态更新问题`

## 12. 部署规范

### 12.1 构建命令

- 开发环境：`npm run dev:weapp`
- 生产环境：`npm run build:weapp`

### 12.2 环境配置

- 开发环境：`config/dev.ts`
- 生产环境：`config/prod.ts`

### 12.3 小程序发布

1. 构建生产版本
2. 在微信开发者工具中上传代码
3. 提交审核
4. 发布上线

## 13. 安全规范

- 敏感信息（如 API 密钥）不直接硬编码在代码中
- 使用 HTTPS 进行 API 通信
- 对用户输入进行验证和转义
- 小程序端敏感操作需校验身份

## 14. 性能优化规范

- 使用分包加载减少首屏加载时间
- 图片使用懒加载和合适的尺寸
- 避免不必要的渲染和计算
- 合理使用缓存减少 API 请求

## 15. 代码审查规范

- 代码提交前进行 ESLint 检查
- 代码审查关注：
  - 代码质量和可读性
  - 性能优化
  - 安全问题
  - 功能完整性

## 16. 迭代规划

### 16.1 V1.0
- 实现客人端完整点餐流程
- 实现私厨端基础管理（菜品、订单、客人）
- 完成基础数据模型与 API

### 16.2 V1.1
- 增加统计看板
- 增加批量设置今日供应功能

### 16.3 V2.0
- 接入微信支付
- 接入订阅消息通知

## 17. 附录

### 17.1 常用命令

- 启动开发服务器：`npm run dev:weapp`
- 构建生产版本：`npm run build:weapp`
- 运行测试：`npm test`
- ESLint 检查：`npx eslint src`

### 17.2 代码示例

#### 组件示例

```tsx
// components/DishCard.tsx
import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import './DishCard.scss';

interface DishCardProps {
  dish: {
    id: number;
    name: string;
    price: number;
    image: string;
    description: string;
    available: boolean;
  };
  onAddToCart: (dishId: number) => void;
}

const DishCard: React.FC<DishCardProps> = ({ dish, onAddToCart }) => {
  const handleAddToCart = () => {
    if (dish.available) {
      onAddToCart(dish.id);
    }
  };

  return (
    <View className="dish-card">
      <Image className="dish-image" src={dish.image} mode="aspectFill" />
      <View className="dish-info">
        <Text className="dish-name">{dish.name}</Text>
        <Text className="dish-price">¥{dish.price}</Text>
        <Text className="dish-description">{dish.description}</Text>
        <AtButton 
          type="primary" 
          size="small" 
          disabled={!dish.available}
          onClick={handleAddToCart}
        >
          {dish.available ? '加入购物车' : '已售罄'}
        </AtButton>
      </View>
    </View>
  );
};

export default DishCard;
```

#### API 服务示例

```typescript
// services/order.ts
import Taro from '@tarojs/taro';

interface CreateOrderData {
  dishes: {
    dishId: number;
    quantity: number;
  }[];
  remark?: string;
}

interface Order {
  id: number;
  orderNo: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

export const orderService = {
  // 创建订单
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const res = await Taro.request({
      url: '/api/orders',
      method: 'POST',
      data,
    });
    return res.data.data;
  },

  // 获取订单列表
  getOrders: async (status?: string): Promise<Order[]> => {
    const res = await Taro.request({
      url: '/api/orders',
      data: { status },
    });
    return res.data.data;
  },

  // 获取订单详情
  getOrderDetail: async (orderId: number): Promise<Order> => {
    const res = await Taro.request({
      url: `/api/orders/${orderId}`,
    });
    return res.data.data;
  },
};
```

### 17.3 注意事项

- 遵循微信小程序开发规范和限制
- 注意代码的兼容性，确保在不同设备上正常运行
- 定期备份代码和数据
- 关注微信小程序的更新和新特性