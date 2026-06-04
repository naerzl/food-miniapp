import { View, Text } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { useState } from 'react'
import './index.scss'

const tabs = [
  { path: '/pages/guest/menu/index', icon: '🍽️', text: '菜单' },
  { path: '/pages/guest/orders/index', icon: '📋', text: '订单' },
  { path: '/pages/guest/profile/index', icon: '👤', text: '我的' },
]

const LAST_SELECTED_KEY = '__food_custom_tabbar_selected__'

const CustomTabBar = () => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [animated, setAnimated] = useState(false)
  const [switching, setSwitching] = useState(false)

  const setSelected = (index: number, shouldAnimate: boolean) => {
    setAnimated(shouldAnimate)
    setSelectedIndex(index)
  }

  const syncSelected = () => {
    const pages = Taro.getCurrentPages()
    const currentRoute = pages[pages.length - 1]?.route
    if (currentRoute) {
      const idx = tabs.findIndex((t) => t.path === `/${currentRoute}`)
      if (idx >= 0) {
        const rawPrevious = Taro.getStorageSync(LAST_SELECTED_KEY)
        const previous = Number(rawPrevious)
        const hasPrevious = rawPrevious !== '' && Number.isInteger(previous) && previous >= 0
        Taro.setStorageSync(LAST_SELECTED_KEY, idx)

        if (!hasPrevious || previous === idx) {
          setSelected(idx, false)
          return
        }

        setSelected(previous, false)
        setTimeout(() => setSelected(idx, true), 40)
      }
    }
  }

  useDidShow(syncSelected)

  const handleSwitch = (index: number) => {
    if (switching) return

    const tab = tabs[index]
    const pages = Taro.getCurrentPages()
    const currentRoute = pages[pages.length - 1]?.route

    if (tab.path === `/${currentRoute}`) {
      setSelected(index, false)
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
    <View className={`custom-tabbar${animated ? ' custom-tabbar--animated' : ''}`}>
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
