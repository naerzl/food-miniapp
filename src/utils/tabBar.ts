import Taro from '@tarojs/taro'

const LAST_SELECTED_KEY = '__food_custom_tabbar_selected__'

type CustomTabBar = {
  setSelected?: (index: number, animated?: boolean) => void
  setData?: (data: {
    selected?: number
    indicatorStyle?: string
    animated?: boolean
  }) => void
}

function getCustomTabBar() {
  const page = Taro.getCurrentInstance().page as
    | {
        getTabBar?: () => CustomTabBar
      }
    | undefined

  return page?.getTabBar?.()
}

function setTabBarSelected(tabBar: CustomTabBar, selected: number, animated: boolean) {
  if (tabBar.setSelected) {
    tabBar.setSelected(selected, animated)
    return
  }

  tabBar.setData?.({
    selected,
    animated,
    indicatorStyle: `transform: translateX(${selected * 100}%);`,
  })
}

export function syncCustomTabBar(selected: number) {
  const tabBar = getCustomTabBar()
  if (!tabBar) return

  const rawPrevious = Taro.getStorageSync(LAST_SELECTED_KEY)
  const previous = Number(rawPrevious)
  const hasPrevious = rawPrevious !== '' && Number.isInteger(previous) && previous >= 0
  Taro.setStorageSync(LAST_SELECTED_KEY, selected)

  if (!hasPrevious || previous === selected) {
    setTabBarSelected(tabBar, selected, false)
    return
  }

  setTabBarSelected(tabBar, previous, false)
  setTimeout(() => {
    setTabBarSelected(tabBar, selected, true)
  }, 40)
}
