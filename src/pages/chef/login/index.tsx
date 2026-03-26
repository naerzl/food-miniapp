import React, { useState } from 'react';
import { View, Text, TextInput, Image } from '@tarojs/components';
import { AtButton, AtToast } from 'taro-ui';
import { api } from '../../../services/api';
import { LoginData } from '../../../../types/api';
import './index.scss';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [toastVisible, setToastVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const handleLogin = async () => {
    if (!username || !password) {
      showToast('请输入用户名和密码');
      return;
    }

    try {
      setLoading(true);
      // 模拟API调用
      // const response = await api.login({ username, password });
      // const data = response.data.data;
      // 存储token
      // Taro.setStorageSync('token', data.token);
      // 跳转到菜品管理页面
      // Taro.redirectTo({ url: '/pages/chef/dish/index' });
      
      // 模拟登录成功
      setTimeout(() => {
        setLoading(false);
        showToast('登录成功');
        // 跳转到菜品管理页面
        setTimeout(() => {
          Taro.redirectTo({ url: '/pages/chef/dish/index' });
        }, 1000);
      }, 1000);
    } catch (error) {
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

  return (
    <View className="login-page">
      <View className="login-container">
        <View className="logo-container">
          <Image className="logo" src="https://via.placeholder.com/100" mode="aspectFill" />
          <Text className="logo-text">私厨管理系统</Text>
        </View>

        <View className="form-container">
          <View className="form-item">
            <Text className="label">用户名</Text>
            <TextInput 
              className="input" 
              value={username} 
              onChange={(e) => setUsername(e.detail.value)} 
              placeholder="请输入用户名" 
              placeholderStyle={{ color: '#999' }} 
            />
          </View>

          <View className="form-item">
            <Text className="label">密码</Text>
            <TextInput 
              className="input" 
              value={password} 
              onChange={(e) => setPassword(e.detail.value)} 
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
            className="login-button"
          >
            登录
          </AtButton>
        </View>
      </View>

      <AtToast
        isOpened={toastVisible}
        message={toastMessage}
        duration={2000}
        onClose={() => setToastVisible(false)}
      />
    </View>
  );
};

export default LoginPage;
