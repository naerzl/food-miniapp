import Taro from '@tarojs/taro'
import { getBaseUrl } from './request'

let socket: Taro.SocketTask | null = null
let isConnected = false
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_INTERVAL = 5000

type OrderCallback = (order: any) => void
const newOrderCallbacks: OrderCallback[] = []
const orderUpdateCallbacks: OrderCallback[] = []

let currentUserId: string | null = null

function joinUserRoom(userId: string) {
  if (!socket || !isConnected) return
  const message = JSON.stringify({ event: 'joinRoom', data: `order:user_${userId}` })
  socket.send({ data: message })
}

export function connectWebSocket(userId: string): Promise<void> {
  currentUserId = userId
  return new Promise((resolve, reject) => {
    if (isConnected) {
      joinUserRoom(userId)
      resolve()
      return
    }

    const baseUrl = getBaseUrl()
    const wsUrl = baseUrl.replace(/^http/, 'ws') + '/ws'

    Taro.connectSocket({
      url: wsUrl,
      success: () => {
        console.log('WebSocket 连接中...')
      },
      fail: (err) => {
        console.error('WebSocket 连接失败:', err)
        isConnected = false
        reject(err)
      },
    })
      .then((task) => {
        socket = task
        setupSocketListeners()
        resolve()
      })
      .catch(reject)
  })
}

function setupSocketListeners() {
  if (!socket) return

  socket.onOpen(() => {
    console.log('WebSocket 已打开')
    isConnected = true
    reconnectAttempts = 0
    if (currentUserId) {
      joinUserRoom(currentUserId)
    }
  })

  socket.onMessage((res) => {
    try {
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
      console.log('WebSocket 收到消息:', data)

      if (data.type === 'newOrder' || data.event === 'newOrder') {
        const order = data.order || data.data
        newOrderCallbacks.forEach((cb) => cb(order))
      }

      if (data.type === 'orderUpdate' || data.event === 'orderUpdate') {
        const order = data.order || data.data
        orderUpdateCallbacks.forEach((cb) => cb(order))
      }
    } catch (error) {
      console.error('解析 WebSocket 消息失败:', error)
    }
  })

  socket.onClose(() => {
    console.log('WebSocket 已关闭')
    isConnected = false
    socket = null
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS && currentUserId) {
      reconnectAttempts++
      console.log(`${RECONNECT_INTERVAL / 1000}秒后尝试重连...`)
      setTimeout(() => {
        connectWebSocket(currentUserId!).catch(console.error)
      }, RECONNECT_INTERVAL)
    }
  })

  socket.onError((err) => {
    console.error('WebSocket 错误:', err)
    isConnected = false
  })
}

export function disconnectWebSocket() {
  currentUserId = null
  reconnectAttempts = MAX_RECONNECT_ATTEMPTS
  if (socket) {
    socket.close({})
    isConnected = false
    socket = null
  }
}

export function subscribeNewOrder(callback: OrderCallback) {
  newOrderCallbacks.push(callback)
  return () => {
    const index = newOrderCallbacks.indexOf(callback)
    if (index > -1) newOrderCallbacks.splice(index, 1)
  }
}

export function subscribeOrderUpdate(callback: OrderCallback) {
  orderUpdateCallbacks.push(callback)
  return () => {
    const index = orderUpdateCallbacks.indexOf(callback)
    if (index > -1) orderUpdateCallbacks.splice(index, 1)
  }
}

export function isWebSocketConnected(): boolean {
  return isConnected
}
