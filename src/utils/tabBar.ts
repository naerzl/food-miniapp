import Taro from '@tarojs/taro'

type CustomTabBar = {
  setSelected?: (index: number) => void
  setData?: (data: {
    selected?: number
    indicatorStyle?: string
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

function setTabBarSelected(tabBar: CustomTabBar, selected: number) {
  if (tabBar.setSelected) {
    tabBar.setSelected(selected)
    return
  }

  tabBar.setData?.({
    selected,
    indicatorStyle: `transform: translateX(${selected * 100}%);`,
  })
}

export function syncCustomTabBar(selected: number) {
  const tabBar = getCustomTabBar()
  if (!tabBar) return

  setTabBarSelected(tabBar, selected)
}
