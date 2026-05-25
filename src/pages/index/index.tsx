import React, { useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'
import { useAuth } from '../../store'
import './index.scss'

const IndexPage: React.FC = () => {
  const { isLogin } = useAuth()

  useEffect(() => {
    if (isLogin) {
      Taro.switchTab({ url: '/pages/guest/menu/index' })
    }
  }, [isLogin])

  const handleEnter = () => {
    Taro.switchTab({ url: '/pages/guest/menu/index' })
  }

  return (
    <View className="index-page">
      <View className="hero-section">
        <View className="logo-section">
          <View className="logo-icon">🍽️</View>
          <Text className="app-name">私厨点餐助手</Text>
          <Text className="app-slogan">家庭私厨，美味随时享</Text>
        </View>
      </View>

      <View className="action-section">
        <AtButton
          type="primary"
          className="guest-btn"
          onClick={handleEnter}
        >
          进入点餐
        </AtButton>
      </View>

      <View className="footer-section">
        <Text className="footer-text">让家庭用餐更简单、更温馨</Text>
      </View>
    </View>
  )
}

export default IndexPage
