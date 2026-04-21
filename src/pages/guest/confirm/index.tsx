import React, { useState } from 'react';
import Taro from '@tarojs/taro';
import { View, Text, Image, Textarea } from '@tarojs/components';
import { AtButton, AtModal, AtModalContent, AtModalAction } from 'taro-ui';
import { useCart, useAuth } from '../../../store';
import { orderApi } from '../../../services';
import './index.scss';

const ConfirmPage: React.FC = () => {
  const { items, totalCount, totalAmount, clearCart } = useCart();
  const { userInfo } = useAuth();
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleSubmit = () => {
    if (items.length === 0) {
      Taro.showToast({ title: '购物车是空的', icon: 'none' });
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    setLoading(true);

    try {
      const orderData = {
        items: items.map(item => ({
          dishId: item.dishId,
          quantity: item.quantity,
        })),
        remark: remark.trim(),
      };

      const order = await orderApi.createOrder(orderData);

      // 下单成功，清空购物车
      clearCart();

      Taro.showToast({
        title: '下单成功',
        icon: 'success',
        duration: 1500,
      });

      // 跳转到订单详情页
      setTimeout(() => {
        Taro.redirectTo({
          url: `/pages/guest/order-detail/index?id=${order.id}`,
        });
      }, 1500);
    } catch (error) {
      console.error('下单失败:', error);
      Taro.showToast({
        title: '下单失败，请重试',
        icon: 'none',
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <View className="confirm-page">
        <View className="empty-container">
          <View className="empty-icon">🛒</View>
          <Text className="empty-text">购物车是空的</Text>
          <Text className="empty-subtext">请先添加商品到购物车</Text>
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
    <View className="confirm-page">
      {/* 用户信息 */}
      <View className="section user-section">
        <Text className="section-title">下单用户</Text>
        <View className="user-info">
          <Text className="user-name">{userInfo?.nickname || '微信用户'}</Text>
        </View>
      </View>

      {/* 商品列表 */}
      <View className="section items-section">
        <Text className="section-title">
          商品清单
          <Text className="item-count">（共 {totalCount} 件）</Text>
        </Text>
        <View className="items-list">
          {items.map(item => (
            <View key={item.dishId} className="item-row">
              <Image
                className="item-image"
                src={item.image || 'https://via.placeholder.com/100?text=No+Image'}
                mode="aspectFill"
              />
              <View className="item-detail">
                <Text className="item-name">{item.dishName}</Text>
                <Text className="item-price">¥{item.price.toFixed(2)} x {item.quantity}</Text>
              </View>
              <Text className="item-subtotal">
                <Text className="price-symbol">¥</Text>
                {(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* 备注 */}
      <View className="section remark-section">
        <Text className="section-title">订单备注</Text>
        <Textarea
          className="remark-input"
          placeholder="请输入备注信息，如口味偏好、忌口等（选填）"
          value={remark}
          onInput={e => setRemark(e.detail.value)}
          maxlength={200}
        />
        <Text className="remark-count">{remark.length}/200</Text>
      </View>

      {/* 金额汇总 */}
      <View className="section total-section">
        <View className="total-row">
          <Text className="label">商品总额</Text>
          <Text className="value">¥{totalAmount.toFixed(2)}</Text>
        </View>
        <View className="total-row final">
          <Text className="label">应付金额</Text>
          <Text className="value highlight">
            <Text className="price-symbol">¥</Text>
            {totalAmount.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* 底部提交栏 */}
      <View className="submit-bar">
        <View className="price-section">
          <Text className="total-label">合计：</Text>
          <Text className="total-price">
            <Text className="price-symbol">¥</Text>
            {totalAmount.toFixed(2)}
          </Text>
        </View>
        <AtButton
          type="primary"
          className="submit-btn"
          loading={loading}
          onClick={handleSubmit}
        >
          提交订单
        </AtButton>
      </View>

      {/* 确认弹窗 */}
      <AtModal isOpened={showConfirmModal}>
        <AtModalContent>
          <View style={{ textAlign: 'center', padding: '20rpx' }}>
            <Text style={{ fontSize: '32rpx', color: '#333', fontWeight: 500 }}>
              确认提交订单？
            </Text>
            <View style={{ marginTop: '16rpx' }}>
              <Text style={{ fontSize: '28rpx', color: '#666' }}>
                应付金额：¥{totalAmount.toFixed(2)}
              </Text>
            </View>
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => setShowConfirmModal(false)}>取消</Button>
          <Button style={{ color: '#FF7A45' }} onClick={confirmSubmit}>
            确认
          </Button>
        </AtModalAction>
      </AtModal>
    </View>
  );
};

export default ConfirmPage;
