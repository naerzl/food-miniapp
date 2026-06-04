import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

const tabs = [
  { path: '/pages/guest/menu/index', icon: '🍽️', text: '菜单' },
  { path: '/pages/guest/orders/index', icon: '📋', text: '订单' },
  { path: '/pages/guest/profile/index', icon: '👤', text: '我的' },
]

const CustomTabBar = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  useDidShow(() => {
    const pages = Taro.getCurrentPages()
    const currentRoute = pages[pages.length - 1]?.route
    if (currentRoute) {
      const idx = tabs.findIndex((t) => t.path === `/${currentRoute}`)
      if (idx >= 0) setSelectedIndex(idx)
    }
  })

  const handleSwitch = (index: number) => {
    if (index === selectedIndex) return
    Taro.switchTab({ url: tabs[index].path })
  }

  return (
    <View className='custom-tabbar'>
      {tabs.map((item, index) => (
        <View
          key={item.path}
          className={`custom-tabbar__item${index === selectedIndex ? ' custom-tabbar__item--active' : ''}`}
          onClick={() => handleSwitch(index)}
        >
          <Text className='custom-tabbar__icon'>{item.icon}</Text>
          <Text className='custom-tabbar__text'>{item.text}</Text>
        </View>
      ))}
    </View>
  )
}

CustomTabBar.options = {
  addGlobalClass: true,
}

export default CustomTabBar
