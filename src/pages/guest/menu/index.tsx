import React, { useState, useEffect, useCallback } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, ScrollView, RefreshControl, Image } from '@tarojs/components';
import { AtActivityIndicator, AtBadge } from 'taro-ui';
import { dishApi, categoryApi } from '../../../services/api';
import { Dish, Category } from '../../../../types/api';
import { useCart } from '../../../store';
import './index.scss';

const MenuPage: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const { items: cartItems, totalCount, addToCart } = useCart();

  // 加载数据
  const loadData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);

      // 并行加载分类和菜品
      const [categoriesRes, dishesRes] = await Promise.all([
        categoryApi.getCategories(),
        dishApi.getTodayDishes(), // 只获取今日供应的菜品
      ]);

      setCategories(categoriesRes || []);
      // 只显示今日供应且未售罄的菜品
      const availableDishes = (dishesRes || []).filter(
        (dish: Dish) => dish.todaySupply && !dish.soldOut && dish.available
      );
      setDishes(availableDishes);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useDidShow(() => {
    // 页面显示时刷新数据
    loadData(false);
  });

  const handleRefresh = () => {
    setRefreshing(true);
    loadData(false);
  };

  const handleAddToCart = (dish: Dish) => {
    if (dish.soldOut || !dish.todaySupply) {
      Taro.showToast({ title: '该菜品暂时无法购买', icon: 'none' });
      return;
    }

    addToCart({
      dishId: dish.id,
      dishName: dish.name,
      price: dish.price,
      quantity: 1,
      image: dish.image,
    });

    Taro.showToast({
      title: '已加入购物车',
      icon: 'success',
      duration: 1000,
    });
  };

  const handleGoToCart = () => {
    Taro.switchTab({ url: '/pages/guest/cart/index' });
  };

  const filteredDishes = activeCategory === 'all'
    ? dishes
    : dishes.filter(dish => dish.categoryId === activeCategory);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || '';
  };

  if (loading) {
    return (
      <View className="menu-page">
        <View className="loading-container">
          <AtActivityIndicator size="large" mode="center" />
          <Text className="loading-text">加载中...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="menu-page">
      {/* 分类标签 */}
      <View className="category-section">
        <ScrollView
          className="category-scroll"
          scrollX
          showScrollbar={false}
        >
          <View
            className={`category-item ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            <Text className="category-text">全部</Text>
          </View>
          {categories.map(category => (
            <View
              key={category.id}
              className={`category-item ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <Text className="category-text">{category.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 菜品列表 */}
      <ScrollView
        className="dish-list"
        scrollY
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            color="#FF7A45"
          />
        }
      >
        {filteredDishes.length === 0 ? (
          <View className="empty-container">
            <View className="empty-icon">🍽️</View>
            <Text className="empty-text">暂无菜品</Text>
            <Text className="empty-subtext">厨师正在准备美味佳肴，请稍后再来</Text>
          </View>
        ) : (
          <View className="dish-grid">
            {filteredDishes.map(dish => (
              <View key={dish.id} className="dish-card">
                <Image
                  className="dish-image"
                  src={dish.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                  mode="aspectFill"
                />
                <View className="dish-content">
                  <View className="dish-header">
                    <Text className="dish-name">{dish.name}</Text>
                    {getCategoryName(dish.categoryId) && (
                      <Text className="dish-category">{getCategoryName(dish.categoryId)}</Text>
                    )}
                  </View>
                  {dish.description && (
                    <Text className="dish-desc" numberOfLines={2}>
                      {dish.description}
                    </Text>
                  )}
                  <View className="dish-footer">
                    <Text className="dish-price">
                      <Text className="price-symbol">¥</Text>
                      {dish.price.toFixed(2)}
                    </Text>
                    <View
                      className={`add-btn ${dish.soldOut ? 'disabled' : ''}`}
                      onClick={() => handleAddToCart(dish)}
                    >
                      <Text className="add-icon">+</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 底部留白 */}
        <View style={{ height: '120rpx' }} />
      </ScrollView>

      {/* 购物车悬浮按钮 */}
      <View className="cart-float" onClick={handleGoToCart}>
        <View className="cart-icon-wrapper">
          {totalCount > 0 ? (
            <AtBadge value={totalCount > 99 ? '99+' : totalCount} maxValue={99}>
              <View className="cart-icon">🛒</View>
            </AtBadge>
          ) : (
            <View className="cart-icon">🛒</View>
          )}
        </View>
        {totalCount > 0 && (
          <Text className="cart-hint">去结算</Text>
        )}
      </View>
    </View>
  );
};

export default MenuPage;
