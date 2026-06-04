export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/guest/menu/index',
    'pages/guest/cart/index',
    'pages/guest/confirm/index',
    'pages/guest/orders/index',
    'pages/guest/order-detail/index',
    'pages/guest/profile/index',
    'pages/guest/login/index',
  ],
  tabBar: {
    custom: true,
    color: '#8B7355',
    selectedColor: '#E8833A',
    backgroundColor: '#FFFCF5',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/guest/menu/index',
        text: '菜单',
      },
      {
        pagePath: 'pages/guest/orders/index',
        text: '订单',
      },
      {
        pagePath: 'pages/guest/profile/index',
        text: '我的',
      },
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFF8EC',
    navigationBarTitleText: '轻食',
    navigationBarTextStyle: 'black',
    backgroundColor: '#F8F3EA',
  },
})
