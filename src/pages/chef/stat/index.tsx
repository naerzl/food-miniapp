import React, { useState, useEffect, useCallback } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtActivityIndicator, AtTabs, AtTabsPane } from 'taro-ui';
import { statisticsApi } from '../../../services';
import { DashboardOverviewDto, TrendResponseDto, DishRankingItemDto } from '../../../../types';
import './index.scss';

const TABS = [
  { title: '今日概览' },
  { title: '趋势分析' },
  { title: '菜品排行' },
];

const StatPage: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<DashboardOverviewDto | null>(null);
  const [trends, setTrends] = useState<TrendResponseDto | null>(null);
  const [dishRanking, setDishRanking] = useState<DishRankingItemDto[]>([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      if (currentTab === 0) {
        const res = await statisticsApi.getDashboardOverview();
        setDashboard(res);
      } else if (currentTab === 1) {
        const res = await statisticsApi.getTrends('7d', 'both');
        setTrends(res);
      } else if (currentTab === 2) {
        const res = await statisticsApi.getDishRanking('sales', '7d', undefined, 10);
        setDishRanking(res || []);
      }
    } catch (error) {
      console.error('加载统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, [currentTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useDidShow(() => {
    loadData();
  });

  const renderOverview = () => {
    if (!dashboard) return null;

    return (
      <View className="overview-section">
        <View className="stat-cards">
          <View className="stat-card primary">
            <Text className="stat-value">{dashboard.today.orderCount}</Text>
            <Text className="stat-label">今日订单</Text>
            {dashboard.comparison.orderCountChange !== 0 && (
              <Text className={`stat-change ${dashboard.comparison.orderCountChange > 0 ? 'up' : 'down'}`}>
                {dashboard.comparison.orderCountChange > 0 ? '↑' : '↓'}
                {Math.abs(dashboard.comparison.orderCountChange).toFixed(1)}%
              </Text>
            )}
          </View>
          <View className="stat-card">
            <Text className="stat-value">¥{dashboard.today.revenue.toFixed(2)}</Text>
            <Text className="stat-label">今日营收</Text>
            {dashboard.comparison.revenueChange !== 0 && (
              <Text className={`stat-change ${dashboard.comparison.revenueChange > 0 ? 'up' : 'down'}`}>
                {dashboard.comparison.revenueChange > 0 ? '↑' : '↓'}
                {Math.abs(dashboard.comparison.revenueChange).toFixed(1)}%
              </Text>
            )}
          </View>
          <View className="stat-card warning">
            <Text className="stat-value">{dashboard.today.pendingOrders}</Text>
            <Text className="stat-label">待处理</Text>
          </View>
          <View className="stat-card success">
            <Text className="stat-value">{dashboard.today.preparingOrders}</Text>
            <Text className="stat-label">制作中</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTrends = () => {
    if (!trends || !trends.trend || trends.trend.length === 0) {
      return (
        <View className="empty-section">
          <Text className="empty-text">暂无趋势数据</Text>
        </View>
      );
    }

    // Calculate max values for chart scaling
    const maxOrders = Math.max(...trends.trend.map(t => t.orderCount), 1);
    const maxRevenue = Math.max(...trends.trend.map(t => t.revenue), 1);

    return (
      <View className="trend-section">
        <View className="summary-cards">
          <View className="summary-card">
            <Text className="summary-value">{trends.summary.totalOrders}</Text>
            <Text className="summary-label">总订单数</Text>
          </View>
          <View className="summary-card">
            <Text className="summary-value">¥{trends.summary.totalRevenue.toFixed(2)}</Text>
            <Text className="summary-label">总营收</Text>
          </View>
          <View className="summary-card">
            <Text className="summary-value">¥{trends.summary.avgOrderAmount.toFixed(2)}</Text>
            <Text className="summary-label">客单价</Text>
          </View>
        </View>

        <View className="chart-section">
          <Text className="chart-title">每日订单量</Text>
          <View className="bar-chart">
            {trends.trend.map((item, index) => (
              <View key={index} className="bar-item">
                <View className="bar-wrapper">
                  <View
                    className="bar orders-bar"
                    style={{ height: `${(item.orderCount / maxOrders) * 100}%` }}
                  >
                    <Text className="bar-value">{item.orderCount}</Text>
                  </View>
                </View>
                <Text className="bar-label">{item.date.slice(5)}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="chart-section">
          <Text className="chart-title">每日营收</Text>
          <View className="bar-chart">
            {trends.trend.map((item, index) => (
              <View key={index} className="bar-item">
                <View className="bar-wrapper">
                  <View
                    className="bar revenue-bar"
                    style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                  >
                    <Text className="bar-value">¥{item.revenue.toFixed(0)}</Text>
                  </View>
                </View>
                <Text className="bar-label">{item.date.slice(5)}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const renderRanking = () => {
    if (dishRanking.length === 0) {
      return (
        <View className="empty-section">
          <Text className="empty-text">暂无数据</Text>
        </View>
      );
    }

    return (
      <View className="ranking-section">
        {dishRanking.map((item, index) => (
          <View key={item.dishId} className="ranking-item">
            <View className={`rank-number ${index < 3 ? 'top' : ''}`}>
              <Text className="number">{index + 1}</Text>
            </View>
            <View className="rank-info">
              <Text className="dish-name">{item.dishName}</Text>
              <Text className="dish-category">{item.categoryName || '未分类'}</Text>
            </View>
            <View className="rank-stats">
              <Text className="stat">销量: {item.quantity}</Text>
              <Text className="revenue">¥{item.revenue.toFixed(2)}</Text>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View className="loading-container">
          <AtActivityIndicator size="large" mode="center" />
        </View>
      );
    }

    switch (currentTab) {
      case 0:
        return renderOverview();
      case 1:
        return renderTrends();
      case 2:
        return renderRanking();
      default:
        return null;
    }
  };

  return (
    <View className="stat-page">
      <AtTabs
        current={currentTab}
        tabList={TABS}
        onClick={(index) => setCurrentTab(index)}
        className="stat-tabs"
      />
      <View className="stat-content">
        {renderContent()}
      </View>
    </View>
  );
};

export default StatPage;
