import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { useCart } from '../../../store'
import { AuthGuard } from '../../../components/AuthGuard'

const CartPage: React.FC = () => {
  const { items, totalCount, totalAmount, removeFromCart, updateQuantity, clearCart } = useCart()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleCheckout = () => {
    if (items.length === 0) {
      Taro.showToast({ title: '购物车是空的', icon: 'none' })
      return
    }
    Taro.navigateTo({ url: '/pages/guest/confirm/index' })
  }

  if (items.length === 0) {
    return (
      <AuthGuard>
        <View className="food-page">
          <View className="food-mobile">
            <View className="food-empty">
              <View className="food-empty__icon">
                <Text className="text-5xl">🛒</Text>
              </View>
              <Text className="mb-2 text-xl font-bold text-[#4A3728]">购物车是空的</Text>
              <Text className="mb-8 text-sm text-[#A39584]">快去选购美味佳肴吧</Text>
              <View
                className="food-action-green rounded-full px-10 py-3 font-semibold active:scale-95 transition-transform"
                onClick={() => Taro.switchTab({ url: '/pages/guest/menu/index' })}
              >
                <Text className="text-white">去逛逛</Text>
              </View>
            </View>
          </View>
        </View>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <View className="food-page food-page--bottom">
        <View className="food-mobile">
          <View className="food-hero">
            <Text className="food-hero__title">🛒 我的购物车</Text>
            <Text className="food-hero__desc">共 {totalCount} 件商品，精选健康美味</Text>
          </View>

          <View className="flex items-center justify-between px-5 py-4">
            <Text className="text-sm font-semibold text-[#4A3728]">
              共 <Text className="font-bold text-[#E8833A]">{totalCount}</Text> 件商品
            </Text>
            <View
              className="rounded-full border border-[#E8DDD0] bg-white px-4 py-1.5 active:scale-95 transition-transform"
              onClick={() => setShowClearConfirm(true)}
            >
              <Text className="text-xs text-[#A39584]">清空</Text>
            </View>
          </View>

          <View className="space-y-3 px-4 pb-[140px]">
            {items.map((item) => (
              <View key={item.dishId} className="food-card flex gap-3 p-4">
                {item.image ? (
                  <Image
                    className="h-20 w-20 flex-shrink-0 rounded-[20px]"
                    src={item.image}
                    mode="aspectFill"
                  />
                ) : (
                  <View className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-[20px] bg-[#E8F5E9]">
                    <Text className="text-[32px]">🥗</Text>
                  </View>
                )}
                <View className="flex min-w-0 flex-1 flex-col justify-between">
                  <View>
                    <Text className="block truncate text-[15px] font-semibold text-[#2f3327]">
                      {item.dishName}
                    </Text>
                    <Text className="mt-0.5 block text-xs text-[#8B7355]">健康轻食 · 当日现做</Text>
                  </View>
                  <View className="mt-2 flex items-center justify-between">
                    <Text className="text-lg font-bold text-[#E8833A]">
                      <Text className="text-[13px]">¥</Text>
                      {item.price.toFixed(0)}
                    </Text>
                    <View className="flex items-center gap-2">
                      <View className="qty-control">
                        <View
                          className="qty-btn active:scale-90"
                          onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
                        >
                          <Text>−</Text>
                        </View>
                        <Text className="qty-value">{item.quantity}</Text>
                        <View
                          className="qty-btn active:scale-90"
                          onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
                        >
                          <Text>+</Text>
                        </View>
                      </View>
                      <View
                        className="food-delete-btn"
                        onClick={() => {
                          Taro.showModal({
                            title: '提示',
                            content: '确定要删除这个商品吗？',
                            success: (res) => {
                              if (res.confirm) removeFromCart(item.dishId)
                            },
                          })
                        }}
                      >
                        <Text className="text-sm">×</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View className="food-bottom-bar">
            <View className="mb-3 flex items-center justify-between">
              <Text className="text-sm text-[#4A3728]">合计</Text>
              <Text className="text-2xl font-bold text-[#E8833A]">
                <Text className="text-sm">¥</Text>
                {totalAmount.toFixed(2)}
              </Text>
            </View>
            <View
              className="food-action-green flex w-full items-center justify-center rounded-full py-4 active:scale-[0.98]"
              onClick={handleCheckout}
            >
              <Text className="text-base font-semibold text-white">去结算 ({totalCount})</Text>
            </View>
          </View>
        </View>

        {/* Clear confirm modal */}
        {showClearConfirm && (
          <View className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <View className="bg-white rounded-3xl w-72 p-6 mx-8 shadow-xl">
              <Text className="text-lg font-bold text-[#4A3728] block text-center mb-2">
                确认清空购物车？
              </Text>
              <Text className="text-sm text-[#A39584] block text-center mb-6">清空后无法恢复</Text>
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
    </AuthGuard>
  )
}

export default CartPage
