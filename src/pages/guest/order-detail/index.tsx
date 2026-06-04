import React, { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { reqGetOrderDetail, reqPostPayOrder, reqPostCancelOrder } from '../../../services'
import { useAuth } from '../../../store'
import { Order, OrderStatus } from '../../../../types'

const LOGIN_URL = '/pages/guest/login/index'

const STATUS_CONFIG: Record<
  OrderStatus,
  { text: string; emoji: string; desc: string; color: string; bg: string }
> = {
  pending_payment: {
    text: '待支付',
    emoji: '⏰',
    desc: '请尽快完成支付，超时订单将自动取消',
    color: '#FAAD14',
    bg: '#FFFBE6',
  },
  paid: {
    text: '已支付',
    emoji: '💰',
    desc: '支付成功，等待厨师接单制作',
    color: '#1677FF',
    bg: '#E6F4FF',
  },
  preparing: {
    text: '制作中',
    emoji: '👨‍🍳',
    desc: '美味正在精心制作中，请耐心等待',
    color: '#722ED1',
    bg: '#F9F0FF',
  },
  completed: {
    text: '已完成',
    emoji: '✅',
    desc: '订单已完成，感谢您的光临',
    color: '#52C41A',
    bg: '#F6FFED',
  },
  cancelled: { text: '已取消', emoji: '❌', desc: '订单已取消', color: '#999', bg: '#F5F5F5' },
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
      Taro.redirectTo({ url: LOGIN_URL })
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
        <Text className="text-[#CCC]">加载中...</Text>
      </View>
    )
  }

  if (!order) {
    return (
      <View className="food-page food-empty">
        <View className="food-empty__icon">
          <Text className="text-4xl">❓</Text>
        </View>
        <Text className="text-[#A39584]">订单不存在</Text>
      </View>
    )
  }

  const sc = STATUS_CONFIG[order.status]

  return (
    <View className="food-page food-page--bottom">
      {/* Status header */}
      <View
        className="mx-4 mt-3 rounded-3xl p-6 text-center shadow-sm border border-white/70"
        style={{ backgroundColor: sc.bg }}
      >
        <View className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm">
          <Text className="text-3xl">{sc.emoji}</Text>
        </View>
        <Text className="text-xl font-bold block mb-1" style={{ color: sc.color }}>
          {sc.text}
        </Text>
        <Text className="text-sm block" style={{ color: sc.color, opacity: 0.7 }}>
          {sc.desc}
        </Text>
      </View>

      {/* Status timeline */}
      <View className="food-card mx-4 mt-3 p-5">
        <Text className="text-base font-bold text-[#2f3327] block mb-4">📍 订单状态</Text>
        <View className="flex items-center justify-between px-2">
          {['已下单', '待付款', '制作中', '待取餐'].map((label, idx) => {
            const isCompleted = idx <= STATUS_ORDER.indexOf(order.status)
            const isCurrent = idx === STATUS_ORDER.indexOf(order.status)
            return (
              <React.Fragment key={label}>
                <View className="flex flex-col items-center gap-1.5">
                  <View
                    className="w-4 h-4 rounded-full border-[3px]"
                    style={{
                      background: isCompleted ? '#E8833A' : 'var(--border)',
                      borderColor: isCompleted ? 'rgba(232, 131, 58, 0.3)' : 'var(--border)',
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
                    className="flex-1 h-[2px] mx-1 mb-5"
                    style={{
                      background: isCompleted ? '#E8833A' : 'var(--border)',
                    }}
                  />
                )}
              </React.Fragment>
            )
          })}
        </View>
      </View>

      {/* Items */}
      <View className="food-card mx-4 mt-3 p-5">
        <Text className="text-base font-bold text-[#2f3327] block mb-3">🍽️ 商品信息</Text>
        <View className="space-y-3">
          {order.items?.map((item, i) => (
            <View key={i} className="flex gap-3 items-center">
              <View className="flex-1 min-w-0">
                <Text className="text-sm font-semibold text-[#2f3327] block truncate">
                  {item.dishName}
                </Text>
                <Text className="text-xs text-[#8B7355] mt-0.5 block">
                  ¥{item.price.toFixed(2)} × {item.quantity}
                </Text>
              </View>
              <Text className="text-[#E8833A] font-bold text-sm flex-shrink-0">
                ¥{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
        <View className="border-t border-[#F0E6DA] mt-4 pt-3 flex justify-between items-center">
          <Text className="text-base font-bold text-[#2f3327]">合计</Text>
          <View className="flex items-baseline">
            <Text className="text-xs text-[#E8833A] font-bold">¥</Text>
            <Text className="text-xl font-bold text-[#E8833A]">{order.totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Order info */}
      <View className="food-card mx-4 mt-3 p-5">
        <Text className="text-base font-bold text-[#2f3327] block mb-3">📋 订单信息</Text>
        <View className="space-y-2.5">
          <View className="flex justify-between py-1">
            <Text className="text-sm text-[#8B7355]">订单编号</Text>
            <Text className="text-sm text-[#2f3327]">{order.orderNo}</Text>
          </View>
          <View className="flex justify-between py-1">
            <Text className="text-sm text-[#8B7355]">下单时间</Text>
            <Text className="text-sm text-[#2f3327]">{formatDate(order.createdAt)}</Text>
          </View>
          {order.paidAt && (
            <View className="flex justify-between py-1">
              <Text className="text-sm text-[#8B7355]">支付时间</Text>
              <Text className="text-sm text-[#2f3327]">{formatDate(order.paidAt)}</Text>
            </View>
          )}
          {order.completedAt && (
            <View className="flex justify-between py-1">
              <Text className="text-sm text-[#8B7355]">完成时间</Text>
              <Text className="text-sm text-[#2f3327]">{formatDate(order.completedAt)}</Text>
            </View>
          )}
          {order.remark && (
            <View className="pt-2.5 border-t border-[#F0E6DA]">
              <Text className="text-sm text-[#8B7355] block mb-1">备注</Text>
              <Text className="text-sm text-[#2f3327]">{order.remark}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Action bar */}
      {order.status === 'pending_payment' && (
        <View className="food-bottom-bar px-5 py-4 flex gap-3">
          <View
            className="flex-1 bg-white border border-[#E8DDD0] rounded-full py-3.5 flex items-center justify-center active:scale-[0.98]"
            onClick={actionLoading ? undefined : () => setShowCancelModal(true)}
          >
            <Text className="text-[#A39584] font-medium">取消订单</Text>
          </View>
          <View
            className="flex-1 rounded-full py-3.5 flex items-center justify-center active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #ed8f3d, #e06633)',
              boxShadow: '0 12px 26px rgba(224, 102, 51, 0.26)',
            }}
            onClick={actionLoading ? undefined : () => setShowPayModal(true)}
          >
            <Text className="text-white font-semibold">立即支付</Text>
          </View>
        </View>
      )}

      {order.status === 'completed' && (
        <View className="food-bottom-bar px-5 py-4">
          <View
            className="w-full rounded-full py-3.5 flex items-center justify-center active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #5b9b58, #2f6d4c)',
              boxShadow: '0 12px 26px rgba(47, 109, 76, 0.24)',
            }}
            onClick={() => Taro.switchTab({ url: '/pages/guest/menu/index' })}
          >
            <Text className="text-white font-semibold">再来一单</Text>
          </View>
        </View>
      )}

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
