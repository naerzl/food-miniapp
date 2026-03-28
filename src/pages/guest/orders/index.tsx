import React, { useState, useCallback, useEffect } from 'react';
import Taro, { useDidShow, usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { AtActivityIndicator, AtTabs, AtTabsPane } from 'taro-ui';
import { orderApi } from '../../../services/api';
import { Order, OrderStatus } from '../../../../types/api';
import './index.scss';

const STATUS_TABS: { title: string; status: OrderStatus | 'all' }[] = [
  { title: '全部', status: 'all' },
  { title: '待支付', status: 'pending_payment' },
  { title: '待制作', status: 'paid' },
  { title: '制作中', status: 'preparing' },
  { title: '已完成', status: 'completed' },
];

const STATUS_TEXT: Record<OrderStatus, string> = {
  pending_payment: '待支付',
  paid: '待制作',
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

const OrdersPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = useCallback(async (pageNum = 1, isRefresh = false) => {
    try {
      const status = STATUS_TABS[currentTab].status;
      const res = await orderApi.getOrders(
        status === 'all' ? undefined : status,
        pageNum,
        10
      );

      if (isRefresh || pageNum === 1) {
        setOrders(res.items);
      } else {
        setOrders(prev => [...prev, ...res.items]);
      }

      setHasMore(res.items.length === 10 && pageNum < res.totalPages);
      setPage(pageNum);
    } catch (error) {
      console.error('加载订单失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [currentTab]);

  useEffect(() => {
    setLoading(true);
    loadOrders(1);
  }, [currentTab, loadOrders]);

  useDidShow(() => {
    loadOrders(1, true);
  });

  usePullDownRefresh(() => {
    setRefreshing(true);
    loadOrders(1, true);
    Taro.stopPullDownRefresh();
  });

  useReachBottom(() => {
    if (hasMore && !loading) {
      loadOrders(page + 1);
    }
  });

  const handleOrderClick = (orderId: string) => {
    Taro.navigateTo({
      url: `/pages/guest/order-detail/index?id=${orderId}`,
    });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const renderOrderList = () => {
    if (loading && orders.length === 0) {
      return (
        <View className="loading-container">
          <AtActivityIndicator size="large" mode="center" />
        </View>
      );
    }

    if (orders.length === 0) {
      return (
        <View className="empty-container">
          <View className="empty-icon">📋</View>
          <Text className="empty-text">暂无订单</Text>
          <Text className="empty-subtext">快去下单吧</Text>
        </View>
      );
    }

    return (
      <View className="orders-list">
        {orders.map(order => (
          <View
            key={order.id}
            className="order-card"
            onClick={() => handleOrderClick(order.id)}
          >
            <View className="order-header">
              <Text className="order-no">订单号：{order.orderNo}</Text>
              <Text
                className="order-status"
                style={{ color: STATUS_COLOR[order.status] }}
              >
                {STATUS_TEXT[order.status]}
              </Text>
            </View>
            <View className="order-content">
              <Text className="item-count">共 {order.items?.length || 0} 件商品</Text>
              <Text className="order-amount">
                ¥{order.totalAmount.toFixed(2)}
              </Text>
            </View>
            <View className="order-footer">
              <Text className="order-time">{formatDate(order.createdAt)}</Text>
              <View className="order-actions">
                {order.status === 'pending_payment' && (
                  <Text className="action-btn primary">去支付</Text>
                )}
                {order.status === 'completed' && (
                  <Text className="action-btn">再来一单</Text>
                )}
              </View>
            </View>
          </View>
        ))}
        {hasMore && (
          <View className="load-more">
            <Text className="load-text">加载中...</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View className="orders-page">
      <AtTabs
        current={currentTab}
        tabList={STATUS_TABS}
        onClick={setCurrentTab}
        className="order-tabs"
      />
      <ScrollView className="orders-content" scrollY>
        {renderOrderList()}
      </ScrollView>
    </View>
  );
};

export default OrdersPage;
