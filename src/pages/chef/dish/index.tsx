import React, { useState, useCallback, useEffect } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtActivityIndicator, AtSwitch, AtFab, AtModal, AtModalContent, AtModalAction } from 'taro-ui';
import { dishApi, categoryApi } from '../../../services/api';
import { Dish, Category } from '../../../../types/api';
import './index.scss';

const DishManagePage: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [dishesRes, categoriesRes] = await Promise.all([
        dishApi.getDishes(),
        categoryApi.getCategories(),
      ]);
      setDishes(dishesRes || []);
      setCategories(categoriesRes || []);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useDidShow(() => {
    loadData();
  });

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || '未分类';
  };

  const handleToggleTodaySupply = async (dish: Dish) => {
    try {
      await dishApi.setTodaySupply(dish.id, !dish.todaySupply);
      Taro.showToast({
        title: dish.todaySupply ? '已取消今日供应' : '已设为今日供应',
        icon: 'success',
      });
      loadData();
    } catch (error) {
      console.error('操作失败:', error);
      Taro.showToast({ title: '操作失败', icon: 'none' });
    }
  };

  const handleToggleSoldOut = async (dish: Dish) => {
    try {
      await dishApi.setSoldOut(dish.id, !dish.soldOut);
      Taro.showToast({
        title: dish.soldOut ? '已恢复供应' : '已设为售罄',
        icon: 'success',
      });
      loadData();
    } catch (error) {
      console.error('操作失败:', error);
      Taro.showToast({ title: '操作失败', icon: 'none' });
    }
  };

  const handleEdit = (dish: Dish) => {
    setShowActionModal(false);
    Taro.navigateTo({
      url: `/pages/chef/dish/edit/index?id=${dish.id}`,
    });
  };

  const handleDelete = async (dish: Dish) => {
    Taro.showModal({
      title: '提示',
      content: `确定要删除菜品"${dish.name}"吗？`,
      confirmColor: '#FF4D4F',
      success: async (res) => {
        if (res.confirm) {
          try {
            await dishApi.deleteDish(dish.id);
            Taro.showToast({ title: '删除成功', icon: 'success' });
            setShowActionModal(false);
            loadData();
          } catch (error) {
            console.error('删除失败:', error);
            Taro.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      },
    });
  };

  const handleAdd = () => {
    Taro.navigateTo({
      url: '/pages/chef/dish/edit/index',
    });
  };

  if (loading) {
    return (
      <View className="dish-manage-page">
        <View className="loading-container">
          <AtActivityIndicator size="large" mode="center" />
        </View>
      </View>
    );
  }

  return (
    <View className="dish-manage-page">
      <ScrollView className="dish-list" scrollY>
        {dishes.length === 0 ? (
          <View className="empty-container">
            <View className="empty-icon">🍽️</View>
            <Text className="empty-text">暂无菜品</Text>
            <Text className="empty-subtext">点击右下角添加菜品</Text>
          </View>
        ) : (
          <View className="dish-items">
            {dishes.map(dish => (
              <View
                key={dish.id}
                className={`dish-item ${!dish.available ? 'disabled' : ''}`}
                onClick={() => {
                  setSelectedDish(dish);
                  setShowActionModal(true);
                }}
              >
                <Image
                  className="dish-image"
                  src={dish.image || 'https://via.placeholder.com/150?text=No+Image'}
                  mode="aspectFill"
                />
                <View className="dish-info">
                  <View className="dish-header">
                    <Text className="dish-name">{dish.name}</Text>
                    <Text className="dish-category">{getCategoryName(dish.categoryId)}</Text>
                  </View>
                  <Text className="dish-price">
                    <Text className="price-symbol">¥</Text>
                    {dish.price.toFixed(2)}
                  </Text>
                  <View className="dish-status">
                    <View
                      className={`status-tag ${dish.todaySupply ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTodaySupply(dish);
                      }}
                    >
                      <Text className="tag-text">
                        {dish.todaySupply ? '今日供应' : '非今日'}
                      </Text>
                    </View>
                    <View
                      className={`status-tag ${dish.soldOut ? 'soldout' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleSoldOut(dish);
                      }}
                    >
                      <Text className="tag-text">
                        {dish.soldOut ? '已售罄' : '在售'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: '120rpx' }} />
      </ScrollView>

      {/* 添加按钮 */}
      <AtFab className="add-fab" onClick={handleAdd}>
        <Text className="fab-icon">+</Text>
      </AtFab>

      {/* 操作弹窗 */}
      {selectedDish && (
        <AtModal isOpened={showActionModal}>
          <AtModalContent>
            <View className="dish-modal">
              <Text className="modal-title">{selectedDish.name}</Text>
              <View className="modal-actions">
                <View
                  className="modal-action-btn edit"
                  onClick={() => handleEdit(selectedDish)}
                >
                  <Text className="btn-icon">✏️</Text>
                  <Text className="btn-text">编辑</Text>
                </View>
                <View
                  className="modal-action-btn delete"
                  onClick={() => handleDelete(selectedDish)}
                >
                  <Text className="btn-icon">🗑️</Text>
                  <Text className="btn-text">删除</Text>
                </View>
              </View>
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={() => setShowActionModal(false)}>关闭</Button>
          </AtModalAction>
        </AtModal>
      )}
    </View>
  );
};

export default DishManagePage;
