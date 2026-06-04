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
  const [switching, setSwitching] = useState(false)

  const syncSelected = () => {
    const pages = Taro.getCurrentPages()
    const currentRoute = pages[pages.length - 1]?.route
    if (currentRoute) {
      const idx = tabs.findIndex((t) => t.path === `/${currentRoute}`)
      if (idx >= 0) setSelectedIndex(idx)
    }
  }

  useDidShow(syncSelected)

  const handleSwitch = (index: number) => {
    if (switching) return

    const tab = tabs[index]
    const pages = Taro.getCurrentPages()
    const currentRoute = pages[pages.length - 1]?.route

    if (tab.path === `/${currentRoute}`) {
      setSelectedIndex(index)
      return
    }

    setSwitching(true)
    Taro.switchTab({
      url: tab.path,
      fail: syncSelected,
      complete: () => {
        setSwitching(false)
      },
    })
  }

  return (
    <View className='custom-tabbar'>
      <View className='custom-tabbar__track'>
        <View
          className='custom-tabbar__indicator'
          style={{ transform: `translateX(${selectedIndex * 100}%)` }}
        />
      </View>
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
