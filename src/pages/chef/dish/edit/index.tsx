import React, { useState, useEffect } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { View, Text, Input, Textarea, Picker } from '@tarojs/components';
import { AtButton, AtSwitch } from 'taro-ui';
import { dishApi, categoryApi } from '../../../../services/api';
import { Dish, Category, CreateDishDto } from '../../../../../types/api';
import './index.scss';

const DishEditPage: React.FC = () => {
  const router = useRouter();
  const dishId = router.params.id;
  const isEdit = !!dishId;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<CreateDishDto>({
    name: '',
    categoryId: '',
    price: 0,
    image: '',
    description: '',
    available: true,
    todaySupply: false,
  });

  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);

  useEffect(() => {
    loadCategories();
    if (isEdit) {
      loadDish();
    }
  }, []);

  const loadCategories = async () => {
    try {
      const res = await categoryApi.getCategories();
      setCategories(res || []);
    } catch (error) {
      console.error('加载分类失败:', error);
    }
  };

  const loadDish = async () => {
    try {
      setLoading(true);
      const dish = await dishApi.getDishById(dishId as string);
      setFormData({
        name: dish.name,
        categoryId: dish.categoryId,
        price: dish.price,
        image: dish.image || '',
        description: dish.description || '',
        available: dish.available,
        todaySupply: dish.todaySupply,
      });
      // 设置分类选择器索引
      const catIndex = categories.findIndex(c => c.id === dish.categoryId);
      if (catIndex >= 0) {
        setSelectedCategoryIndex(catIndex);
      }
    } catch (error) {
      console.error('加载菜品失败:', error);
      Taro.showToast({ title: '加载失败', icon: 'none' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Taro.showToast({ title: '请输入菜品名称', icon: 'none' });
      return;
    }
    if (!formData.categoryId) {
      Taro.showToast({ title: '请选择分类', icon: 'none' });
      return;
    }
    if (formData.price <= 0) {
      Taro.showToast({ title: '请输入有效的价格', icon: 'none' });
      return;
    }

    try {
      setSaving(true);
      if (isEdit) {
        await dishApi.updateDish(dishId as string, formData);
        Taro.showToast({ title: '更新成功', icon: 'success' });
      } else {
        await dishApi.createDish(formData);
        Taro.showToast({ title: '创建成功', icon: 'success' });
      }
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (error) {
      console.error('保存失败:', error);
      Taro.showToast({ title: '保存失败', icon: 'none' });
    } finally {
      setSaving(false);
    }
  };

  const handleCategoryChange = (e: any) => {
    const index = e.detail.value;
    setSelectedCategoryIndex(index);
    setFormData(prev => ({
      ...prev,
      categoryId: categories[index]?.id || '',
    }));
  };

  if (loading) {
    return (
      <View className="dish-edit-page">
        <View className="loading">加载中...</View>
      </View>
    );
  }

  return (
    <View className="dish-edit-page">
      <View className="form-section">
        <View className="form-item required">
          <Text className="label">菜品名称</Text>
          <Input
            className="input"
            value={formData.name}
            onInput={(e) => setFormData(prev => ({ ...prev, name: e.detail.value }))}
            placeholder="请输入菜品名称"
          />
        </View>

        <View className="form-item required">
          <Text className="label">所属分类</Text>
          <Picker
            mode="selector"
            range={categories}
            rangeKey="name"
            value={selectedCategoryIndex}
            onChange={handleCategoryChange}
          >
            <View className="picker">
              <Text className={formData.categoryId ? 'value' : 'placeholder'}>
                {categories[selectedCategoryIndex]?.name || '请选择分类'}
              </Text>
              <Text className="arrow">›</Text>
            </View>
          </Picker>
        </View>

        <View className="form-item required">
          <Text className="label">价格（元）</Text>
          <Input
            className="input"
            type="digit"
            value={formData.price ? String(formData.price) : ''}
            onInput={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.detail.value) || 0 }))}
            placeholder="请输入价格"
          />
        </View>

        <View className="form-item">
          <Text className="label">图片URL</Text>
          <Input
            className="input"
            value={formData.image}
            onInput={(e) => setFormData(prev => ({ ...prev, image: e.detail.value }))}
            placeholder="请输入图片链接"
          />
        </View>

        <View className="form-item">
          <Text className="label">菜品描述</Text>
          <Textarea
            className="textarea"
            value={formData.description}
            onInput={(e) => setFormData(prev => ({ ...prev, description: e.detail.value }))}
            placeholder="请输入菜品描述"
            maxlength={200}
          />
          <Text className="count">{formData.description?.length || 0}/200</Text>
        </View>

        <View className="form-item switch-item">
          <Text className="label">上架状态</Text>
          <AtSwitch
            checked={formData.available}
            onChange={(value) => setFormData(prev => ({ ...prev, available: value }))}
            color="#FF7A45"
          />
        </View>

        <View className="form-item switch-item">
          <Text className="label">今日供应</Text>
          <AtSwitch
            checked={formData.todaySupply}
            onChange={(value) => setFormData(prev => ({ ...prev, todaySupply: value }))}
            color="#FF7A45"
          />
        </View>
      </View>

      <View className="action-section">
        <AtButton
          type="primary"
          className="save-btn"
          loading={saving}
          onClick={handleSave}
        >
          {isEdit ? '保存修改' : '创建菜品'}
        </AtButton>
      </View>
    </View>
  );
};

export default DishEditPage;
