# 代码风格规范

## 数值计算

**涉及金额计算或小数计算必须使用 `decimal.js`**，禁止直接使用 JavaScript 原生的 `+`、`-`、`*`、`/` 运算符，以免产生精度误差。

```typescript
import Decimal from 'decimal.js'

// 错误示例
const result = 0.1 + 0.2 // 0.30000000000000004

// 正确示例
const result = Decimal('0.1').plus('0.2').toNumber() // 0.3
```

## React 开发

**实现 React/Next.js 代码前必须先读取 `vercel-react-best-practices` 技能**，遵循 Vercel Engineering 的 React 和 Next.js 性能优化指南。适用于：
- React 组件编写
- Next.js 页面开发
- 数据获取和缓存策略
- Bundle 优化
- 性能改进相关任务

## 样式

**CSS 优先使用 Tailwind CSS**，避免不必要的自定义样式。
