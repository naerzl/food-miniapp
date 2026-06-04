import React, { useState, useEffect, useCallback } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { reqGetTodayDishes, reqGetCategories } from '../../../services'
import { Dish, Category } from '../../../../types'
import { useCart } from '../../../store'

const SKELETON_COUNT = 4
const DISH_ICONS = [
  { keywords: ['沙拉', '生菜', '蔬', '菜'], icon: '🥗' },
  { keywords: ['饭', '米', '藜麦', '谷物'], icon: '🍚' },
  { keywords: ['汤', '粥'], icon: '🥣' },
  { keywords: ['饮', '汁', '茶', '拿铁'], icon: '🥤' },
  { keywords: ['甜', '布丁', '蛋糕'], icon: '🍮' },
  { keywords: ['鸡', '牛', '虾', '鱼', '肉'], icon: '🍗' },
]

function getDishIcon(dish: Dish) {
  const text = `${dish.name}${dish.description || ''}`
  const matched = DISH_ICONS.find((item) => item.keywords.some((keyword) => text.includes(keyword)))

  return matched?.icon || '🍽️'
}

const MenuPage: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  const { totalCount, addToCart } = useCart()

  const loadData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true)
      const [categoriesRes, dishesRes] = await Promise.all([
        reqGetCategories(),
        reqGetTodayDishes(),
      ])
      setCategories(categoriesRes || [])
      const available = (dishesRes || []).filter(
        (d: Dish) => d.todaySupply && !d.soldOut && d.available,
      )
      setDishes(available)
    } catch (error) {
      console.error('加载数据失败:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])
  useDidShow(() => {
    loadData(false)
  })

  const handleAddToCart = (dish: Dish) => {
    if (dish.soldOut || !dish.todaySupply) {
      Taro.showToast({ title: '该菜品暂时无法购买', icon: 'none' })
      return
    }
    addToCart({
      dishId: dish.id,
      dishName: dish.name,
      price: dish.price,
      quantity: 1,
      image: dish.image,
    })
    Taro.showToast({ title: '已加入购物车', icon: 'success', duration: 1000 })
  }

  const handleGoToCart = () => {
    Taro.switchTab({ url: '/pages/guest/cart/index' })
  }

  const filteredDishes =
    activeCategory === 'all' ? dishes : dishes.filter((d) => d.categoryId === activeCategory)

  if (loading) {
    return (
      <View className="food-page">
        <View className="food-hero">
          <Text className="food-hero__eyebrow">TODAY'S LIGHT MENU</Text>
          <Text className="food-hero__title">今日轻食厨房</Text>
          <Text className="food-hero__desc">新鲜备餐中，稍等一下就能看到今天的菜单。</Text>
        </View>
        <View className="px-4 pt-4">
          <View className="flex gap-3 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <View
                key={i}
                className="flex-shrink-0 w-24 h-10 bg-[#F0E6DA] rounded-full animate-pulse"
              />
            ))}
          </View>
        </View>
        <View className="px-4 pt-5 grid grid-cols-2 gap-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <View key={i} className="bg-[#F0E6DA] rounded-3xl overflow-hidden animate-pulse">
              <View className="w-full h-40 bg-[#E8DDD0]" />
              <View className="p-3 space-y-2">
                <View className="h-5 w-2/3 bg-[#E8DDD0] rounded-lg" />
                <View className="h-4 w-full bg-[#E8DDD0] rounded-lg" />
                <View className="flex justify-between items-center pt-1">
                  <View className="h-6 w-16 bg-[#E8DDD0] rounded-lg" />
                  <View className="h-8 w-8 bg-[#E8DDD0] rounded-full" />
                </View>
              </View>
            </View>
          ))}
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
        <View className="flex justify-between items-start mb-4">
          <View>
            <Text className="text-[22px] font-bold text-white block">🍽️ 今日轻食厨房</Text>
            <Text className="text-[13px] text-white/75 block mt-1">新鲜现做 · 健康美味</Text>
          </View>
        </View>
        <View className="flex gap-2 flex-wrap">
          <View
            className="px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <Text className="text-xs text-white">
              🔥 {dishes.filter((d) => d.categoryId === categories[0]?.id).length} 道热菜
            </Text>
          </View>
          <View
            className="px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <Text className="text-xs text-white">
              🥗 {dishes.filter((d) => d.categoryId === categories[1]?.id).length} 道沙拉
            </Text>
          </View>
          <View
            className="px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,255,255,0.15)' }}
          >
            <Text className="text-xs text-white">
              🥤 {dishes.filter((d) => d.categoryId === categories[2]?.id).length} 款饮品
            </Text>
          </View>
        </View>
      </View>

      {/* Category tabs */}
      <View className="food-tabs">
        <ScrollView scrollX showScrollbar={false} className="px-4">
          <View className="flex gap-2.5">
            <View
              className={`flex-shrink-0 px-[18px] py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                activeCategory === 'all'
                  ? 'text-white'
                  : 'bg-white/70 text-[#776c5b] border border-[rgba(232,221,208,0.95)]'
              }`}
              style={
                activeCategory === 'all'
                  ? {
                      background: 'linear-gradient(135deg, #ed8f3d, #e06633)',
                      borderColor: 'transparent',
                    }
                  : {}
              }
              onClick={() => setActiveCategory('all')}
            >
              <Text>全部</Text>
            </View>
            {categories.map((cat) => (
              <View
                key={cat.id}
                className={`flex-shrink-0 px-[18px] py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.id
                    ? 'text-white'
                    : 'bg-white/70 text-[#776c5b] border border-[rgba(232,221,208,0.95)]'
                }`}
                style={
                  activeCategory === cat.id
                    ? {
                        background: 'linear-gradient(135deg, #ed8f3d, #e06633)',
                        borderColor: 'transparent',
                      }
                    : {}
                }
                onClick={() => setActiveCategory(cat.id)}
              >
                <Text>{cat.name}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Dish grid */}
      {filteredDishes.length === 0 ? (
        <View className="food-empty">
          <View className="food-empty__icon">
            <Text className="text-5xl">🍽️</Text>
          </View>
          <Text className="text-lg font-semibold text-[#4A3728] mb-2">暂无菜品</Text>
          <Text className="text-sm text-[#A39584] text-center">
            厨师正在准备美味佳肴，请稍后再来
          </Text>
        </View>
      ) : (
        <ScrollView scrollY className="px-4 pt-4" style={{ height: 'calc(100vh - 180px)' }}>
          <View className="grid grid-cols-2 gap-3">
            {filteredDishes.map((dish) => (
              <View key={dish.id} className={`food-dish-card ${dish.soldOut ? 'opacity-60' : ''}`}>
                <View className="food-image-frame">
                  {dish.image ? (
                    <Image className="w-full h-40" src={dish.image} mode="aspectFill" />
                  ) : (
                    <View className="food-dish-placeholder">
                      <View className="food-dish-placeholder__plate">
                        <Text>{getDishIcon(dish)}</Text>
                      </View>
                      <View className="food-dish-placeholder__leaf food-dish-placeholder__leaf--left" />
                      <View className="food-dish-placeholder__leaf food-dish-placeholder__leaf--right" />
                    </View>
                  )}
                  <View className="food-image-tag">
                    <Text className="food-image-tag__dot">●</Text>
                    <Text>今日供应</Text>
                  </View>
                  {dish.soldOut && (
                    <View className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Text className="text-white text-sm font-semibold bg-black/60 px-4 py-1.5 rounded-full">
                        已售罄
                      </Text>
                    </View>
                  )}
                </View>
                <View className="p-3">
                  <Text className="text-[14px] font-semibold text-[#2f3327] block leading-tight truncate">
                    {dish.name}
                  </Text>
                  {dish.description && (
                    <Text className="text-xs text-[#8B7355] mt-1 block leading-snug truncate">
                      {dish.description}
                    </Text>
                  )}
                  <View className="flex items-center justify-between mt-3">
                    <View className="flex items-baseline">
                      <Text className="text-[13px] text-[#E8833A] font-medium">¥</Text>
                      <Text className="text-lg font-bold text-[#E8833A] ml-0.5">
                        {dish.price.toFixed(0)}
                      </Text>
                    </View>
                    {!dish.soldOut && (
                      <View
                        className="w-8 h-8 rounded-full flex items-center justify-center active:scale-90 transition-transform"
                        style={{
                          background: 'linear-gradient(135deg, #ed8f3d, #e06633)',
                        }}
                        onClick={() => handleAddToCart(dish)}
                      >
                        <Text className="text-white text-xl font-light leading-none">+</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
          <View className="h-4" />
        </ScrollView>
      )}

      {/* Floating cart button */}
      {totalCount > 0 && (
        <View
          className="fixed right-5 bottom-28 z-20 rounded-full px-5 py-3.5 flex items-center gap-3 active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(135deg, #ed8f3d, #e06633)',
            boxShadow: '0 6px 20px rgba(232, 131, 58, 0.4)',
          }}
          onClick={handleGoToCart}
        >
          <View className="relative">
            <Text className="text-2xl">🛒</Text>
            <View
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center"
              style={{ background: '#FF4D4F' }}
            >
              <Text className="text-white text-xs font-bold">
                {totalCount > 99 ? '99+' : totalCount}
              </Text>
            </View>
          </View>
          <Text className="text-white font-semibold text-sm">去结算</Text>
        </View>
      )}
    </View>
  )
}

export default MenuPage
