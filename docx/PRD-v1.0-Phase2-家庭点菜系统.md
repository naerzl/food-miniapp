# 家庭点菜系统 - 第二阶段产品需求文档

---

## 文档信息

| 项目 | 内容 |
|------|------|
| 产品名称 | 家庭点菜系统 |
| 所属阶段 | 第二阶段（Phase 2） |
| 文档版本 | V1.0 |
| 创建日期 | 2026-04-21 |
| 最后更新 | 2026-04-21 |
| 状态 | 已完成 |

---

## 1. 产品概述

### 1.1 阶段目标

第二阶段目标：**数据驱动、体验优秀**，通过数据洞察帮助厨师优化菜品结构，通过个性化服务提升家庭成员的用餐体验。

### 1.2 核心目标

| 目标编号 | 目标描述 | 关键指标 | 优先级 |
|----------|----------|----------|--------|
| G1 | 建立数据洞察能力 | 厨师每日查看数据看板次数 ≥ 3次 | P0 |
| G2 | 提升用户粘性 | 用户个人中心访问率 ≥ 60% | P1 |
| G3 | 优化运营效率 | 菜品管理操作时间减少 50% | P1 |
| G4 | 增强系统稳定性 | 核心接口响应时间 < 200ms | P1 |
| G5 | 完善基础体验 | 订单检索效率提升 3倍 | P2 |

---

## 2. 功能需求

### 2.1 数据中心（厨师端）

#### 2.1.1 今日概览面板

**功能描述**：展示当日关键经营指标，数据实时更新。

**功能详单**：

| 指标名称 | 计算逻辑 | 展示形式 |
|----------|----------|----------|
| 今日订单总数 | 当日00:00-23:59所有订单 | 数字 + 环比昨日 |
| 今日营收总额 | 当日已完成订单金额总和 | 金额 |
| 待处理订单 | 待支付+已支付+制作中 | 数字徽章 |
| 已完成订单 | 当日已完成订单数 | 数字 |
| 取消率 | 取消订单数/总订单数 | 百分比 + 趋势 |
| 平均客单价 | 营收总额/已完成订单数 | 金额 |

**API 端点**：`GET /api/statistics/dashboard`

#### 2.1.2 经营趋势分析

**功能描述**：提供多维度趋势图表，支持时间范围切换。

**功能详单**：

| 图表类型 | 维度 | 时间范围 |
|----------|------|----------|
| 订单趋势图 | 订单数量 | 近7天/30天/自定义 |
| 营收趋势图 | 营收金额 | 近7天/30天/自定义 |
| 时段分布图 | 24小时订单分布 | 近7天平均 |

**API 端点**：`GET /api/statistics/trends`

#### 2.1.3 时段分布

**功能描述**：展示24小时订单分布，分析下单高峰期。

**API 端点**：`GET /api/statistics/hourly-distribution`

#### 2.1.4 菜品销售排行

**功能描述**：多维度菜品销售分析，支持多时间范围查看。

**功能详单**：

| 排行类型 | 排序依据 | 展示数量 |
|----------|----------|----------|
| 热销榜 | 销售数量 | Top 10 |
| 营收榜 | 销售额 | Top 10 |
| 人气榜 | 订单次数（去重） | Top 10 |
| 滞销榜 | 销售数量升序 | Bottom 10 |

**API 端点**：`GET /api/statistics/dishes/ranking`

#### 2.1.5 用户消费排行

**功能描述**：展示家庭成员消费排行和消费详情。

**功能详单**：

| 字段 | 说明 | 计算方式 |
|------|------|----------|
| 排名 | 按累计消费排序 | - |
| 用户昵称 | 微信昵称 | users表 |
| 头像 | 微信头像 | users表 |
| 累计消费 | 历史总消费金额 | SUM(已完成订单) |
| 订单次数 | 历史订单总数 | COUNT(订单) |
| 平均客单价 | 消费/订单 | 计算得出 |
| 最常点菜品 | 点单次数最多的菜品 | order_items统计 |
| 最近消费 | 最后一次下单时间 | orders表 |

**API 端点**：`GET /api/statistics/users/ranking`

---

### 2.2 个人中心（客人端）

#### 2.2.1 消费统计卡片

**功能描述**：在个人中心顶部展示核心消费数据。

