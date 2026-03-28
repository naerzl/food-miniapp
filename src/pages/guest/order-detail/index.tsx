import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtButton, AtActivityIndicator, AtModal, AtModalContent, AtModalAction } from 'taro-ui';
import { orderApi } from '../../../services/api';
import { Order, OrderStatus } from '../../../../types/api';
import './index.scss';

const STATUS_TEXT: Record<OrderStatus, string> = {
  pending_payment: '待支付',
  paid: '已支付/待制作',
  preparing: '制作中',
  completed: '已完成',
  cancelled: '已取消',
};

const STATUS_COLOR: Record<OrderStatus, string> = {
  pending_payment: '#FAAD14',
  paid: '#1677FF',
  preparing: '#722ED1',
  completed: '#52C41A',
  cancelled: '#999999',
};

const STATUS_DESC: Record<OrderStatus, string> = {
  pending_payment: '请在30分钟内完成支付',
  paid: '已支付成功，等待厨师接单制作',
  preparing: '美味正在制作中，请耐心等待',
  completed: '订单已完成，感谢您的光临',
  cancelled: '订单已取消',
};

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const orderId = router.params.id;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPayModal, setShowPayModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (orderId) {
      loadOrderDetail();
    }
  }, [orderId]);

  const loadOrderDetail = async () => {
    try {
      setLoading(true);
      const data = await orderApi.getOrderById(orderId as string);
      setOrder(data);
    } catch (error) {
      console.error('加载订单详情失败:', error);
      Taro.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    setShowPayModal(false);
    setActionLoading(true);

    try {
      await orderApi.payOrder(orderId as string);
      Taro.showToast({ title: '支付成功', icon: 'success' });
      loadOrderDetail();
    } catch (error) {
      console.error('支付失败:', error);
      Taro.showToast({ title: '支付失败', icon: 'none' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    setShowCancelModal(false);
    setActionLoading(true);

    try {
      await orderApi.cancelOrder(orderId as string);
      Taro.showToast({ title: '已取消订单', icon: 'success' });
      loadOrderDetail();
    } catch (error) {
      console.error('取消订单失败:', error);
      Taro.showToast({ title: '取消失败', icon: 'none' });
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <View className="order-detail-page">
        <View className="loading-container">
          <AtActivityIndicator size="large" mode="center" />
          <Text className="loading-text">加载中...</Text>
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View className="order-detail-page">
        <View className="empty-container">
          <View className="empty-icon">❓</View>
          <Text className="empty-text">订单不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="order-detail-page">
      {/* 状态区域 */}
      <View
        className="status-section"
        style={{ backgroundColor: STATUS_COLOR[order.status] }}
      >
        <Text className="status-text">{STATUS_TEXT[order.status]}</Text>
        <Text className="status-desc">{STATUS_DESC[order.status]}</Text>
      </View>

      {/* 商品列表 */}
      <View className="section items-section">
        <Text className="section-title">商品信息</Text>
        <View className="items-list">
          {order.items?.map((item, index) => (
            <View key={index} className="item-row">
              <View className="item-info">
                <Text className="item-name">{item.dishName}</Text>
                <Text className="item-quantity">x{item.quantity}</Text>
              </View>
              <Text className="item-price">
                ¥{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
        <View className="total-row">
          <Text className="label">合计</Text>
          <Text className="value">¥{order.totalAmount.toFixed(2)}</Text>
        </View>
      </View>

      {/* 订单信息 */}
      <View className="section info-section">
        <Text className="section-title">订单信息</Text>
        <View className="info-row">
          <Text className="label">订单编号</Text>
          <Text className="value">{order.orderNo}</Text>
        </View>
        <View className="info-row">
          <Text className="label">下单时间</Text>
          <Text className="value">{formatDate(order.createdAt)}</Text>
        </View>
        {order.paidAt && (
          <View className="info-row">
            <Text className="label">支付时间</Text>
            <Text className="value">{formatDate(order.paidAt)}</Text>
          </View>
        )}
        {order.completedAt && (
          <View className="info-row">
            <Text className="label">完成时间</Text>
            <Text className="value">{formatDate(order.completedAt)}</Text>
          </View>
        )}
        {order.remark && (
          <View className="info-row">
            <Text className="label">订单备注</Text>
            <Text className="value remark">{order.remark}</Text>
          </View>
        )}
      </View>

      {/* 底部操作栏 */}
      {order.status === 'pending_payment' && (
        <View className="action-bar">
          <AtButton
            className="cancel-btn"
            onClick={() => setShowCancelModal(true)}
            loading={actionLoading}
          >
            取消订单
          </AtButton>
          <AtButton
            type="primary"
            className="pay-btn"
            onClick={() => setShowPayModal(true)}
            loading={actionLoading}
          >
            立即支付
          </AtButton>
        </View>
      )}

      {order.status === 'completed' && (
        <View className="action-bar">
          <AtButton
            type="primary"
            className="primary-btn"
            onClick={() => Taro.switchTab({ url: '/pages/guest/menu/index' })}
          >
            再来一单
          </AtButton>
        </View>
      )}

      {/* 取消确认弹窗 */}
      <AtModal isOpened={showCancelModal}>
        <AtModalContent>
          <View style={{ textAlign: 'center', padding: '20rpx' }}>
            <Text style={{ fontSize: '32rpx', color: '#333' }}>
              确定要取消订单吗？
            </Text>
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => setShowCancelModal(false)}>再想想</Button>
          <Button style={{ color: '#FF4D4F' }} onClick={handleCancel}>
            取消订单
          </Button>
        </AtModalAction>
      </AtModal>

      {/* 支付确认弹窗 */}
      <AtModal isOpened={showPayModal}>
        <AtModalContent>
          <View style={{ textAlign: 'center', padding: '20rpx' }}>
            <Text style={{ fontSize: '32rpx', color: '#333', fontWeight: 500 }}>
              确认支付
            </Text>
            <View style={{ marginTop: '24rpx' }}>
              <Text style={{ fontSize: '48rpx', color: '#FF7A45', fontWeight: 700 }}>
                ¥{order.totalAmount.toFixed(2)}
              </Text>
            </View>
            <Text style={{ fontSize: '26rpx', color: '#999', marginTop: '16rpx', display: 'block' }}>
              虚拟支付：点击确认即视为支付成功
            </Text>
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => setShowPayModal(false)}>取消</Button>
          <Button style={{ color: '#FF7A45' }} onClick={handlePay}>
            确认支付
          </Button>
        </AtModalAction>
      </AtModal>
    </View>
  );
};

export default OrderDetailPage;
