export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/guest/menu/index',
    'pages/guest/cart/index',
    'pages/guest/confirm/index',
    'pages/guest/orders/index',
    'pages/guest/order-detail/index',
    'pages/guest/profile/index',
  ],
  tabBar: {
    color: '#999999',
    selectedColor: '#6BBF99',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/guest/menu/index',
        text: '菜单',
        iconPath: 'assets/tabbar/menu.png',
        selectedIconPath: 'assets/tabbar/menu-active.png',
      },
      {
        pagePath: 'pages/guest/cart/index',
        text: '购物车',
        iconPath: 'assets/tabbar/cart.png',
        selectedIconPath: 'assets/tabbar/cart-active.png',
      },
      {
        pagePath: 'pages/guest/orders/index',
        text: '订单',
        iconPath: 'assets/tabbar/order.png',
        selectedIconPath: 'assets/tabbar/order-active.png',
      },
      {
        pagePath: 'pages/guest/profile/index',
        text: '我的',
        iconPath: 'assets/tabbar/profile.png',
        selectedIconPath: 'assets/tabbar/profile-active.png',
      },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '私厨点餐',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F8F9FA',
  },
})
