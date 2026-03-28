import React, { useState, useCallback, useEffect } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtActivityIndicator, AtSwitch, AtSearchBar } from 'taro-ui';
import { userApi } from '../../../services/api';
import { User } from '../../../../types/api';
import './index.scss';

const CustomerManagePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userApi.getUsers(1, 100);
      // 只显示普通用户
      const customers = (res.items || []).filter(
        (u) => u.role === 'user' || u.role === 'merchant'
      );
      setUsers(customers);
      setFilteredUsers(customers);
    } catch (error) {
      console.error('加载用户失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useDidShow(() => {
    loadUsers();
  });

  const handleSearch = (value: string) => {
    setSearchValue(value);
    if (!value.trim()) {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (u) =>
          (u.nickname && u.nickname.includes(value)) ||
          (u.username && u.username.includes(value))
      );
      setFilteredUsers(filtered);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'banned' : 'active';
    const actionText = newStatus === 'active' ? '启用' : '禁用';

    Taro.showModal({
      title: '提示',
      content: `确定要${actionText}用户"${user.nickname || user.username || '微信用户'}"吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await userApi.updateUser(user.id, { status: newStatus });
            Taro.showToast({ title: `${actionText}成功`, icon: 'success' });
            loadUsers();
          } catch (error) {
            console.error('操作失败:', error);
            Taro.showToast({ title: '操作失败', icon: 'none' });
          }
        }
      },
    });
  };

  if (loading) {
    return (
      <View className="customer-manage-page">
        <View className="loading-container">
          <AtActivityIndicator size="large" mode="center" />
        </View>
      </View>
    );
  }

  return (
    <View className="customer-manage-page">
      <AtSearchBar
        value={searchValue}
        onChange={handleSearch}
        placeholder="搜索用户昵称"
        className="search-bar"
      />

      <View className="customer-list">
        {filteredUsers.length === 0 ? (
          <View className="empty-container">
            <View className="empty-icon">👥</View>
            <Text className="empty-text">
              {searchValue ? '未找到匹配的用户' : '暂无用户'}
            </Text>
          </View>
        ) : (
          filteredUsers.map((user) => (
            <View key={user.id} className="customer-item">
              <Image
                className="customer-avatar"
                src={user.avatar || 'https://via.placeholder.com/100?text=Avatar'}
                mode="aspectFill"
              />
              <View className="customer-info">
                <Text className="customer-name">
                  {user.nickname || user.username || '微信用户'}
                </Text>
                <Text className={`customer-status ${user.status}`}>
                  {user.status === 'active' ? '正常' : '已禁用'}
                </Text>
              </View>
              <AtSwitch
                checked={user.status === 'active'}
                onChange={() => handleToggleStatus(user)}
                color="#FF7A45"
              />
            </View>
          ))
        )}
      </View>
    </View>
  );
};

export default CustomerManagePage;
