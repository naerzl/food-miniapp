import React, { useState, useCallback, useEffect } from 'react'
import Taro, { useDidShow, useReachBottom } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { reqGetOrders } from '../../../services'
import { subscribeOrderUpdate } from '../../../services/websocket'
import { useAuth } from '../../../store'
import { Order, OrderStatus } from '../../../../types'
import { syncCustomTabBar } from '../../../utils/tabBar'
import { AuthGuard } from '../../../components/AuthGuard'

const STATUS_TABS: { title: string; status: OrderStatus | 'all' }[] = [
  { title: '全部', status: 'all' },
  { title: '待付款', status: 'pending_payment' },
  { title: '制作中', status: 'paid' },
  { title: '待取餐', status: 'preparing' },
  { title: '已完成', status: 'completed' },
]

const STATUS_CONFIG: Record<OrderStatus, { text: string; badgeClass: string }> = {
  pending_payment: { text: '待付款', badgeClass: 'status-pending' },
  paid: { text: '待制作', badgeClass: 'status-paid' },
  preparing: { text: '制作中', badgeClass: 'status-preparing' },
  completed: { text: '已完成', badgeClass: 'status-completed' },
  cancelled: { text: '已取消', badgeClass: 'status-cancelled' },
}

const OrdersPage: React.FC = () => {
  const { isLogin } = useAuth()
  const [currentTab, setCurrentTab] = useState(0)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadOrders = useCallback(
    async (pageNum = 1, isRefresh = false) => {
      try {
        const status = STATUS_TABS[currentTab].status
        const res = await reqGetOrders(status === 'all' ? undefined : status, pageNum, 10)
        if (isRefresh || pageNum === 1) {
          setOrders(res.items)
        } else {
          setOrders((prev) => [...prev, ...res.items])
        }
        setHasMore(res.items.length === 10 && pageNum < res.totalPages)
        setPage(pageNum)
      } catch (error) {
        console.error('加载订单失败:', error)
      } finally {
        setLoading(false)
      }
    },
    [currentTab],
  )

  useEffect(() => {
    if (!isLogin) return
    setLoading(true)
    loadOrders(1)
  }, [currentTab, loadOrders, isLogin])

  Taro.usePullDownRefresh(() => {
    loadOrders(1, true).finally(() => {
      Taro.stopPullDownRefresh()
    })
  })

  useEffect(() => {
    const unsubscribe = subscribeOrderUpdate(() => {
      Taro.showToast({
        title: '订单状态已更新',
        icon: 'none',
        duration: 2000,
      })
      loadOrders(1, true)
    })
    return unsubscribe
  }, [loadOrders])

  useDidShow(() => {
    syncCustomTabBar(1)
    if (isLogin) loadOrders(1, true)
  })

  useReachBottom(() => {
    if (hasMore && !loading) loadOrders(page + 1)
  })

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <AuthGuard>
      <View className="food-page">
        <View className="food-mobile">
          <View className="food-hero">
            <Text className="food-hero__title">📋 我的订单</Text>
            <Text className="food-hero__desc">查看您的所有订单状态</Text>
          </View>

          <View className="food-tabs">
            <ScrollView scrollX showScrollbar={false} className="px-4">
              <View className="flex gap-2">
                {STATUS_TABS.map((tab, i) => (
                  <View
                    key={tab.status}
                    className={`food-pill ${currentTab === i ? 'food-pill--active' : ''}`}
                    onClick={() => setCurrentTab(i)}
                  >
                    <Text>{tab.title}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {loading && orders.length === 0 ? (
            <View className="flex items-center justify-center pt-32">
              <Text className="text-sm text-[#CCC]">加载中...</Text>
            </View>
          ) : orders.length === 0 ? (
            <View className="food-empty">
              <View className="food-empty__icon">
                <Text className="text-4xl">📋</Text>
              </View>
              <Text className="mb-2 text-lg font-bold text-[#4A3728]">暂无订单</Text>
              <Text className="mb-8 text-sm text-[#A39584]">快去下单吧</Text>
              <View
                className="food-action rounded-full px-8 py-3 active:scale-95 transition-transform"
                onClick={() => Taro.switchTab({ url: '/pages/guest/menu/index' })}
              >
                <Text className="text-sm font-semibold text-white">去点餐</Text>
              </View>
            </View>
          ) : (
            <View className="space-y-4 px-4 pt-4 pb-[100px]">
              {orders.map((order) => (
                <View
                  key={order.id}
                  className="food-card p-5 active:scale-[0.98] transition-transform"
                  onClick={() =>
                    Taro.navigateTo({ url: `/pages/guest/order-detail/index?id=${order.id}` })
                  }
                >
                  <View className="mb-3 flex items-center justify-between">
                    <Text className="text-[13px] text-[#8B7355]">{order.orderNo}</Text>
                    <Text className={`status-badge ${STATUS_CONFIG[order.status].badgeClass}`}>
                      {STATUS_CONFIG[order.status].text}
                    </Text>
                  </View>
                  <View className="mb-3 flex flex-wrap gap-2">
                    {order.items?.map((item, idx) => (
                      <View key={idx} className="rounded-lg bg-[#2f33270d] px-2.5 py-1">
                        <Text className="text-xs text-[#4A3728]">
                          {item.dishName} x{item.quantity}
                        </Text>
                      </View>
                    ))}
                  </View>
                  <View className="flex items-center justify-between border-t border-[#E8DDD0] pt-3">
                    <Text className="text-xs text-[#8B7355]">{formatDate(order.createdAt)}</Text>
                    <Text className="text-lg font-bold text-[#E8833A]">
                      <Text className="text-[13px]">¥</Text>
                      {Number(order.totalAmount).toFixed(2)}
                    </Text>
                  </View>
                </View>
              ))}
              {hasMore && (
                <View className="flex justify-center py-4">
                  <Text className="text-xs text-[#CCC]">加载更多...</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </AuthGuard>
  )
}

export default OrdersPage
