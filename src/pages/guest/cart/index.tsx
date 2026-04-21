import React from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import { AtButton, AtInputNumber, AtModal, AtModalContent, AtModalAction } from 'taro-ui';
import { useCart, useAuth } from '../../../store';
import './index.scss';

const CartPage: React.FC = () => {
  const { items, totalCount, totalAmount, removeFromCart, updateQuantity, clearCart } = useCart();
  const { isLogin } = useAuth();
  const [showClearModal, setShowClearModal] = React.useState(false);

  const handleQuantityChange = (dishId: string | number, value: number) => {
    updateQuantity(dishId, value);
  };

  const handleRemove = (dishId: string | number) => {
    Taro.showModal({
      title: '提示',
      content: '确定要删除这个商品吗？',
      success: (res) => {
        if (res.confirm) {
          removeFromCart(dishId);
        }
      },
    });
  };

  const handleClearCart = () => {
    setShowClearModal(true);
  };

  const confirmClearCart = () => {
    clearCart();
    setShowClearModal(false);
    Taro.showToast({ title: '购物车已清空', icon: 'success' });
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      Taro.showToast({ title: '购物车是空的', icon: 'none' });
      return;
    }

    if (!isLogin) {
      Taro.showModal({
        title: '提示',
        content: '请先登录后再下单',
        success: (res) => {
          if (res.confirm) {
            Taro.navigateTo({ url: '/pages/index/index' });
          }
        },
      });
      return;
    }

    // 跳转到确认订单页
    Taro.navigateTo({ url: '/pages/guest/confirm/index' });
  };

  if (items.length === 0) {
    return (
      <View className="cart-page">
        <View className="empty-container">
          <View className="empty-state-icon">🛒</View>
          <Text className="empty-state-text">购物车是空的</Text>
          <Text className="empty-state-subtext">快去选购美味佳肴吧</Text>
          <AtButton
            type="primary"
            className="go-shopping-btn"
            onClick={() => Taro.switchTab({ url: '/pages/guest/menu/index' })}
          >
            去逛逛
          </AtButton>
        </View>
      </View>
    );
  }

  return (
    <View className="cart-page">
      <ScrollView className="cart-list" scrollY>
        {/* 清空按钮 */}
        <View className="cart-header">
          <Text className="cart-count">共 {totalCount} 件商品</Text>
          <Text className="clear-btn" onClick={handleClearCart}>
            清空购物车
          </Text>
        </View>

        {/* 商品列表 */}
        <View className="cart-items">
          {items.map((item) => (
            <View key={item.dishId} className="cart-item">
              <Image
                className="item-image"
                src={item.image || 'https://via.placeholder.com/150?text=No+Image'}
                mode="aspectFill"
              />
              <View className="item-info">
                <Text className="item-name">{item.dishName}</Text>
                <Text className="item-price">
                  <Text className="price-symbol">¥</Text>
                  {item.price.toFixed(2)}
                </Text>
              </View>
              <View className="item-actions">
                <AtInputNumber
                  min={1}
                  max={99}
                  step={1}
                  value={item.quantity}
                  onChange={(value) => handleQuantityChange(item.dishId, value)}
                  type="number"
                  className="quantity-input"
                />
                <Text
                  className="delete-btn"
                  onClick={() => handleRemove(item.dishId)}
                >
                  删除
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* 底部留白 */}
        <View style={{ height: '140rpx' }} />
      </ScrollView>

      {/* 底部结算栏 */}
      <View className="checkout-bar">
        <View className="total-section">
          <Text className="total-label">合计：</Text>
          <Text className="total-price">
            <Text className="price-symbol">¥</Text>
            {totalAmount.toFixed(2)}
          </Text>
        </View>
        <AtButton
          type="primary"
          className="checkout-btn"
          onClick={handleCheckout}
        >
          去结算 ({totalCount})
        </AtButton>
      </View>

      {/* 清空确认弹窗 */}
      <AtModal isOpened={showClearModal}>
        <AtModalContent>
          <View style={{ textAlign: 'center', padding: '20rpx' }}>
            <Text style={{ fontSize: '32rpx', color: '#333' }}>
              确定要清空购物车吗？
            </Text>
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => setShowClearModal(false)}>取消</Button>
          <Button style={{ color: '#FF4D4F' }} onClick={confirmClearCart}>
            清空
          </Button>
        </AtModalAction>
      </AtModal>
    </View>
  );
};

export default CartPage;
