import React, { useState, useEffect, useCallback } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, Image, Button } from '@tarojs/components';
import { AtList, AtListItem, AtButton, AtActivityIndicator } from 'taro-ui';
import { useAuth, useCart } from '../../../store';
import { userApi, statisticsApi, authApi } from '../../../services';
import { UserStatisticsDto, User } from '../../../../types/api';
import './index.scss';

const ProfilePage: React.FC = () => {
  const { isLogin, userInfo, login, logout } = useAuth();
  const { clearCart } = useCart();
  const [statistics, setStatistics] = useState<UserStatisticsDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState<User | null>(null);

  const loadUserData = useCallback(async () => {
    if (!isLogin) return;

    try {
      setLoading(true);
      const [profileRes, statsRes] = await Promise.all([
        userApi.getProfile(),
        statisticsApi.getMyStatistics(),
      ]);
      setUserDetail(profileRes);
      setStatistics(statsRes);
    } catch (error) {
      console.error('加载用户数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, [isLogin]);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  useDidShow(() => {
    loadUserData();
  });

  const handleWechatLogin = async () => {
    try {
      setLoading(true);

      // 获取微信登录凭证
      const { code } = await Taro.login({
        provider: 'weixin',
      });

      // 调用后端登录接口
      const res = await authApi.wechatLogin({ code });

      // 保存登录态
      login(res.accessToken, res.user, 'guest');

      Taro.showToast({
        title: '登录成功',
        icon: 'success',
      });

      loadUserData();
    } catch (error) {
      console.error('登录失败:', error);
      Taro.showToast({
        title: '登录失败',
        icon: 'none',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout();
          clearCart();
          Taro.showToast({
            title: '已退出登录',
            icon: 'success',
          });
        }
      },
    });
  };

  const handleNavigate = (url: string) => {
    Taro.navigateTo({ url });
  };

  // 未登录状态
  if (!isLogin) {
    return (
      <View className="profile-page">
        <View className="login-section">
          <View className="login-icon">👋</View>
          <Text className="login-title">欢迎使用私厨点餐</Text>
          <Text className="login-desc">登录后可查看订单、享受更多服务</Text>
          <AtButton
            type="primary"
            className="wechat-login-btn"
            loading={loading}
            onClick={handleWechatLogin}
          >
            微信一键登录
          </AtButton>
        </View>
      </View>
    );
  }

  return (
    <View className="profile-page">
      {/* 用户信息卡片 */}
      <View className="user-card">
        <Image
          className="user-avatar"
          src={userDetail?.avatar || 'https://via.placeholder.com/100?text=Avatar'}
          mode="aspectFill"
        />
        <View className="user-info">
          <Text className="user-name">
            {userDetail?.nickname || userDetail?.username || '微信用户'}
          </Text>
          <Text className="user-role">{userDetail?.role === 'user' ? '普通用户' : '管理员'}</Text>
        </View>
      </View>

      {/* 统计卡片 */}
      {statistics && (
        <View className="stats-section">
          <View className="stat-card">
            <Text className="stat-value">{statistics.totalOrders}</Text>
            <Text className="stat-label">累计订单</Text>
          </View>
          <View className="stat-card">
            <Text className="stat-value">¥{statistics.totalSpent.toFixed(2)}</Text>
            <Text className="stat-label">累计消费</Text>
          </View>
          <View className="stat-card">
            <Text className="stat-value">{statistics.thisMonthOrders}</Text>
            <Text className="stat-label">本月订单</Text>
          </View>
        </View>
      )}

      {loading && (
        <View className="loading-indicator">
          <AtActivityIndicator size="small" />
        </View>
      )}

      {/* 功能菜单 */}
      <View className="menu-section">
        <AtList>
          <AtListItem
            title="我的订单"
            arrow="right"
            iconInfo={{ size: 24, color: '#FF7A45', value: 'shopping-bag' }}
            onClick={() => Taro.switchTab({ url: '/pages/guest/orders/index' })}
          />
          <AtListItem
            title="购物车"
            arrow="right"
            iconInfo={{ size: 24, color: '#FF7A45', value: 'shopping-cart' }}
            onClick={() => Taro.switchTab({ url: '/pages/guest/cart/index' })}
          />
          <AtListItem
            title="菜单浏览"
            arrow="right"
            iconInfo={{ size: 24, color: '#FF7A45', value: 'menu' }}
            onClick={() => Taro.switchTab({ url: '/pages/guest/menu/index' })}
          />
        </AtList>
      </View>

      {/* 其他功能 */}
      <View className="menu-section">
        <AtList>
          <AtListItem
            title="联系私厨"
            arrow="right"
            iconInfo={{ size: 24, color: '#1677FF', value: 'phone' }}
            onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}
          />
          <AtListItem
            title="意见反馈"
            arrow="right"
            iconInfo={{ size: 24, color: '#52C41A', value: 'message' }}
            onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}
          />
        </AtList>
      </View>

      {/* 退出登录 */}
      <View className="logout-section">
        <AtButton className="logout-btn" onClick={handleLogout}>
          退出登录
        </AtButton>
      </View>

      {/* 私厨入口 */}
      <View className="chef-entry">
        <Text className="chef-text" onClick={() => handleNavigate('/pages/chef/login/index')}>
          我是私厨，去管理后台 →
        </Text>
      </View>
    </View>
  );
};

export default ProfilePage;