**功能详单**：

| 指标 | 说明 | 展示位置 |
|------|------|----------|
| 累计消费 | 所有已完成订单总金额 | 主卡片 |
| 累计订单 | 历史订单总数 | 主卡片 |
| 本月消费 | 当月消费金额 | 本月卡片 |
| 本月订单 | 当月订单数 | 本月卡片 |
| 较上月 | 环比增长率 | 本月卡片 |
| 最爱菜品 | 点单次数最多的菜品 | 偏好卡片 |

**API 端点**：`GET /api/statistics/my`

#### 2.2.2 用户个人统计

**功能描述**：查看指定用户的详细消费统计（厨师端查看）。

**API 端点**：`GET /api/statistics/users/:id`

---

### 2.3 运营效率优化

#### 2.3.1 批量菜品管理

**功能描述**：提供批量操作功能，提升运营效率。

**功能详单**：

| 功能 | 操作 | 适用场景 |
|------|------|----------|
| 批量设置今日供应 | 选中多个菜品，一键开启/关闭 | 每日营业前准备 |
| 批量设置售罄 | 选中多个菜品，一键售罄 | 售罄时快速操作 |
| 批量上架/下架 | 选中多个菜品，统一操作 | 季节性菜单调整 |

**API 端点**：
- `POST /api/dishes/batch/today-supply`
- `POST /api/dishes/batch/sold-out`
- `POST /api/dishes/batch/available`

#### 2.3.2 智能订单筛选

**功能描述**：提供多维度订单筛选和搜索功能。

**筛选条件**：

| 条件 | 类型 | 说明 |
|------|------|------|
| 订单状态 | 多选 | 待支付、已支付、制作中、已完成、已取消 |
| 日期范围 | 日期选择器 | 今天、昨天、近7天、近30天、自定义 |
| 用户 | 下拉选择 | 选择指定用户的订单 |
| 订单号 | 搜索框 | 支持模糊搜索 |
| 金额范围 | 数字范围 | 最小金额 - 最大金额 |
| 排序方式 | 下拉 | 时间降序、时间升序、金额降序、金额升序 |

**API 端点**：`GET /api/orders/filter`

---

## 3. 系统优化

### 3.1 数据库性能优化

**优化项**：

| 优化类型 | 具体措施 | 预期效果 |
|----------|----------|----------|
| 索引优化 | 添加orders表复合索引 | 查询速度提升 50% |
| 查询优化 | 统计查询使用QueryBuilder | 减少N+1查询 |
| 分页优化 | 大数据量使用游标分页 | 避免深分页性能问题 |

**索引设计**：
```sql
-- 订单表索引
CREATE INDEX idx_orders_status_created ON orders(status, createdAt);
CREATE INDEX idx_orders_user_status ON orders(userId, status);
CREATE INDEX idx_orders_created ON orders(createdAt);
CREATE INDEX idx_orders_order_no ON orders(orderNo);
CREATE INDEX idx_orders_amount ON orders(totalAmount);

-- 订单项表索引
CREATE INDEX idx_order_items_dish_created ON order_items(dishId, createdAt);
CREATE INDEX idx_order_items_order ON order_items(orderId);
```

**迁移文件**：`src/database/migrations/1742966400000-add-statistics-indexes.ts`

---

## 4. API 接口清单

### 4.1 统计模块 (Statistics)

| 接口 | 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|------|
| 今日概览 | GET | /api/statistics/dashboard | 今日经营数据 | ✅ |
| 趋势数据 | GET | /api/statistics/trends | 订单/营收趋势 | ✅ |
| 时段分布 | GET | /api/statistics/hourly-distribution | 24小时时段分布 | ✅ |
| 菜品排行 | GET | /api/statistics/dishes/ranking | 菜品销售排行 | ✅ |
| 用户排行 | GET | /api/statistics/users/ranking | 用户消费排行 | ✅ |
| 用户统计 | GET | /api/statistics/users/:id | 指定用户统计 | ✅ |
| 我的统计 | GET | /api/statistics/my | 当前用户统计 | ✅ |

### 4.2 订单模块增强

| 接口 | 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|------|
| 智能筛选 | GET | /api/orders/filter | 智能筛选订单 | ✅ |

### 4.3 菜品模块增强

