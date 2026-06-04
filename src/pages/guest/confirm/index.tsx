import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Textarea } from '@tarojs/components'
import { useCart, useAuth } from '../../../store'
import { reqPostCreateOrder } from '../../../services'

const ConfirmPage: React.FC = () => {
  const { items, totalCount, totalAmount, clearCart } = useCart()
  const { isLogin, userInfo } = useAuth()
  const [remark, setRemark] = useState('')
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = () => {
    if (items.length === 0) {
      Taro.showToast({ title: '购物车是空的', icon: 'none' })
      return
    }
    if (!isLogin) {
      Taro.navigateTo({ url: '/pages/guest/login/index' })
      return
    }
    setShowConfirm(true)
  }

  const confirmSubmit = async () => {
    setShowConfirm(false)
    setLoading(true)
    try {
      const order = await reqPostCreateOrder({
        items: items.map((item) => ({
          dishId: String(item.dishId),
          quantity: item.quantity,
        })),
        remark: remark.trim(),
      })
      clearCart()
      Taro.showToast({ title: '下单成功', icon: 'success', duration: 1500 })
      setTimeout(() => {
        Taro.redirectTo({ url: `/pages/guest/order-detail/index?id=${order.id}` })
      }, 1500)
    } catch (error) {
      console.error('下单失败:', error)
      Taro.showToast({ title: '下单失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <View className="food-page">
        <View className="food-mobile">
          <View className="food-empty">
            <View className="food-empty__icon">
              <Text className="text-5xl">🛒</Text>
            </View>
            <Text className="mb-2 text-lg font-bold text-[#4A3728]">购物车是空的</Text>
            <Text className="mb-8 text-sm text-[#A39584]">请先添加商品到购物车</Text>
            <View
              className="food-action-green rounded-full px-10 py-3 active:scale-95"
              onClick={() => Taro.switchTab({ url: '/pages/guest/menu/index' })}
            >
              <Text className="font-semibold text-white">去逛逛</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="food-page food-page--bottom">
      <View className="food-mobile">
        <View className="food-hero">
          <Text className="food-hero__title">📋 确认订单</Text>
          <Text className="food-hero__desc">请核对订单信息，确认后提交</Text>
        </View>

        <View className="px-4 pt-4 pb-[140px]">
          <View className="food-card food-section-card">
            <Text className="food-section-title">👤 用户信息</Text>
            <View className="food-info-row">
              <Text className="text-sm text-[#8B7355]">联系人</Text>
              <Text className="text-sm font-semibold text-[#2f3327]">
                {userInfo?.nickname || userInfo?.username || '微信用户'}
              </Text>
            </View>
          </View>

          <View className="food-card food-section-card">
            <Text className="food-section-title">🍽️ 商品清单</Text>
            {items.map((item) => (
              <View key={item.dishId} className="food-info-row">
                <View className="flex items-center">
                  <Text className="text-sm text-[#2f3327]">{item.dishName}</Text>
                  <Text className="ml-2 text-[13px] text-[#8B7355]">x{item.quantity}</Text>
                </View>
                <Text className="text-sm font-semibold text-[#2f3327]">
                  ¥{(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
          </View>

          <View className="food-card food-section-card">
            <View className="mb-3 flex items-center justify-between">
              <Text className="text-base font-bold text-[#2f3327]">📝 订单备注</Text>
              <Text className="text-xs text-[#CCC]">{remark.length}/200</Text>
            </View>
            <Textarea
              className="w-full rounded-2xl border border-[#E8DDD0] bg-white/50 p-3 text-sm text-[#2f3327]"
              style={{ minHeight: '80px' }}
              placeholder="请输入特殊要求，如口味偏好、过敏原等..."
              placeholderStyle="color: #A39584; font-size: 13px;"
              value={remark}
              onInput={(e) => setRemark(e.detail.value)}
              maxlength={200}
            />
          </View>

          <View className="food-card food-section-card">
            <Text className="food-section-title">💰 金额汇总</Text>
            <View className="space-y-2">
              <View className="flex items-center justify-between py-1">
                <Text className="text-sm text-[#4A3728]">商品总价</Text>
                <Text className="text-sm text-[#2f3327]">¥{totalAmount.toFixed(2)}</Text>
              </View>
              <View className="flex items-center justify-between py-1">
                <Text className="text-sm text-[#4A3728]">配送费</Text>
                <Text className="text-sm text-[#2f3327]">¥0.00</Text>
              </View>
              <View className="flex items-center justify-between py-1">
                <Text className="text-sm text-[#4A3728]">优惠</Text>
                <Text className="text-sm text-[#E8833A]">-¥0.00</Text>
              </View>
              <View className="mt-2 flex items-center justify-between border-t border-[#E8DDD0] pt-3">
                <Text className="text-base font-bold text-[#2f3327]">实付金额</Text>
                <Text className="text-2xl font-bold text-[#E8833A]">
                  <Text className="text-sm">¥</Text>
                  {totalAmount.toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="food-bottom-bar">
          <View
            className={`flex w-full items-center justify-center rounded-full py-4 active:scale-[0.98] ${
              loading ? 'bg-[#E0C8B0]' : 'food-action-green'
            }`}
            onClick={loading ? undefined : handleSubmit}
          >
            <Text className="text-base font-semibold text-white">
              {loading ? '提交中...' : '✅ 提交订单'}
            </Text>
          </View>
        </View>
      </View>

      {/* Confirm modal */}
      {showConfirm && (
        <View className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <View className="bg-white rounded-3xl w-80 mx-8 overflow-hidden shadow-xl">
            <View className="p-6 text-center">
              <View className="w-16 h-16 bg-[#FFF0E6] rounded-full flex items-center justify-center mx-auto mb-4">
                <Text className="text-3xl">📋</Text>
              </View>
              <Text className="text-lg font-bold text-[#4A3728] block mb-2">确认提交订单？</Text>
              <Text className="text-sm text-[#A39584] block mb-1">{totalCount} 件商品</Text>
              <View className="flex items-baseline justify-center">
                <Text className="text-sm text-[#E8833A] font-bold">¥</Text>
                <Text className="text-3xl font-bold text-[#E8833A]">{totalAmount.toFixed(2)}</Text>
              </View>
            </View>
            <View className="flex border-t border-[#F0E6DA]">
              <View
                className="flex-1 py-3.5 flex items-center justify-center active:bg-[#F5F0EB]"
                onClick={() => setShowConfirm(false)}
              >
                <Text className="text-[#A39584] font-medium">取消</Text>
              </View>
              <View className="w-px bg-[#F0E6DA]" />
              <View
                className="flex-1 py-3.5 flex items-center justify-center active:bg-[#FFF0E6]"
                onClick={confirmSubmit}
              >
                <Text className="text-[#E8833A] font-bold">确认下单</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default ConfirmPage
