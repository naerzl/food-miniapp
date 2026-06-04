import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { reqGetOrderDetail, reqPostPayOrder, reqPostCancelOrder } from '../../../services'
import { useAuth } from '../../../store'
import { Order, OrderStatus } from '../../../../types'
import { getLoginUrl } from '../../../utils/env'

const STATUS_CONFIG: Record<
  OrderStatus,
  { text: string; emoji: string; desc: string; color: string; bg: string; badgeClass: string }
> = {
  pending_payment: {
    text: '待付款',
    emoji: '⏰',
    desc: '请尽快完成支付，超时订单将自动取消',
    color: '#FAAD14',
    bg: '#FFFBE6',
    badgeClass: 'status-pending',
  },
  paid: {
    text: '待制作',
    emoji: '💰',
    desc: '支付成功，等待厨师接单制作',
    color: '#1677FF',
    bg: '#E6F4FF',
    badgeClass: 'status-paid',
  },
  preparing: {
    text: '制作中',
    emoji: '👨‍🍳',
    desc: '美味正在精心制作中，请耐心等待',
    color: '#722ED1',
    bg: '#F9F0FF',
    badgeClass: 'status-preparing',
  },
  completed: {
    text: '已完成',
    emoji: '✅',
    desc: '订单已完成，感谢您的光临',
    color: '#52C41A',
    bg: '#F6FFED',
    badgeClass: 'status-completed',
  },
  cancelled: {
    text: '已取消',
    emoji: '❌',
    desc: '订单已取消',
    color: '#999',
    bg: '#F5F5F5',
    badgeClass: 'status-cancelled',
  },
}

const STATUS_ORDER: OrderStatus[] = ['pending_payment', 'paid', 'preparing', 'completed']

