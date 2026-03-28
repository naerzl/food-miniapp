import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtGrid } from 'taro-ui';
import { useAuth } from '../../../store';
import './index.scss';

const ChefLayoutPage: React.FC = () => {
  const { userInfo, logout } = useAuth();

  const handleNavigate = (url: string) => {
    Taro.navigateTo({ url });
  };

  const handleLogout = () => {
    Taro.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          logout();
          Taro.showToast({ title: '已退出登录', icon: 'success' });
          setTimeout(() => {
            Taro.redirectTo({ url: '/pages/index/index' });
          }, 1500);
        }
      },
    });
  };

  const gridData = [
    {
      image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
      value: '订单管理',
      onClick: () => handleNavigate('/pages/chef/order/index'),
    },
    {
      image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
      value: '菜品管理',
      onClick: () => handleNavigate('/pages/chef/dish/index'),
    },
    {
      image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
      value: '分类管理',
      onClick: () => handleNavigate('/pages/chef/category/index'),
    },
    {
      image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
      value: '客人管理',
      onClick: () => handleNavigate('/pages/chef/customer/index'),
    },
    {
      image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311039317/3107/3547ec6a/5ac44618Na1db7b09.png',
      value: '数据统计',
      onClick: () => handleNavigate('/pages/chef/stat/index'),
    },
    {
      image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
      value: '返回首页',
      onClick: () => Taro.switchTab({ url: '/pages/guest/menu/index' }),
    },
  ];

  return (
    <View className="chef-layout-page">
      {/* 用户信息卡片 */}
      <View className="user-card">
        <View className="user-avatar">
          <Text className="avatar-text">
            {(userInfo?.nickname || userInfo?.username || '厨').charAt(0)}
          </Text>
        </View>
        <View className="user-info">
          <Text className="user-name">
            {userInfo?.nickname || userInfo?.username || '私厨管理员'}
          </Text>
          <Text className="user-role">
            {userInfo?.role === 'admin' ? '超级管理员' : '私厨'}
          </Text>
        </View>
        <View className="logout-btn" onClick={handleLogout}>
          <Text className="logout-text">退出</Text>
        </View>
      </View>

      {/* 功能菜单 */}
      <View className="menu-section">
        <Text className="section-title">功能菜单</Text>
        <AtGrid data={gridData} columnNum={3} hasBorder={false} />
      </View>

      {/* 快捷入口 */}
      <View className="quick-section">
        <Text className="section-title">快捷入口</Text>
        <View className="quick-buttons">
          <View
            className="quick-btn primary"
            onClick={() => handleNavigate('/pages/chef/order/index')}
          >
            <Text className="btn-icon">📋</Text>
            <Text className="btn-text">处理订单</Text>
          </View>
          <View
            className="quick-btn"
            onClick={() => handleNavigate('/pages/chef/dish/index')}
          >
            <Text className="btn-icon">🍽️</Text>
            <Text className="btn-text">管理菜品</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default ChefLayoutPage;
