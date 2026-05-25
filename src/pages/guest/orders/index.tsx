import React, { useState, useCallback, useEffect } from 'react'
import Taro, { useDidShow, useReachBottom } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { orderApi } from '../../../services'
import { Order, OrderStatus } from '../../../../types'

const STATUS_TABS: { title: string; status: OrderStatus | 'all' }[] = [
  { title: '全部', status: 'all' },
  { title: '待支付', status: 'pending_payment' },
  { title: '待制作', status: 'paid' },
  { title: '制作中', status: 'preparing' },
  { title: '已完成', status: 'completed' },
]

const STATUS_CONFIG: Record<OrderStatus, { text: string; color: string; bg: string }> = {
  pending_payment: { text: '待支付', color: '#FAAD14', bg: '#FFFBE6' },
  paid: { text: '待制作', color: '#1677FF', bg: '#E6F4FF' },
  preparing: { text: '制作中', color: '#722ED1', bg: '#F9F0FF' },
  completed: { text: '已完成', color: '#52C41A', bg: '#F6FFED' },
  cancelled: { text: '已取消', color: '#999', bg: '#F5F5F5' },
}

const OrdersPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const loadOrders = useCallback(async (pageNum = 1, isRefresh = false) => {
    try {
      const status = STATUS_TABS[currentTab].status
      const res = await orderApi.getOrders(
        status === 'all' ? undefined : status,
        pageNum,
        10
      )
      if (isRefresh || pageNum === 1) {
        setOrders(res.items)
      } else {
        setOrders(prev => [...prev, ...res.items])
      }
      setHasMore(res.items.length === 10 && pageNum < res.totalPages)
      setPage(pageNum)
    } catch (error) {
      console.error('加载订单失败:', error)
    } finally {
      setLoading(false)
    }
  }, [currentTab])

  useEffect(() => {
    setLoading(true)
    loadOrders(1)
  }, [currentTab, loadOrders])

  useDidShow(() => { loadOrders(1, true) })

  useReachBottom(() => {
    if (hasMore && !loading) loadOrders(page + 1)
  })

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getMonth() + 1}月${d.getDate()}日 ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <View className="min-h-screen bg-[#FFF8F0]">
      {/* Status tabs */}
      <View className="sticky top-0 z-10 bg-[#FFF8F0]/95 backdrop-blur-sm pt-3 pb-2">
        <ScrollView scrollX showScrollbar={false} className="px-4">
          <View className="flex gap-2">
            {STATUS_TABS.map((tab, i) => (
              <View
                key={tab.status}
                className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                  currentTab === i
                    ? 'bg-[#E8833A] text-white shadow-md shadow-[#E8833A]/20'
                    : 'bg-white text-[#8B7355] border border-[#E8DDD0]'
                }`}
                onClick={() => setCurrentTab(i)}
              >
                <Text>{tab.title}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Order list */}
      {loading && orders.length === 0 ? (
        <View className="flex items-center justify-center pt-32">
          <Text className="text-[#CCC] text-sm">加载中...</Text>
        </View>
      ) : orders.length === 0 ? (
        <View className="flex flex-col items-center justify-center pt-32 px-8">
          <View className="w-24 h-24 bg-[#F5E6D3] rounded-full flex items-center justify-center mb-5">
            <Text className="text-4xl">📋</Text>
          </View>
          <Text className="text-lg font-bold text-[#4A3728] mb-2">暂无订单</Text>
          <Text className="text-sm text-[#A39584] mb-8">快去下单吧</Text>
          <View
            className="bg-[#E8833A] rounded-full px-8 py-3 shadow-lg shadow-[#E8833A]/25 active:scale-95"
            onClick={() => Taro.switchTab({ url: '/pages/guest/menu/index' })}
          >
            <Text className="text-white font-semibold text-sm">去点餐</Text>
          </View>
        </View>
      ) : (
        <View className="px-4 pt-2 space-y-3 pb-8">
          {orders.map(order => (
            <View
              key={order.id}
              className="bg-[#FFFAF5] rounded-2xl p-4 shadow-sm active:scale-[0.99] transition-transform"
              onClick={() =>
                Taro.navigateTo({ url: `/pages/guest/order-detail/index?id=${order.id}` })
              }
            >
              <View className="flex items-center justify-between mb-3">
                <Text className="text-xs text-[#A39584]">{order.orderNo}</Text>
                <View
                  className="px-3 py-1 rounded-full"
                  style={{ backgroundColor: STATUS_CONFIG[order.status].bg }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: STATUS_CONFIG[order.status].color }}
                  >
                    {STATUS_CONFIG[order.status].text}
                  </Text>
                </View>
              </View>
              <View className="flex items-center justify-between">
                <Text className="text-sm text-[#8B7355]">
                  {order.items?.length || 0} 件商品
                </Text>
                <View className="flex items-baseline">
                  <Text className="text-xs text-[#E8833A] font-semibold">¥</Text>
                  <Text className="text-lg font-bold text-[#E8833A]">
                    {order.totalAmount.toFixed(2)}
                  </Text>
                </View>
              </View>
              <View className="flex items-center justify-between mt-3 pt-3 border-t border-[#F5E6D3]">
                <Text className="text-xs text-[#CCC]">{formatDate(order.createdAt)}</Text>
                {order.status === 'pending_payment' && (
                  <View className="bg-[#E8833A] rounded-full px-4 py-1.5">
                    <Text className="text-white text-xs font-semibold">去支付</Text>
                  </View>
                )}
                {order.status === 'completed' && (
                  <View className="border border-[#E8833A] rounded-full px-4 py-1.5">
                    <Text className="text-[#E8833A] text-xs font-semibold">再来一单</Text>
                  </View>
                )}
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
  )
}

export default OrdersPage