| 接口 | 方法 | 路径 | 说明 | 状态 |
|------|------|------|------|------|
| 批量今日供应 | POST | /api/dishes/batch/today-supply | 批量设置今日供应 | ✅ |
| 批量售罄 | POST | /api/dishes/batch/sold-out | 批量设置售罄 | ✅ |
| 批量上架 | POST | /api/dishes/batch/available | 批量设置上架状态 | ✅ |

**状态图例**：
- ✅ 已完成，Swagger 文档已覆盖

---

## 5. 技术架构

### 5.1 新增模块结构

```
src/modules/statistics/
├── statistics.module.ts
├── statistics.controller.ts
├── statistics.service.ts
├── statistics.service.spec.ts
├── dto/
│   ├── dashboard-query.dto.ts
│   ├── trend-query.dto.ts
│   └── ranking-query.dto.ts
└── interfaces/
    ├── dashboard.interface.ts
    ├── trend.interface.ts
    └── ranking.interface.ts
```

---

## 6. 迭代规划

### 6.1 Sprint 1（第1-2周）

**目标**：完成核心数据统计功能

| 任务 | 预计工时 | 优先级 | 状态 |
|------|----------|--------|------|
| 设计统计数据库查询 | 1d | P0 | ✅ |
| 实现今日概览API | 2d | P0 | ✅ |
| 实现菜品排行API | 2d | P0 | ✅ |
| 实现趋势数据API | 2d | P0 | ✅ |
| 实现时段分布API | 2d | P0 | ✅ |

### 6.2 Sprint 2（第3-4周）

**目标**：完成用户端统计和运营优化功能

| 任务 | 预计工时 | 优先级 | 状态 |
|------|----------|--------|------|
| 实现用户消费排行API | 2d | P1 | ✅ |
| 实现用户个人统计API | 2d | P1 | ✅ |
| 实现批量操作API | 2d | P1 | ✅ |
| 数据库索引优化 | 1d | P1 | ✅ |

### 6.3 Sprint 3（第5-6周）

**目标**：完成订单筛选和系统性能优化

| 任务 | 预计工时 | 优先级 | 状态 |
|------|----------|--------|------|
| 实现订单筛选API | 2d | P1 | ✅ |
| 文档更新 | 1d | P2 | ✅ |

---

## 7. 交付清单

### 7.1 功能交付

| 模块 | 功能 | 状态 |
|------|------|------|
| 数据中心 | 今日概览 | ✅ |
| 数据中心 | 经营趋势分析 | ✅ |
| 数据中心 | 菜品销售排行 | ✅ |
| 数据中心 | 用户消费排行 | ✅ |
| 个人中心 | 消费统计卡片 | ✅ |
| 个人中心 | 用户个人统计 | ✅ |
| 运营效率 | 批量菜品管理 | ✅ |
| 运营效率 | 智能订单筛选 | ✅ |
| 系统优化 | 数据库索引优化 | ✅ |

### 7.2 新增文件清单

**新增文件**:
- `src/modules/statistics/statistics.module.ts`
- `src/modules/statistics/statistics.controller.ts`
- `src/modules/statistics/statistics.service.ts`
- `src/modules/statistics/statistics.service.spec.ts`
- `src/modules/statistics/dto/dashboard-query.dto.ts`
- `src/modules/statistics/dto/trend-query.dto.ts`
- `src/modules/statistics/dto/ranking-query.dto.ts`
- `src/modules/statistics/interfaces/dashboard.interface.ts`
- `src/modules/statistics/interfaces/trend.interface.ts`
- `src/modules/statistics/interfaces/ranking.interface.ts`
- `src/modules/dish/dto/batch-operation.dto.ts`
- `src/modules/order/dto/order-filter.dto.ts`
- `src/database/migrations/1742966400000-add-statistics-indexes.ts`

**修改文件**:
- `src/app.module.ts` - 注册 StatisticsModule
- `src/modules/dish/dish.service.ts` - 添加批量操作方法
- `src/modules/dish/dish.controller.ts` - 添加批量操作端点
- `src/modules/order/order.service.ts` - 添加智能筛选方法
- `src/modules/order/order.controller.ts` - 添加筛选端点

---

**文档结束**

*本文档为第二阶段产品需求文档，已完成。*
*最后更新：2026-04-21*
