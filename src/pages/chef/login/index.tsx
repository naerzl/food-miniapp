import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, TextInput, Image } from '@tarojs/components';
import { AtButton, AtToast } from 'taro-ui';
import { authApi } from '../../../services/api';
import { useAuth } from '../../../store';
import './index.scss';

const ChefLoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const { login } = useAuth();

  const handleLogin = async () => {
    if (!username || !password) {
      showToast('请输入用户名和密码');
      return;
    }

    try {
      setLoading(true);
      const res = await authApi.login({ username, password });

      // 检查用户角色
      if (res.user.role !== 'admin' && res.user.role !== 'merchant') {
        showToast('您没有权限访问私厨管理后台');
        setLoading(false);
        return;
      }

      // 保存登录态
      login(res.accessToken, res.user, 'chef');

      showToast('登录成功');

      // 跳转到管理首页
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/chef/layout/index' });
      }, 1000);
    } catch (error) {
      console.error('登录失败:', error);
      setLoading(false);
      showToast('登录失败，请检查用户名和密码');
    }
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 2000);
  };

  const handleBack = () => {
    Taro.switchTab({ url: '/pages/guest/menu/index' });
  };

  return (
    <View className="chef-login-page">
      <View className="login-container">
        <View className="back-btn" onClick={handleBack}>
          <Text className="back-icon">←</Text>
          <Text className="back-text">返回</Text>
        </View>

        <View className="logo-section">
          <View className="logo-icon">👨‍🍳</View>
          <Text className="logo-title">私厨管理后台</Text>
          <Text className="logo-subtitle">专为私厨打造的订单管理系统</Text>
        </View>

        <View className="form-section">
          <View className="form-item">
            <Text className="form-label">用户名</Text>
            <TextInput
              className="form-input"
              value={username}
              onInput={(e) => setUsername(e.detail.value)}
              placeholder="请输入用户名"
              placeholderStyle={{ color: '#999' }}
            />
          </View>

          <View className="form-item">
            <Text className="form-label">密码</Text>
            <TextInput
              className="form-input"
              value={password}
              onInput={(e) => setPassword(e.detail.value)}
              placeholder="请输入密码"
              placeholderStyle={{ color: '#999' }}
              password
            />
          </View>

          <AtButton
            type="primary"
            size="large"
            loading={loading}
            onClick={handleLogin}
            className="login-btn"
          >
            登录
          </AtButton>
        </View>
      </View>

      <AtToast
        isOpened={toastVisible}
        text={toastMessage}
        duration={2000}
        onClose={() => setToastVisible(false)}
      />
    </View>
  );
};

export default ChefLoginPage;
