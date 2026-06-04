import React, { useState, useEffect, useCallback } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { useAuth, useCart } from '../../../store'
import { reqGetProfile, reqGetMyStats } from '../../../services'
import type { IResGetMyStatsResponse } from '../../../services/statistics'
import { User } from '../../../../types'
import { syncCustomTabBar } from '../../../utils/tabBar'
import { getLoginUrl } from '../../../utils/env'

const ProfilePage: React.FC = () => {
  const { isLogin, logout } = useAuth()
  const { clearCart } = useCart()
  const [, setLoading] = useState(false)
  const [userDetail, setUserDetail] = useState<User | null>(null)
  const [myStats, setMyStats] = useState<IResGetMyStatsResponse | null>(null)

  const loadUserData = useCallback(async () => {
    if (!isLogin) return
    try {
      setLoading(true)
      const [profileData, statsData] = await Promise.all([
        reqGetProfile(),
        reqGetMyStats().catch(() => null),
      ])
      setUserDetail(profileData)
      setMyStats(statsData)
    } catch (error) {
      console.error('加载用户数据失败:', error)
    } finally {
      setLoading(false)
    }
  }, [isLogin])

  useEffect(() => {
    loadUserData()
  }, [loadUserData])
  useDidShow(() => {
    syncCustomTabBar(2)
    loadUserData()
  })

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout()
          clearCart()
          Taro.showToast({ title: '已退出登录', icon: 'success' })
        }
      },
    })
  }

  useEffect(() => {
    if (!isLogin) {
      Taro.redirectTo({ url: getLoginUrl() })
    }
  }, [isLogin])

  if (!isLogin) {
    return (
      <View className="food-page flex items-center justify-center">
        <View className="food-mobile flex items-center justify-center">
          <Text className="text-sm text-[#A39584]">正在跳转登录页...</Text>
        </View>
      </View>
    )
  }

  const menuItems = [
    {
      icon: '📋',
      label: '我的订单',
      color: '#E8833A',
      bg: '#FFF0E6',
      url: '/pages/guest/orders/index',
    },
    {
      icon: '🛒',
      label: '购物车',
      color: '#E8833A',
      bg: '#FFF0E6',
      url: '/pages/guest/cart/index',
    },
    {
      icon: '🍽️',
      label: '菜单浏览',
      color: '#E8833A',
      bg: '#FFF0E6',
      url: '/pages/guest/menu/index',
    },
  ]

  const otherItems = [
    { icon: '🏠', label: '地址管理', color: '#5B8A4D', bg: '#E8F5E9' },
    { icon: '💳', label: '支付方式', color: '#1677FF', bg: '#E6F4FF' },
    { icon: '🎁', label: '优惠券', color: '#722ED1', bg: '#F9F0FF' },
    { icon: '⭐', label: '我的收藏', color: '#E8833A', bg: '#FFF0E6' },
    { icon: '📞', label: '联系客服', color: '#5B8A4D', bg: '#E8F5E9' },
    { icon: '⚙️', label: '设置', color: '#1677FF', bg: '#E6F4FF' },
  ]

  return (
    <View className="food-page">
      <View className="food-mobile">
        <View className="food-hero food-hero--profile">
          <View className="flex items-center gap-4">
            {userDetail?.avatar ? (
              <Image
                className="h-16 w-16 flex-shrink-0 rounded-full border-[3px] border-white/30"
                src={userDetail.avatar}
                mode="aspectFill"
              />
            ) : (
              <View className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-[3px] border-white/30 bg-[#FFFDF7]">
                <Text className="text-[32px]">👤</Text>
              </View>
            )}
            <View className="min-w-0 flex-1">
              <Text className="block truncate text-xl font-bold text-white">
                {userDetail?.nickname || userDetail?.username || '微信用户'}
              </Text>
              <Text className="mt-1 block text-[13px] text-white/75">
                {userDetail?.phone || '享受美味，享受生活'}
              </Text>
            </View>
          </View>
        </View>

        <View className="relative z-[2] -mt-2 px-4 pt-4">
          <View className="food-card p-5">
            <View className="grid grid-cols-3 gap-4">
              <View className="text-center">
                <Text className="block text-[22px] font-bold text-[#E8833A]">
                  {myStats?.totalOrders ?? 0}
                </Text>
                <Text className="mt-1 block text-xs text-[#8B7355]">累计订单</Text>
              </View>
              <View className="text-center">
                <Text className="block text-[22px] font-bold text-[#E8833A]">
                  ¥{myStats?.totalSpent ?? 0}
                </Text>
                <Text className="mt-1 block text-xs text-[#8B7355]">累计消费</Text>
              </View>
              <View className="text-center">
                <Text className="block text-[22px] font-bold text-[#E8833A]">
                  {myStats?.totalOrders ?? 0}
                </Text>
                <Text className="mt-1 block text-xs text-[#8B7355]">待取餐</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="px-4 pt-3 pb-[100px]">
          <View className="food-card overflow-hidden">
            {menuItems.map((item, i) => (
              <View key={item.label}>
                {i > 0 && <View className="ml-16 border-t border-[#E8DDD0]" />}
                <View
                  className="flex items-center gap-3 px-5 py-4 active:bg-[#00000008] transition-colors"
                  onClick={() => Taro.switchTab({ url: item.url })}
                >
                  <View
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: item.bg }}
                  >
                    <Text className="text-lg">{item.icon}</Text>
                  </View>
                  <Text className="flex-1 text-[15px] font-medium text-[#2f3327]">
                    {item.label}
                  </Text>
                  <Text className="text-lg text-[#A39584]">›</Text>
                </View>
              </View>
            ))}
            {otherItems.map((item) => (
              <View key={item.label}>
                <View className="ml-16 border-t border-[#E8DDD0]" />
                <View
                  className="flex items-center gap-3 px-5 py-4 active:bg-[#00000008] transition-colors"
                  onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}
                >
                  <View
                    className="flex h-9 w-9 items-center justify-center rounded-xl"
                    style={{ backgroundColor: item.bg }}
                  >
                    <Text className="text-lg">{item.icon}</Text>
                  </View>
                  <Text className="flex-1 text-[15px] font-medium text-[#2f3327]">
                    {item.label}
                  </Text>
                  <Text className="text-lg text-[#A39584]">›</Text>
                </View>
              </View>
            ))}
          </View>

          <View className="px-0 py-6">
            <View
              className="flex w-full items-center justify-center rounded-full border border-[#E8DDD0] bg-transparent py-3.5 active:scale-[0.98] transition-transform"
              onClick={handleLogout}
            >
              <Text className="font-medium text-[#8B7355]">退出登录</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

export default ProfilePage