const OrderDetailPage: React.FC = () => {
  const router = useRouter()
  const orderId = router.params.id
  const { isLogin } = useAuth()

  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (!isLogin) {
      Taro.redirectTo({ url: getLoginUrl() })
    }
  }, [isLogin])

  useEffect(() => {
    if (orderId && isLogin) loadOrderDetail()
  }, [orderId, isLogin])

  const loadOrderDetail = async () => {
    try {
      setLoading(true)
      const data = await reqGetOrderDetail(orderId as string)
      setOrder(data)
    } catch (error) {
      console.error('加载订单详情失败:', error)
      Taro.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handlePay = async () => {
    if (actionLoading) return
    setShowPayModal(false)
    setActionLoading(true)
    try {
      await reqPostPayOrder(orderId as string)
      Taro.showToast({ title: '支付成功', icon: 'success' })
      loadOrderDetail()
    } catch (error) {
      Taro.showToast({ title: '支付失败', icon: 'none' })
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    if (actionLoading) return
    setShowCancelModal(false)
    setActionLoading(true)
    try {
      await reqPostCancelOrder(orderId as string)
      Taro.showToast({ title: '已取消', icon: 'success' })
      loadOrderDetail()
    } catch (error) {
      Taro.showToast({ title: '取消失败', icon: 'none' })
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  if (loading) {
    return (
      <View className="food-page flex items-center justify-center">
        <View className="food-mobile flex items-center justify-center">
          <Text className="text-[#CCC]">加载中...</Text>
        </View>
      </View>
    )
  }

  if (!order) {
    return (
      <View className="food-page">
        <View className="food-mobile food-empty">
          <View className="food-empty__icon">
            <Text className="text-4xl">❓</Text>
          </View>
          <Text className="text-[#A39584]">订单不存在</Text>
        </View>
      </View>
    )
  }

  const sc = STATUS_CONFIG[order.status]

  return (
    <View className="food-page food-page--bottom">
      <View className="food-mobile">
        <View className="food-hero">
          <Text className="food-hero__title">📋 订单详情</Text>
          <Text className="food-hero__desc">订单号：{order.orderNo}</Text>
        </View>

        <View className="px-4 pt-4 pb-[140px]">
          <View className="food-card food-section-card">
            <Text className="food-section-title">📍 订单状态</Text>
            <View className="mb-4 flex items-center gap-2">
              <Text className={`status-badge ${sc.badgeClass}`}>{sc.text}</Text>
              <Text className="text-[13px] text-[#8B7355]">
                创建于 {formatDate(order.createdAt)}
              </Text>
            </View>
            <View className="flex items-center justify-between py-4">
              {['已下单', '待付款', '制作中', '待取餐'].map((label, idx) => {
                const currentIndex = Math.max(STATUS_ORDER.indexOf(order.status), 0)
                const isCompleted = idx <= currentIndex && order.status !== 'cancelled'
                const isCurrent = idx === currentIndex && order.status !== 'cancelled'
                return (
                  <React.Fragment key={label}>
                    <View className="flex flex-1 flex-col items-center gap-1.5">
                      <View
                        className="h-4 w-4 rounded-full border-[3px]"
                        style={{
                          background: isCompleted ? '#E8833A' : '#E8DDD0',
                          borderColor: isCompleted ? 'rgba(232, 131, 58, 0.3)' : '#E8DDD0',
                        }}
                      />
                      <Text
                        className="text-[11px]"
                        style={{ color: isCurrent ? '#E8833A' : '#8B7355' }}
                      >
                        {label}
                      </Text>
                    </View>
                    {idx < 3 && (
                      <View
                        className="mb-5 h-[2px] flex-1"
                        style={{ background: isCompleted ? '#E8833A' : '#E8DDD0' }}
                      />
                    )}
                  </React.Fragment>
                )
              })}
            </View>
          </View>

          <View className="food-card food-section-card">
            <Text className="food-section-title">🍽️ 商品信息</Text>
            {order.items?.map((item, i) => (
              <View key={i} className="food-info-row">
                <View className="min-w-0 flex-1">
                  <Text className="block truncate text-sm text-[#2f3327]">
                    {item.dishName}
                    <Text className="ml-2 text-[13px] text-[#8B7355]">x{item.quantity}</Text>
                  </Text>
                </View>
                <Text className="text-sm font-semibold text-[#2f3327]">
                  ¥{(Number(item.price) * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <View className="mt-2 flex items-center justify-between border-t border-[#E8DDD0] pt-3">
              <Text className="text-base font-bold text-[#2f3327]">合计</Text>
              <Text className="text-[22px] font-bold text-[#E8833A]">
                ¥{Number(order.totalAmount).toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="food-card food-section-card">
            <Text className="food-section-title">📋 订单信息</Text>
            <View className="food-info-row">
              <Text className="text-sm text-[#8B7355]">订单编号</Text>
              <Text className="text-sm font-semibold text-[#2f3327]">{order.orderNo}</Text>
            </View>
            <View className="food-info-row">
              <Text className="text-sm text-[#8B7355]">下单时间</Text>
              <Text className="text-sm font-semibold text-[#2f3327]">
                {formatDate(order.createdAt)}
              </Text>
            </View>
            {order.paidAt && (
              <View className="food-info-row">
                <Text className="text-sm text-[#8B7355]">支付时间</Text>
                <Text className="text-sm font-semibold text-[#2f3327]">
                  {formatDate(order.paidAt)}
                </Text>
              </View>
            )}
            {order.completedAt && (
              <View className="food-info-row">
                <Text className="text-sm text-[#8B7355]">完成时间</Text>
                <Text className="text-sm font-semibold text-[#2f3327]">
                  {formatDate(order.completedAt)}
                </Text>
              </View>
            )}
            {order.remark && (
              <View className="pt-3">
                <Text className="mb-1 block text-sm text-[#8B7355]">备注</Text>
                <Text className="text-sm text-[#2f3327]">{order.remark}</Text>
              </View>
            )}
          </View>
        </View>

        {order.status === 'pending_payment' && (
          <View className="food-bottom-bar flex gap-3">
            <View
              className="flex flex-1 items-center justify-center rounded-full border border-[#E8DDD0] bg-white py-3.5 active:scale-[0.98]"
              onClick={actionLoading ? undefined : () => setShowCancelModal(true)}
            >
              <Text className="font-medium text-[#A39584]">取消订单</Text>
            </View>
            <View
              className="food-action flex flex-1 items-center justify-center rounded-full py-3.5 active:scale-[0.98]"
              onClick={actionLoading ? undefined : () => setShowPayModal(true)}
            >
              <Text className="font-semibold text-white">立即支付</Text>
            </View>
          </View>
        )}

        {order.status === 'completed' && (
          <View className="food-bottom-bar">
            <View
              className="food-action-green flex w-full items-center justify-center rounded-full py-3.5 active:scale-[0.98]"
              onClick={() => Taro.switchTab({ url: '/pages/guest/menu/index' })}
            >
              <Text className="font-semibold text-white">再来一单</Text>
            </View>
          </View>
        )}
      </View>

      {/* Cancel modal */}
      {showCancelModal && (
        <View className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <View className="bg-white rounded-3xl w-72 mx-8 overflow-hidden shadow-xl">
            <View className="p-6 text-center">
              <Text className="text-lg font-bold text-[#4A3728] block mb-2">取消订单？</Text>
              <Text className="text-sm text-[#A39584] block">取消后无法恢复</Text>
            </View>
            <View className="flex border-t border-[#F0E6DA]">
              <View
                className="flex-1 py-3.5 flex items-center justify-center active:bg-[#F5F0EB]"
                onClick={() => setShowCancelModal(false)}
              >
                <Text className="text-[#A39584] font-medium">再想想</Text>
              </View>
              <View className="w-px bg-[#F0E6DA]" />
              <View
                className="flex-1 py-3.5 flex items-center justify-center active:bg-[#FFF0E6]"
                onClick={actionLoading ? undefined : handleCancel}
              >
                <Text className="text-[#FF4D4F] font-bold">确认取消</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* Pay modal */}
      {showPayModal && (
        <View className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <View className="bg-white rounded-3xl w-80 mx-8 overflow-hidden shadow-xl">
            <View className="p-6 text-center">
              <View className="w-16 h-16 bg-[#FFF0E6] rounded-full flex items-center justify-center mx-auto mb-4">
                <Text className="text-3xl">💳</Text>
              </View>
              <Text className="text-lg font-bold text-[#4A3728] block mb-1">确认支付</Text>
              <View className="flex items-baseline justify-center my-3">
                <Text className="text-sm text-[#E8833A] font-bold">¥</Text>
                <Text className="text-4xl font-bold text-[#E8833A]">
                  {order.totalAmount.toFixed(2)}
                </Text>
              </View>
              <Text className="text-xs text-[#CCC] block">虚拟支付：点击确认即视为支付成功</Text>
            </View>
            <View className="flex border-t border-[#F0E6DA]">
              <View
                className="flex-1 py-3.5 flex items-center justify-center active:bg-[#F5F0EB]"
                onClick={() => setShowPayModal(false)}
              >
                <Text className="text-[#A39584] font-medium">取消</Text>
              </View>
              <View className="w-px bg-[#F0E6DA]" />
              <View
                className="flex-1 py-3.5 flex items-center justify-center active:bg-[#FFF0E6]"
                onClick={actionLoading ? undefined : handlePay}
              >
                <Text className="text-[#E8833A] font-bold">确认支付</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default OrderDetailPage
