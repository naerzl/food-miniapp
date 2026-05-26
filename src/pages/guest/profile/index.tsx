import React, { useState, useEffect, useCallback } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { useAuth, useCart } from '../../../store'
import { reqGetProfile, reqPostWechatLogin, reqGetMyStats } from '../../../services'
import type { IResGetMyStatsResponse } from '../../../services/statistics'
import { User } from '../../../../types'

const ProfilePage: React.FC = () => {
  const { isLogin, login, logout } = useAuth()
  const { clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [userDetail, setUserDetail] = useState<User | null>(null)
  const [myStats, setMyStats] = useState<IResGetMyStatsResponse | null>(null)
  const [statsLoading, setStatsLoading] = useState(false)

  const loadUserData = useCallback(async () => {
    if (!isLogin) return
    try {
      setLoading(true)
      setStatsLoading(true)
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
      setStatsLoading(false)
    }
  }, [isLogin])

  useEffect(() => { loadUserData() }, [loadUserData])
  useDidShow(() => { loadUserData() })

  const handleWechatLogin = async () => {
    try {
      setLoading(true)
      const { code } = await Taro.login()
      const res = await reqPostWechatLogin({ code })
      login(res.accessToken, {
        id: res.user.id,
        username: res.user.username,
        nickname: res.user.nickname,
        avatar: res.user.avatar,
        role: res.user.role as 'admin' | 'merchant' | 'user',
      })
      Taro.showToast({ title: '登录成功', icon: 'success' })
      loadUserData()
    } catch (error) {
      Taro.showToast({ title: '登录失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

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

  if (!isLogin) {
    return (
      <View className="min-h-screen bg-[#FFF8F0] flex flex-col items-center justify-center px-8">
        <View className="w-24 h-24 bg-[#F5E6D3] rounded-full flex items-center justify-center mb-6">
          <Text className="text-5xl">👋</Text>
        </View>
        <Text className="text-xl font-bold text-[#4A3728] mb-2">欢迎使用私厨点餐</Text>
        <Text className="text-sm text-[#A39584] mb-10 text-center">
          登录后可查看订单、享受更多服务
        </Text>
        <View
          className={`w-full rounded-full py-3.5 flex items-center justify-center shadow-lg active:scale-[0.98] transition-transform ${
            loading ? 'bg-[#E0C8B0]' : 'bg-[#E8833A] shadow-[#E8833A]/25'
          }`}
          onClick={loading ? undefined : handleWechatLogin}
        >
          <Text className="text-white font-semibold text-base">
            {loading ? '登录中...' : '微信一键登录'}
          </Text>
        </View>
      </View>
    )
  }

  const menuItems = [
    { icon: '📋', label: '我的订单', color: '#FF7A45', bg: '#FFF0E6', url: '/pages/guest/orders/index' },
    { icon: '🛒', label: '购物车', color: '#FF7A45', bg: '#FFF0E6', url: '/pages/guest/cart/index' },
    { icon: '🍽️', label: '菜单浏览', color: '#FF7A45', bg: '#FFF0E6', url: '/pages/guest/menu/index' },
  ]

  const otherItems = [
    { icon: '📞', label: '联系私厨', color: '#1677FF', bg: '#E6F4FF' },
    { icon: '💬', label: '意见反馈', color: '#52C41A', bg: '#F6FFED' },
  ]

  return (
    <View className="min-h-screen bg-[#FFF8F0]">
      {/* User card */}
      <View className="mx-4 mt-4 bg-[#FFFAF5] rounded-3xl p-5 shadow-sm">
        <View className="flex items-center gap-4">
          <Image
            className="w-16 h-16 rounded-full border-2 border-white shadow-md"
            src={userDetail?.avatar || 'https://via.placeholder.com/100/F5E6D3/8B7355?text=%F0%9F%91%A4'}
            mode="aspectFill"
          />
          <View>
            <Text className="text-lg font-bold text-[#4A3728] block">
              {userDetail?.nickname || userDetail?.username || '微信用户'}
            </Text>
            <Text className="text-xs text-[#A39584] mt-0.5 block">
              享受美味，享受生活
            </Text>
          </View>
        </View>
      </View>

      {loading && (
        <View className="flex justify-center mt-4">
          <Text className="text-xs text-[#CCC]">加载中...</Text>
        </View>
      )}

      {/* Stats skeleton */}
      {statsLoading && !myStats && (
        <View className="bg-[#FFFAF5] mx-4 mt-3 rounded-3xl p-5 shadow-sm animate-pulse">
          <View className="h-4 w-16 bg-[#E8DDD0] rounded-lg mb-3" />
          <View className="grid grid-cols-3 gap-3">
            {[1,2,3].map(i => (
              <View key={i} className="text-center">
                <View className="h-6 w-12 bg-[#E8DDD0] rounded-lg mx-auto" />
                <View className="h-3 w-10 bg-[#E8DDD0] rounded-lg mx-auto mt-2" />
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Stats card */}
      {myStats && (
        <View className="bg-[#FFFAF5] mx-4 mt-3 rounded-3xl p-5 shadow-sm">
          <Text className="text-xs text-[#A39584] block mb-3">消费统计</Text>
          <View className="grid grid-cols-3 gap-3">
            <View className="text-center">
              <Text className="text-lg font-bold text-[#E8833A] block">¥{myStats.totalSpent}</Text>
              <Text className="text-xs text-[#A39584] mt-1 block">累计消费</Text>
            </View>
            <View className="text-center">
              <Text className="text-lg font-bold text-[#E8833A] block">¥{myStats.monthlySpent}</Text>
              <Text className="text-xs text-[#A39584] mt-1 block">本月消费</Text>
            </View>
            <View className="text-center">
              <Text className="text-lg font-bold text-[#E8833A] block">{myStats.totalOrders}</Text>
              <Text className="text-xs text-[#A39584] mt-1 block">订单总数</Text>
            </View>
          </View>
          {myStats.favoriteDish && (
            <View className="mt-3 pt-3 border-t border-[#F5E6D3] flex items-center justify-between">
              <Text className="text-xs text-[#A39584]">最爱菜品</Text>
              <View className="flex items-center gap-2">
                <Text className="text-sm font-semibold text-[#4A3728]">{myStats.favoriteDish.name}</Text>
                <Text className="text-xs text-[#E8833A]">×{myStats.favoriteDish.count}</Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Main menu */}
      <View className="bg-[#FFFAF5] mx-4 mt-3 rounded-3xl overflow-hidden shadow-sm">
        {menuItems.map((item, i) => (
          <View key={item.label}>
            {i > 0 && <View className="ml-16 border-t border-[#F5E6D3]" />}
            <View
              className="flex items-center gap-4 px-5 py-4 active:bg-[#FFF8F0] transition-colors"
              onClick={() => Taro.switchTab({ url: item.url })}
            >
              <View
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: item.bg }}
              >
                <Text className="text-lg">{item.icon}</Text>
              </View>
              <Text className="flex-1 text-[15px] font-semibold text-[#4A3728]">{item.label}</Text>
              <Text className="text-[#D0C8BC] text-lg">›</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Secondary menu */}
      <View className="bg-[#FFFAF5] mx-4 mt-3 rounded-3xl overflow-hidden shadow-sm">
        {otherItems.map((item, i) => (
          <View key={item.label}>
            {i > 0 && <View className="ml-16 border-t border-[#F5E6D3]" />}
            <View
              className="flex items-center gap-4 px-5 py-4 active:bg-[#FFF8F0] transition-colors"
              onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}
            >
              <View
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: item.bg }}
              >
                <Text className="text-lg">{item.icon}</Text>
              </View>
              <Text className="flex-1 text-[15px] font-semibold text-[#4A3728]">{item.label}</Text>
              <Text className="text-[#D0C8BC] text-lg">›</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Logout */}
      <View className="mx-4 mt-6 mb-8">
        <View
          className="w-full bg-white border border-[#E8DDD0] rounded-full py-3.5 flex items-center justify-center active:scale-[0.98] transition-transform"
          onClick={handleLogout}
        >
          <Text className="text-[#A39584] font-medium">退出登录</Text>
        </View>
      </View>
    </View>
  )
}

export default ProfilePage
