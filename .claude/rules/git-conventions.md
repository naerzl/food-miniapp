# Git 提交规范

采用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>(<scope>): <subject>

<body>
```

**Type 类型：**
| Type | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `refactor` | 重构（非功能修改） |
| `style` | 样式调整 |
| `docs` | 文档更新 |
| `test` | 测试相关 |
| `chore` | 构建/工具变更 |
| `perf` | 性能优化 |
| `ci` | CI/CD 配置 |

**示例：**
```
feat(CodingPlan): 添加购买成功页面 UI 组件

- 新增 confetti 组件实现庆祝动画效果
- 新增 button 组件基于 Radix UI
- 更新 PurchaseSuccess 页面集成动画和按钮组件
- 添加 canvas-confetti 和 radix-ui 依赖
```
