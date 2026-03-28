import React, { useEffect } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { useAuth } from '../../store';
import './index.scss';

const IndexPage: React.FC = () => {
  const { isLogin, role } = useAuth();

  useEffect(() => {
    // 根据登录态决定跳转
    if (isLogin) {
      if (role === 'chef') {
        // 私厨跳转到管理页
        Taro.redirectTo({ url: '/pages/chef/layout/index' });
      } else {
        // 客人跳转到菜单页
        Taro.switchTab({ url: '/pages/guest/menu/index' });
      }
    }
  }, [isLogin, role]);

  const handleGuestEnter = () => {
    Taro.switchTab({ url: '/pages/guest/menu/index' });
  };

  const handleChefEnter = () => {
    Taro.navigateTo({ url: '/pages/chef/login/index' });
  };

  return (
    <View className="index-page">
      <View className="hero-section">
        <View className="logo-section">
          <View className="logo-icon">🍽️</View>
          <Text className="app-name">私厨点餐助手</Text>
          <Text className="app-slogan">家庭私厨，美味随时享</Text>
        </View>
      </View>

      <View className="action-section">
        <AtButton
          type="primary"
          className="guest-btn"
          onClick={handleGuestEnter}
        >
          🍜 我是客人，去点餐
        </AtButton>

        <View className="divider">
          <View className="line"></View>
          <Text className="text">或</Text>
          <View className="line"></View>
        </View>

        <AtButton
          className="chef-btn"
          onClick={handleChefEnter}
        >
          👨‍🍳 我是私厨，去管理
        </AtButton>
      </View>

      <View className="footer-section">
        <Text className="footer-text">让家庭用餐更简单、更温馨</Text>
      </View>
    </View>
  );
};

export default IndexPage;
