import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { useCart, useAuth } from '../../../store'

const CartPage: React.FC = () => {
  const { items, totalCount, totalAmount, removeFromCart, updateQuantity, clearCart } = useCart()
  const { isLogin } = useAuth()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleCheckout = () => {
    if (items.length === 0) {
      Taro.showToast({ title: '购物车是空的', icon: 'none' })
      return
    }
    if (!isLogin) {
      Taro.navigateTo({ url: '/pages/guest/login/index' })
      return
    }
    Taro.navigateTo({ url: '/pages/guest/confirm/index' })
  }

  if (items.length === 0) {
    return (
      <View className="food-page">
        <View className="food-empty">
          <View className="food-empty__icon">
            <Text className="text-5xl">🛒</Text>
          </View>
          <Text className="text-xl font-bold text-[#4A3728] mb-2">购物车是空的</Text>
          <Text className="text-sm text-[#A39584] mb-8">快去选购美味佳肴吧</Text>
          <View
            className="food-action text-white px-10 py-3 rounded-full font-semibold text-base active:scale-95 transition-transform"
            onClick={() => Taro.switchTab({ url: '/pages/guest/menu/index' })}
          >
            <Text className="text-white">去逛逛</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="food-page food-page--bottom">
      <View className="food-hero">
        <Text className="food-hero__eyebrow">YOUR CART</Text>
        <Text className="food-hero__title">准备下单</Text>
        <Text className="food-hero__desc">确认菜品数量，厨房会按这份清单为你备餐。</Text>
        <View className="food-hero__chips">
          <View className="food-chip">
            <Text>商品</Text>
            <Text>{totalCount} 件</Text>
          </View>
          <View className="food-chip">
            <Text>合计</Text>
            <Text>¥{totalAmount.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* Header */}
      <View className="flex items-center justify-between px-5 py-4">
        <Text className="text-[#4A3728] font-semibold text-sm">
          共 <Text className="text-[#E8833A] font-bold">{totalCount}</Text> 件商品
        </Text>
        <View
          className="bg-white border border-[#E8DDD0] px-4 py-1.5 rounded-full active:scale-95 transition-transform"
          onClick={() => setShowClearConfirm(true)}
        >
          <Text className="text-[#A39584] text-xs">清空</Text>
        </View>
      </View>

      {/* Item list */}
      <View className="px-4 space-y-3">
        {items.map(item => (
          <View key={item.dishId} className="food-card p-3 flex gap-3">
            <Image
              className="w-20 h-20 rounded-xl flex-shrink-0"
              src={item.image || 'https://via.placeholder.com/150/F5E6D3/8B7355?text=%F0%9F%8D%B2'}
              mode="aspectFill"
            />
            <View className="flex-1 flex flex-col justify-between min-w-0">
              <View>
                <Text className="text-[15px] font-semibold text-[#4A3728] block truncate">
                  {item.dishName}
                </Text>
                <Text className="text-sm text-[#E8833A] font-medium mt-0.5 block">
                  ¥{item.price.toFixed(2)}
                </Text>
              </View>
              <View className="flex items-center justify-between">
                <Text className="text-xs text-[#A39584]">
                  小计 ¥{(item.price * item.quantity).toFixed(2)}
                </Text>
                <View className="flex items-center gap-2">
                  <View
                    className="w-7 h-7 bg-[#F5E6D3] rounded-full flex items-center justify-center active:scale-90 transition-transform"
                    onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
                  >
                    <Text className="text-[#4A3728] text-base font-medium leading-none">−</Text>
                  </View>
                  <Text className="text-[#4A3728] font-bold text-base w-7 text-center">
                    {item.quantity}
                  </Text>
                  <View
                    className="w-7 h-7 food-action rounded-full flex items-center justify-center active:scale-90 transition-transform"
                    onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
                  >
                    <Text className="text-white text-base font-medium leading-none">+</Text>
                  </View>
                </View>
              </View>
            </View>
            <View
              className="flex-shrink-0 flex items-center"
              onClick={() => {
                Taro.showModal({
                  title: '提示',
                  content: '确定要删除这个商品吗？',
                  success: (res) => { if (res.confirm) removeFromCart(item.dishId) },
                })
              }}
            >
              <Text className="text-[#CCC] text-xs">✕</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Bottom checkout bar */}
      <View className="food-bottom-bar px-5 py-4 flex items-center justify-between">
        <View>
          <Text className="text-xs text-[#A39584]">合计</Text>
          <View className="flex items-baseline">
            <Text className="text-sm text-[#E8833A] font-bold">¥</Text>
            <Text className="text-2xl font-bold text-[#E8833A]">
              {totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
        <View
          className="food-action rounded-full px-10 py-3.5 active:scale-95 transition-transform"
          onClick={handleCheckout}
        >
          <Text className="text-white font-semibold text-base">
            去下单 ({totalCount})
          </Text>
        </View>
      </View>

      {/* Clear confirm modal */}
      {showClearConfirm && (
        <View className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <View className="bg-white rounded-3xl w-72 p-6 mx-8 shadow-xl">
            <Text className="text-lg font-bold text-[#4A3728] block text-center mb-2">
              确认清空购物车？
            </Text>
            <Text className="text-sm text-[#A39584] block text-center mb-6">
              清空后无法恢复
            </Text>
            <View className="flex gap-3">
              <View
                className="flex-1 bg-[#F5F0EB] rounded-full py-3 flex items-center justify-center active:scale-95 transition-transform"
                onClick={() => setShowClearConfirm(false)}
              >
                <Text className="text-[#8B7355] font-medium text-sm">取消</Text>
              </View>
              <View
                className="flex-1 bg-[#FF4D4F] rounded-full py-3 flex items-center justify-center active:scale-95 transition-transform"
                onClick={() => {
                  clearCart()
                  setShowClearConfirm(false)
                  Taro.showToast({ title: '已清空', icon: 'success' })
                }}
              >
                <Text className="text-white font-medium text-sm">清空</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}

export default CartPage
