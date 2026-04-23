import React, { useState, useCallback, useEffect } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { View, Text, Input } from '@tarojs/components';
import { AtActivityIndicator, AtSwipeAction, AtModal, AtModalContent, AtModalAction, AtButton } from 'taro-ui';
import { categoryApi } from '../../../services';
import { Category, CreateCategoryDto } from '../../../../types';
import './index.scss';

const CategoryManagePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<CreateCategoryDto>({ name: '', sortOrder: 0 });
  const [saving, setSaving] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await categoryApi.getCategories();
      // 按sortOrder排序
      const sorted = (res || []).sort((a, b) => a.sortOrder - b.sortOrder);
      setCategories(sorted);
    } catch (error) {
      console.error('加载分类失败:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useDidShow(() => {
    loadCategories();
  });

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', sortOrder: categories.length });
    setShowModal(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, sortOrder: category.sortOrder });
    setShowModal(true);
  };

  const handleDelete = (category: Category) => {
    Taro.showModal({
      title: '提示',
      content: `确定要删除分类"${category.name}"吗？`,
      confirmColor: '#FF4D4F',
      success: async (res) => {
        if (res.confirm) {
          try {
            await categoryApi.deleteCategory(category.id);
            Taro.showToast({ title: '删除成功', icon: 'success' });
            loadCategories();
          } catch (error) {
            console.error('删除失败:', error);
            Taro.showToast({ title: '删除失败', icon: 'none' });
          }
        }
      },
    });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Taro.showToast({ title: '请输入分类名称', icon: 'none' });
      return;
    }

    try {
      setSaving(true);
      if (editingCategory) {
        await categoryApi.updateCategory(editingCategory.id, formData);
        Taro.showToast({ title: '更新成功', icon: 'success' });
      } else {
        await categoryApi.createCategory(formData);
        Taro.showToast({ title: '创建成功', icon: 'success' });
      }
      setShowModal(false);
      loadCategories();
    } catch (error) {
      console.error('保存失败:', error);
      Taro.showToast({ title: '保存失败', icon: 'none' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View className="category-manage-page">
        <View className="loading-container">
          <AtActivityIndicator size="large" mode="center" />
        </View>
      </View>
    );
  }

  return (
    <View className="category-manage-page">
      <View className="category-list">
        {categories.length === 0 ? (
          <View className="empty-container">
            <View className="empty-icon">📁</View>
            <Text className="empty-text">暂无分类</Text>
            <Text className="empty-subtext">点击右下角添加分类</Text>
          </View>
        ) : (
          categories.map((category, index) => (
            <AtSwipeAction
              key={category.id}
              options={[
                { text: '编辑', style: { backgroundColor: '#1677FF' } },
                { text: '删除', style: { backgroundColor: '#FF4D4F' } },
              ]}
              onClick={(item, index) => {
                if (index === 0) handleEdit(category);
                if (index === 1) handleDelete(category);
              }}
            >
              <View className="category-item">
                <View className="item-left">
                  <Text className="sort-number">{index + 1}</Text>
                  <Text className="category-name">{category.name}</Text>
                </View>
                <Text className="item-arrow">›</Text>
              </View>
            </AtSwipeAction>
          ))
        )}
      </View>

      {/* 添加按钮 */}
      <View className="add-btn" onClick={handleAdd}>
        <Text className="add-icon">+</Text>
      </View>

      {/* 编辑弹窗 */}
      <AtModal isOpened={showModal}>
        <AtModalContent>
          <View className="modal-content">
            <Text className="modal-title">
              {editingCategory ? '编辑分类' : '添加分类'}
            </Text>
            <View className="form-item">
              <Text className="label">分类名称</Text>
              <Input
                className="input"
                value={formData.name}
                onInput={(e) => setFormData(prev => ({ ...prev, name: e.detail.value }))}
                placeholder="请输入分类名称"
              />
            </View>
            <View className="form-item">
              <Text className="label">排序</Text>
              <Input
                className="input"
                type="number"
                value={String(formData.sortOrder)}
                onInput={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.detail.value) || 0 }))}
                placeholder="数字越小排序越靠前"
              />
            </View>
          </View>
        </AtModalContent>
        <AtModalAction>
          <Button onClick={() => setShowModal(false)}>取消</Button>
          <Button style={{ color: '#FF7A45' }} onClick={handleSave} loading={saving}>
            保存
          </Button>
        </AtModalAction>
      </AtModal>
    </View>
  );
};

export default CategoryManagePage;
