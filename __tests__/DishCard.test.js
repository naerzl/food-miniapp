import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DishCard from '../src/components/DishCard';

const mockDish = {
  id: 1,
  name: '宫保鸡丁',
  price: 28,
  image: 'https://via.placeholder.com/300',
  description: '经典川菜，麻辣鲜香',
  available: true,
  todaySupply: true,
  categoryId: 2,
  categoryName: '热菜'
};

describe('DishCard Component', () => {
  test('renders dish information correctly', () => {
    const { getByText, getByAltText } = render(
      <DishCard dish={mockDish} onAddToCart={() => {}} />
    );

    expect(getByText('宫保鸡丁')).toBeInTheDocument();
    expect(getByText('¥28')).toBeInTheDocument();
    expect(getByText('经典川菜，麻辣鲜香')).toBeInTheDocument();
  });

  test('calls onAddToCart when button is clicked', () => {
    const mockOnAddToCart = jest.fn();
    const { getByText } = render(
      <DishCard dish={mockDish} onAddToCart={mockOnAddToCart} />
    );

    fireEvent.click(getByText('加入购物车'));
    expect(mockOnAddToCart).toHaveBeenCalledWith(1);
  });

  test('disables button when dish is not available', () => {
    const disabledDish = { ...mockDish, available: false };
    const { getByText } = render(
      <DishCard dish={disabledDish} onAddToCart={() => {}} />
    );

    const button = getByText('已售罄');
    expect(button).toBeDisabled();
  });

  test('disables button when dish is not available today', () => {
    const notAvailableTodayDish = { ...mockDish, todaySupply: false };
    const { getByText } = render(
      <DishCard dish={notAvailableTodayDish} onAddToCart={() => {}} />
    );

    const button = getByText('今日不供应');
    expect(button).toBeDisabled();
  });
});
