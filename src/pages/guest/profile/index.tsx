import React, { useState, useEffect, useCallback } from 'react'
import Taro, { useDidShow } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { useAuth, useCart } from '../../../store'
import { reqGetProfile, reqPostWechatLogin, reqGetMyStats } from '../../../services'
import type { IResGetMyStatsResponse } from '../../../services/statistics'
import { User } from '../../../../types'

const IS_H5 = Taro.getEnv() === Taro.ENV_TYPE.WEB

const ProfilePage: React.FC = () => {
  const { isLogin, login, logout } = useAuth()
  const { clearCart } = useCart()
  const [loading, setLoading] = useState(false)
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
    loadUserData()
  })

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

  useEffect(() => {
    if (IS_H5 && !isLogin) {
      Taro.redirectTo({ url: '/pages/guest/login/index' })
    }
  }, [isLogin])

  if (!isLogin) {
    if (IS_H5) {
      return (
        <View className="food-page flex items-center justify-center">
          <Text className="text-sm text-[#A39584]">正在跳转登录页...</Text>
        </View>
      )
    }
    return (
      <View className="food-page flex flex-col items-center justify-center px-8">
        <View className="food-empty__icon">
          <Text className="text-5xl">👋</Text>
        </View>
        <Text className="text-xl font-bold text-[#4A3728] mb-2">欢迎使用私厨点餐</Text>
        <Text className="text-sm text-[#A39584] mb-10 text-center">
          登录后可查看订单、享受更多服务
        </Text>
        <View
          className={`w-full rounded-full py-3.5 flex items-center justify-center shadow-lg active:scale-[0.98] transition-transform ${
            loading ? 'bg-[#E0C8B0]' : 'food-action'
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
      {/* User card */}
      <View
        className="mx-4 mt-3 pt-8 px-5 pb-6 rounded-b-[24px] relative z-[1]"
        style={{
          background: 'linear-gradient(135deg, #2f5e3f, #538a56)',
          boxShadow: '0 8px 32px rgba(47, 94, 63, 0.2)',
        }}
      >
        <View className="flex items-center gap-4">
          <Image
            className="w-16 h-16 rounded-full border-2 border-white/30 shadow-md"
            src={
              userDetail?.avatar ||
              'https://via.placeholder.com/100/F5E6D3/8B7355?text=%F0%9F%91%A4'
            }
            mode="aspectFill"
          />
          <View>
            <Text className="text-xl font-bold text-white block">
              {userDetail?.nickname || userDetail?.username || '微信用户'}
            </Text>
            <Text className="text-[13px] text-white/75 mt-1 block">
              {userDetail?.phone || '享受美味，享受生活'}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View className="px-4 -mt-2 relative z-[2]">
        <View className="food-card p-5">
          <View className="grid grid-cols-3 gap-4">
            <View className="text-center">
              <Text className="text-[22px] font-bold text-[#E8833A] block">
                {myStats?.totalOrders ?? 0}
              </Text>
              <Text className="text-xs text-[#8B7355] mt-1 block">累计订单</Text>
            </View>
            <View className="text-center">
              <Text className="text-[22px] font-bold text-[#E8833A] block">
                ¥{myStats?.totalSpent ?? 0}
              </Text>
              <Text className="text-xs text-[#8B7355] mt-1 block">累计消费</Text>
            </View>
            <View className="text-center">
              <Text className="text-[22px] font-bold text-[#E8833A] block">
                {myStats?.totalOrders ?? 0}
              </Text>
              <Text className="text-xs text-[#8B7355] mt-1 block">待取餐</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Main menu */}
      <View className="food-card mx-4 mt-3 overflow-hidden">
        {menuItems.map((item, i) => (
          <View key={item.label}>
            {i > 0 && <View className="ml-16 border-t border-[#F5E6D3]" />}
            <View
              className="flex items-center gap-4 px-5 py-4 active:bg-[#FFF8F0] transition-colors"
              onClick={() => Taro.switchTab({ url: item.url })}
            >
              <View
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: item.bg }}
              >
                <Text className="text-lg">{item.icon}</Text>
              </View>
              <Text className="flex-1 text-[15px] font-medium text-[#2f3327]">{item.label}</Text>
              <Text className="text-[#D0C8BC] text-lg">›</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Secondary menu */}
      <View className="food-card mx-4 mt-3 overflow-hidden">
        {otherItems.map((item, i) => (
          <View key={item.label}>
            {i > 0 && <View className="ml-16 border-t border-[#F5E6D3]" />}
            <View
              className="flex items-center gap-4 px-5 py-4 active:bg-[#FFF8F0] transition-colors"
              onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}
            >
              <View
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: item.bg }}
              >
                <Text className="text-lg">{item.icon}</Text>
              </View>
              <Text className="flex-1 text-[15px] font-medium text-[#2f3327]">{item.label}</Text>
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
