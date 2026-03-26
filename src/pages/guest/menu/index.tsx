import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from '@tarojs/components';
import { AtTabBar, AtActivityIndicator } from 'taro-ui';
import DishCard from '../../../components/DishCard';
import { api } from '../../../services/api';
import { Dish, Category } from '../../../../types/api';
import './index.scss';

const MenuPage: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      setLoading(true);
      // 模拟API调用
      // const response = await api.getDishes();
      // const data = response.data.data;
      // setDishes(data.dishes);
      // setCategories(data.categories);
      
      // 模拟数据
      const mockCategories: Category[] = [
        { id: 0, name: '全部', sortOrder: 0 },
        { id: 1, name: '凉菜', sortOrder: 1 },
        { id: 2, name: '热菜', sortOrder: 2 },
        { id: 3, name: '主食', sortOrder: 3 },
        { id: 4, name: '饮料', sortOrder: 4 }
      ];
      
      const mockDishes: Dish[] = [
        { id: 1, name: '宫保鸡丁', price: 28, image: 'https://via.placeholder.com/300', description: '经典川菜，麻辣鲜香', available: true, todaySupply: true, categoryId: 2, categoryName: '热菜' },
        { id: 2, name: '凉拌黄瓜', price: 12, image: 'https://via.placeholder.com/300', description: '清爽开胃，夏季必备', available: true, todaySupply: true, categoryId: 1, categoryName: '凉菜' },
        { id: 3, name: '米饭', price: 2, image: 'https://via.placeholder.com/300', description: '精选大米', available: true, todaySupply: true, categoryId: 3, categoryName: '主食' },
        { id: 4, name: '可乐', price: 5, image: 'https://via.placeholder.com/300', description: '冰镇可乐', available: true, todaySupply: true, categoryId: 4, categoryName: '饮料' }
      ];
      
      setCategories(mockCategories);
      setDishes(mockDishes);
    } catch (error) {
      console.error('加载菜品失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadDishes();
  };

  const handleAddToCart = (dishId: number) => {
    // 加入购物车逻辑
    console.log('加入购物车:', dishId);
  };

  const filteredDishes = activeCategory === 0 
    ? dishes 
    : dishes.filter(dish => dish.categoryId === activeCategory);

  return (
    <View className="menu-page">
      {/* 分类标签 */}
      <View className="category-tabs">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(category => (
            <View 
              key={category.id} 
              className={`category-tab ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <Text>{category.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* 菜品列表 */}
      <ScrollView 
        className="dish-list" 
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={handleRefresh} 
            color="#13C2C2" 
          />
        }
      >
        {loading ? (
          <View className="loading-container">
            <AtActivityIndicator size="large" />
            <Text style={{ marginTop: 16 }}>加载中...</Text>
          </View>
        ) : filteredDishes.length === 0 ? (
          <View className="empty-container">
            <Text>暂无菜品</Text>
          </View>
        ) : (
          filteredDishes.map(dish => (
            <DishCard 
              key={dish.id} 
              dish={dish} 
              onAddToCart={handleAddToCart} 
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default MenuPage;
