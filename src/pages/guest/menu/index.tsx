import React, { useState, useEffect, useCallback } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, ScrollView, Image } from '@tarojs/components'
import { reqGetTodayDishes, reqGetCategories } from '../../../services'
import { Dish, Category } from '../../../../types'
import { useCart } from '../../../store'
import { syncCustomTabBar } from '../../../utils/tabBar'

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
    syncCustomTabBar(0)
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
      price: Number(dish.price),
      quantity: 1,
      image: dish.image,
    })
    Taro.showToast({ title: '已加入购物车', icon: 'success', duration: 1000 })
  }

  const handleGoToCart = () => {
    Taro.navigateTo({ url: '/pages/guest/cart/index' })
  }

  const filteredDishes =
    activeCategory === 'all' ? dishes : dishes.filter((d) => d.categoryId === activeCategory)

  if (loading) {
    return (
      <View className="food-page">
        <View className="food-mobile">
          <View className="food-hero">
            <Text className="food-hero__title">🍽️ 今日轻食厨房</Text>
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
          <View className="grid grid-cols-2 gap-3 px-4 pt-5">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <View key={i} className="overflow-hidden rounded-3xl bg-[#F0E6DA] animate-pulse">
                <View className="h-[140px] w-full bg-[#E8DDD0]" />
                <View className="space-y-2 p-3">
                  <View className="h-5 w-2/3 rounded-lg bg-[#E8DDD0]" />
                  <View className="h-4 w-full rounded-lg bg-[#E8DDD0]" />
                  <View className="flex items-center justify-between pt-1">
                    <View className="h-6 w-16 rounded-lg bg-[#E8DDD0]" />
                    <View className="h-8 w-8 rounded-full bg-[#E8DDD0]" />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    )
  }

  return (
    <View className="food-page food-page--bottom">
      <View className="food-mobile">
        <View className="food-hero">
          <View className="mb-4">
            <Text className="food-hero__title">🍽️ 今日轻食厨房</Text>
            <Text className="food-hero__desc">新鲜现做 · 健康美味</Text>
          </View>
          <View className="food-hero__chips">
            <View className="food-chip">
              <Text>
                🔥 {dishes.filter((d) => d.categoryId === categories[0]?.id).length} 道热菜
              </Text>
            </View>
            <View className="food-chip">
              <Text>
                🥗 {dishes.filter((d) => d.categoryId === categories[1]?.id).length} 道沙拉
              </Text>
            </View>
            <View className="food-chip">
              <Text>
                🥤 {dishes.filter((d) => d.categoryId === categories[2]?.id).length} 款饮品
              </Text>
            </View>
          </View>
        </View>

        <View className="food-tabs">
          <ScrollView scrollX showScrollbar={false} className="px-4">
            <View className="flex gap-2.5">
              <View
                className={`food-pill food-pill--large ${activeCategory === 'all' ? 'food-pill--active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                <Text>全部</Text>
              </View>
              {categories.map((cat) => (
                <View
                  key={cat.id}
                  className={`food-pill food-pill--large ${
                    activeCategory === cat.id ? 'food-pill--active' : ''
                  }`}
                  onClick={() => setActiveCategory(cat.id)}
                >
                  <Text>{cat.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {filteredDishes.length === 0 ? (
          <View className="food-empty">
            <View className="food-empty__icon">
              <Text className="text-5xl">🍽️</Text>
            </View>
            <Text className="mb-2 text-lg font-semibold text-[#4A3728]">暂无菜品</Text>
            <Text className="text-center text-sm text-[#A39584]">
              厨师正在准备美味佳肴，请稍后再来
            </Text>
          </View>
        ) : (
          <View className="grid grid-cols-2 gap-3 px-4 pt-4 pb-[100px]">
            {filteredDishes.map((dish) => (
              <View key={dish.id} className={`food-dish-card ${dish.soldOut ? 'opacity-60' : ''}`}>
                <View className="food-image-frame">
                  {dish.image ? (
                    <Image className="h-[140px] w-full" src={dish.image} mode="aspectFill" />
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
                      <Text className="text-lg font-bold text-[#E8833A] ml-0.5">{dish.price}</Text>
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
        )}

        {totalCount > 0 && (
          <View
            className="food-action fixed bottom-[90px] right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full active:scale-95 transition-transform"
            onClick={handleGoToCart}
          >
            <Text className="text-2xl">🛒</Text>
            <View className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF4D4F]">
              <Text className="text-[11px] font-semibold text-white">
                {totalCount > 99 ? '99+' : totalCount}
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  )
}

export default MenuPage
