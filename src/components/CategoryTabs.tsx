import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import './CategoryTabs.scss';

interface Category {
  id: number;
  name: string;
}

interface CategoryTabsProps {
  categories: Category[];
  selectedId: number;
  onChange: (id: number) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories, selectedId, onChange }) => {
  const handleSelect = (id: number) => {
    onChange(id);
  };

  return (
    <ScrollView className='category-tabs' scrollX enableFlex>
      {categories.map((category) => (
        <View
          key={category.id}
          className={`tab-item ${category.id === selectedId ? 'active' : ''}`}
          onClick={() => handleSelect(category.id)}
        >
          <Text className='tab-text'>{category.name}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default CategoryTabs;
