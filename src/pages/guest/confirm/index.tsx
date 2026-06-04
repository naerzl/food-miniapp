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
        <View className="food-empty">
          <View className="food-empty__icon">
            <Text className="text-5xl">🛒</Text>
          </View>
          <Text className="text-lg font-bold text-[#4A3728] mb-2">购物车是空的</Text>
          <Text className="text-sm text-[#A39584] mb-8">请先添加商品到购物车</Text>
          <View
            className="food-action rounded-full px-10 py-3 active:scale-95"
            onClick={() => Taro.switchTab({ url: '/pages/guest/menu/index' })}
          >
            <Text className="text-white font-semibold">去逛逛</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="food-page food-page--bottom">
      {/* Hero */}
      <View
        className="mx-4 mt-3 pt-5 px-5 pb-6 rounded-b-[24px] relative z-[1]"
        style={{
          background: 'linear-gradient(135deg, #2f5e3f, #538a56)',
          boxShadow: '0 8px 32px rgba(47, 94, 63, 0.2)',
        }}
      >
        <Text className="text-[22px] font-bold text-white block">📋 确认订单</Text>
        <Text className="text-[13px] text-white/75 block mt-1">请核对订单信息，确认后提交</Text>
      </View>

      {/* User info */}
      <View className="food-card mx-4 mt-4 p-5">
        <Text className="text-base font-bold text-[#2f3327] block mb-4">👤 用户信息</Text>
        <View className="space-y-3">
          <View className="flex justify-between items-center py-2 border-b border-[#F0E6DA]">
            <Text className="text-sm text-[#8B7355]">联系人</Text>
            <Text className="text-sm font-semibold text-[#2f3327]">
              {userInfo?.nickname || userInfo?.username || '微信用户'}
            </Text>
          </View>
        </View>
      </View>

      {/* Item list */}
      <View className="food-card mx-4 mt-3 p-5">
        <Text className="text-base font-bold text-[#2f3327] block mb-4">🍽️ 商品清单</Text>
        <View className="space-y-3">
          {items.map((item) => (
            <View
              key={item.dishId}
              className="flex justify-between items-center py-2 border-b border-[#F0E6DA] last:border-b-0"
            >
              <View className="flex items-center">
                <Text className="text-sm text-[#2f3327]">{item.dishName}</Text>
                <Text className="text-[13px] text-[#8B7355] ml-2">x{item.quantity}</Text>
              </View>
              <Text className="text-sm font-semibold text-[#2f3327]">
                ¥{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Remark */}
      <View className="food-card mx-4 mt-3 p-5">
        <View className="flex items-center justify-between mb-3">
          <Text className="text-base font-bold text-[#2f3327]">📝 订单备注</Text>
          <Text className="text-xs text-[#CCC]">{remark.length}/200</Text>
        </View>
        <Textarea
          className="w-full bg-[#FFF8F0] rounded-2xl p-3 text-sm text-[#2f3327]"
          style={{ minHeight: '80px' }}
          placeholder="请输入特殊要求，如口味偏好、过敏原等..."
          placeholderStyle="color: #CCC; font-size: 13px;"
          value={remark}
          onInput={(e) => setRemark(e.detail.value)}
          maxlength={200}
        />
      </View>

      {/* Amount summary */}
      <View className="food-card mx-4 mt-3 p-5">
        <Text className="text-base font-bold text-[#2f3327] block mb-4">💰 金额汇总</Text>
        <View className="space-y-2">
          <View className="flex justify-between items-center">
            <Text className="text-sm text-[#8B7355]">商品总价</Text>
            <Text className="text-sm text-[#2f3327]">¥{totalAmount.toFixed(2)}</Text>
          </View>
          <View className="flex justify-between items-center">
            <Text className="text-sm text-[#8B7355]">配送费</Text>
            <Text className="text-sm text-[#2f3327]">¥0.00</Text>
          </View>
          <View className="flex justify-between items-center">
            <Text className="text-sm text-[#8B7355]">优惠</Text>
            <Text className="text-sm" style={{ color: '#E8833A' }}>
              -¥0.00
            </Text>
          </View>
          <View className="border-t border-[#F0E6DA] pt-3 mt-2 flex justify-between items-center">
            <Text className="text-base font-bold text-[#2f3327]">实付金额</Text>
            <View className="flex items-baseline">
              <Text className="text-sm text-[#E8833A] font-bold">¥</Text>
              <Text className="text-2xl font-bold text-[#E8833A]">{totalAmount.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Submit button */}
      <View
        className="fixed bottom-0 left-0 right-0 px-5 py-4 z-[100]"
        style={{
          background: 'rgba(255, 252, 245, 0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(232, 221, 208, 0.95)',
        }}
      >
        <View
          className={`w-full rounded-full py-3.5 flex items-center justify-center shadow-lg active:scale-[0.98] transition-transform ${
            loading ? 'bg-[#E0C8B0]' : ''
          }`}
          style={
            loading
              ? {}
              : {
                  background: 'linear-gradient(135deg, #ed8f3d, #e06633)',
                  boxShadow: '0 12px 26px rgba(224, 102, 51, 0.26)',
                }
          }
          onClick={loading ? undefined : handleSubmit}
        >
          <Text className="text-white font-semibold text-base">
            {loading ? '提交中...' : '提交订单'}
          </Text>
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
