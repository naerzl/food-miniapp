import React, { useState, useCallback, useEffect } from 'react';
import Taro, { useDidShow, usePullDownRefresh, useReachBottom } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtActivityIndicator, AtTabs, AtTabsPane, AtButton, AtModal, AtModalContent, AtModalAction } from 'taro-ui';
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

const ChefOrderPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const loadOrders = useCallback(async (pageNum = 1, isRefresh = false) => {
    try {
      const status = STATUS_TABS[currentTab].status;
      const res = await orderApi.filterOrders({
        status: status === 'all' ? undefined : status,
        page: pageNum,
        pageSize: 10,
        dateRange: 'today',
      });

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
    loadOrders(1, true);
    Taro.stopPullDownRefresh();
  });

  useReachBottom(() => {
    if (hasMore && !loading) {
      loadOrders(page + 1);
    }
  });

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setShowActionModal(true);
  };

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (!selectedOrder) return;

    setActionLoading(true);
    try {
      await orderApi.updateOrderStatus(selectedOrder.id, newStatus);
      Taro.showToast({ title: '操作成功', icon: 'success' });
      loadOrders(1, true);
    } catch (error) {
      console.error('操作失败:', error);
      Taro.showToast({ title: '操作失败', icon: 'none' });
    } finally {
      setActionLoading(false);
      setShowActionModal(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  const getNextAction = (status: OrderStatus): { text: string; status: OrderStatus } | null => {
    switch (status) {
      case 'paid':
        return { text: '开始制作', status: 'preparing' };
      case 'preparing':
        return { text: '完成制作', status: 'completed' };
      default:
        return null;
    }
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
          <Text className="empty-subtext">今日暂无该状态的订单</Text>
        </View>
      );
    }

    return (
      <View className="orders-list">
        {orders.map(order => (
          <View
            key={order.id}
            className="order-card"
            onClick={() => handleOrderClick(order)}
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
              <View className="customer-info">
                <Text className="customer-name">{order.user?.nickname || '微信用户'}</Text>
              </View>
              <View className="order-info">
                <Text className="item-count">共 {order.items?.length || 0} 件商品</Text>
                <Text className="order-amount">¥{order.totalAmount.toFixed(2)}</Text>
              </View>
            </View>

            {order.remark && (
              <View className="order-remark">
                <Text className="remark-label">备注：</Text>
                <Text className="remark-content">{order.remark}</Text>
              </View>
            )}

            <View className="order-footer">
              <Text className="order-time">{formatDate(order.createdAt)}</Text>
              {getNextAction(order.status) && (
                <View className="action-hint">
                  <Text className="hint-text">点击处理订单</Text>
                </View>
              )}
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
    <View className="chef-order-page">
      <AtTabs
        current={currentTab}
        tabList={STATUS_TABS}
        onClick={setCurrentTab}
        className="order-tabs"
      />

      <View className="orders-content">
        {renderOrderList()}
      </View>

      {/* 操作弹窗 */}
      {selectedOrder && (
        <AtModal isOpened={showActionModal}>
          <AtModalContent>
            <View className="order-modal">
              <Text className="modal-title">订单详情</Text>
              <View className="modal-info">
                <Text className="info-label">订单号：</Text>
                <Text className="info-value">{selectedOrder.orderNo}</Text>
              </View>
              <View className="modal-info">
                <Text className="info-label">顾客：</Text>
                <Text className="info-value">{selectedOrder.user?.nickname || '微信用户'}</Text>
              </View>
              <View className="modal-info">
                <Text className="info-label">金额：</Text>
                <Text className="info-value highlight">¥{selectedOrder.totalAmount.toFixed(2)}</Text>
              </View>
              <View className="modal-info">
                <Text className="info-label">当前状态：</Text>
                <Text className="info-value" style={{ color: STATUS_COLOR[selectedOrder.status] }}>
                  {STATUS_TEXT[selectedOrder.status]}
                </Text>
              </View>

              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <View className="items-detail">
                  <Text className="detail-title">菜品明细：</Text>
                  {selectedOrder.items.map((item, idx) => (
                    <View key={idx} className="detail-item">
                      <Text className="item-name">{item.dishName} x{item.quantity}</Text>
                      <Text className="item-price">¥{(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          </AtModalContent>
          <AtModalAction>
            <Button onClick={() => setShowActionModal(false)}>关闭</Button>
            {getNextAction(selectedOrder.status) && (
              <Button
                style={{ color: '#FF7A45' }}
                onClick={() => handleStatusChange(getNextAction(selectedOrder.status)!.status)}
                loading={actionLoading}
              >
                {getNextAction(selectedOrder.status)?.text}
              </Button>
            )}
          </AtModalAction>
        </AtModal>
      )}
    </View>
  );
};

export default ChefOrderPage;
