import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Textarea } from '@tarojs/components'
import { useCart, useAuth } from '../../../store'
import { reqPostCreateOrder } from '../../../services'

const ConfirmPage: React.FC = () => {
  const { items, totalCount, totalAmount, clearCart } = useCart()
  const { userInfo } = useAuth()
  const [remark, setRemark] = useState('')
  const [loading, setLoading] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSubmit = () => {
    if (items.length === 0) {
      Taro.showToast({ title: '购物车是空的', icon: 'none' })
      return
    }
    setShowConfirm(true)
  }

  const confirmSubmit = async () => {
    setShowConfirm(false)
    setLoading(true)
    try {
      const order = await reqPostCreateOrder({
        items: items.map(item => ({
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
      <View className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-8">
        <Text className="text-5xl mb-5">🛒</Text>
        <Text className="text-lg font-bold text-[#4A3728] mb-2">购物车是空的</Text>
        <Text className="text-sm text-[#A39584] mb-8">请先添加商品到购物车</Text>
        <View
          className="bg-[#E8833A] rounded-full px-10 py-3 shadow-lg shadow-[#E8833A]/25 active:scale-95"
          onClick={() => Taro.switchTab({ url: '/pages/guest/menu/index' })}
        >
          <Text className="text-white font-semibold">去逛逛</Text>
        </View>
      </View>
    )
  }

  return (
    <View className="min-h-screen bg-[#FFF8F0] pb-40">
      {/* User info */}
      <View className="bg-[#FFFAF5] mx-4 mt-4 rounded-2xl p-4 shadow-sm">
        <Text className="text-xs text-[#A39584] block mb-1">下单用户</Text>
        <View className="flex items-center gap-3">
          <View className="w-10 h-10 bg-[#F5E6D3] rounded-full flex items-center justify-center">
            <Text className="text-lg">👤</Text>
          </View>
          <Text className="text-[#4A3728] font-semibold">
            {userInfo?.nickname || '微信用户'}
          </Text>
        </View>
      </View>

      {/* Item list */}
      <View className="bg-[#FFFAF5] mx-4 mt-3 rounded-2xl p-4 shadow-sm">
        <Text className="text-xs text-[#A39584] block mb-3">
          商品清单（共 {totalCount} 件）
        </Text>
        <View className="space-y-3">
          {items.map(item => (
            <View key={item.dishId} className="flex gap-3 items-center">
              <Image
                className="w-14 h-14 rounded-xl flex-shrink-0"
                src={item.image || 'https://via.placeholder.com/100/F5E6D3/8B7355?text=%F0%9F%8D%B2'}
                mode="aspectFill"
              />
              <View className="flex-1 min-w-0">
                <Text className="text-sm font-semibold text-[#4A3728] block truncate">
                  {item.dishName}
                </Text>
                <Text className="text-xs text-[#A39584] mt-0.5 block">
                  ¥{item.price.toFixed(2)} × {item.quantity}
                </Text>
              </View>
              <Text className="text-[#E8833A] font-bold text-sm flex-shrink-0">
                ¥{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Remark */}
      <View className="bg-[#FFFAF5] mx-4 mt-3 rounded-2xl p-4 shadow-sm">
        <View className="flex items-center justify-between mb-2">
          <Text className="text-xs text-[#A39584]">订单备注</Text>
          <Text className="text-xs text-[#CCC]">{remark.length}/200</Text>
        </View>
        <Textarea
          className="w-full bg-[#FFF8F0] rounded-xl p-3 text-sm text-[#4A3728]"
          style={{ minHeight: '80px' }}
          placeholder="请输入备注信息，如口味偏好、忌口等（选填）"
          placeholderStyle="color: #CCC; font-size: 13px;"
          value={remark}
          onInput={e => setRemark(e.detail.value)}
          maxlength={200}
        />
      </View>

      {/* Amount summary */}
      <View className="bg-[#FFFAF5] mx-4 mt-3 rounded-2xl p-4 shadow-sm">
        <View className="flex justify-between items-center mb-2">
          <Text className="text-sm text-[#8B7355]">商品总额</Text>
          <Text className="text-sm text-[#4A3728]">¥{totalAmount.toFixed(2)}</Text>
        </View>
        <View className="border-t border-[#F0E6DA] my-3" />
        <View className="flex justify-between items-center">
          <Text className="text-base font-bold text-[#4A3728]">应付金额</Text>
          <View className="flex items-baseline">
            <Text className="text-sm text-[#E8833A] font-bold">¥</Text>
            <Text className="text-2xl font-bold text-[#E8833A]">{totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Submit button */}
      <View className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-[#F0E6DA] px-5 py-4">
        <View
          className={`w-full rounded-full py-3.5 flex items-center justify-center shadow-lg active:scale-[0.98] transition-transform ${
            loading ? 'bg-[#E0C8B0]' : 'bg-[#E8833A] shadow-[#E8833A]/25'
          }`}
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
              <Text className="text-lg font-bold text-[#4A3728] block mb-2">
                确认提交订单？
              </Text>
              <Text className="text-sm text-[#A39584] block mb-1">
                {totalCount} 件商品
              </Text>
              <View className="flex items-baseline justify-center">
                <Text className="text-sm text-[#E8833A] font-bold">¥</Text>
                <Text className="text-3xl font-bold text-[#E8833A]">
                  {totalAmount.toFixed(2)}
                </Text>
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
