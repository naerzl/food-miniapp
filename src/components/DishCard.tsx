import React from 'react';
import { View, Text, Image } from '@tarojs/components';
import { AtButton } from 'taro-ui';
import { Dish } from '../../types';
import './DishCard.scss';

interface DishCardProps {
  dish: Dish;
  onAddToCart: (dishId: number) => void;
}

const DishCard: React.FC<DishCardProps> = ({ dish, onAddToCart }) => {
  const handleAddToCart = () => {
    if (dish.available && dish.todaySupply) {
      onAddToCart(dish.id);
    }
  };

  return (
    <View className="dish-card">
      <Image className="dish-image" src={dish.image} mode="aspectFill" />
      <View className="dish-info">
        <Text className="dish-name">{dish.name}</Text>
        <Text className="dish-price">¥{dish.price}</Text>
        <Text className="dish-description">{dish.description}</Text>
        <View className="dish-actions">
          <AtButton 
            type="primary" 
            size="small" 
            disabled={!dish.available || !dish.todaySupply}
            onClick={handleAddToCart}
          >
            {!dish.todaySupply ? '今日不供应' : !dish.available ? '已售罄' : '加入购物车'}
          </AtButton>
        </View>
      </View>
    </View>
  );
};

export default DishCard;
