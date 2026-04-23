/**
 * WebSocket 服务 - 用于接收新订单通知
 * 使用 Taro 原生 API 实现
 */

import Taro from '@tarojs/taro'
import { getBaseUrl } from './request'

let socket: Taro.SocketTask | null = null
let isConnected = false
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5
const RECONNECT_INTERVAL = 5000

// 订单通知回调
type OrderCallback = (order: any) => void
const orderCallbacks: OrderCallback[] = []

/**
 * 连接到 WebSocket 服务器
 */
export function connectWebSocket(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isConnected) {
      resolve()
      return
    }

    const baseUrl = getBaseUrl()
    // 将 http:// 替换为 ws://，https:// 替换为 wss://
    const wsUrl = baseUrl.replace(/^http/, 'ws') + '/ws'

    try {
      socket = Taro.connectSocket({
        url: wsUrl,
        success: () => {
          console.log('WebSocket 连接成功')
          isConnected = true
          reconnectAttempts = 0
          setupSocketListeners()
          resolve()
        },
        fail: (err) => {
          console.error('WebSocket 连接失败:', err)
          isConnected = false
          reject(err)
        }
      })
    } catch (error) {
      console.error('WebSocket 连接异常:', error)
      reject(error)
    }
  })
}

/**
 * 设置 Socket 监听器
 */
function setupSocketListeners() {
  if (!socket) return

  socket.onOpen(() => {
    console.log('WebSocket 已打开')
    isConnected = true
    reconnectAttempts = 0
    // 加入商户房间以接收订单通知
    sendMessage('joinRoom', 'merchants')
  })

  socket.onMessage((res) => {
    try {
      const data = typeof res.data === 'string' ? JSON.parse(res.data) : res.data
      console.log('WebSocket 收到消息:', data)

      // 处理新订单通知
      if (data.type === 'newOrder' || data.event === 'newOrder') {
        const order = data.order || data.data
        orderCallbacks.forEach(callback => callback(order))
      }
    } catch (error) {
      console.error('解析 WebSocket 消息失败:', error)
    }
  })

  socket.onClose(() => {
    console.log('WebSocket 已关闭')
    isConnected = false
    socket = null
    // 尝试重连
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      reconnectAttempts++
      console.log(`${RECONNECT_INTERVAL / 1000}秒后尝试重连...`)
      setTimeout(() => {
        connectWebSocket().catch(console.error)
      }, RECONNECT_INTERVAL)
    }
  })

  socket.onError((err) => {
    console.error('WebSocket 错误:', err)
    isConnected = false
  })
}

/**
 * 发送消息到服务器
 */
function sendMessage(event: string, data: any) {
  if (!socket || !isConnected) {
    console.warn('WebSocket 未连接，无法发送消息')
    return
  }

  const message = JSON.stringify({ event, data })
  socket.send({ data: message })
}

/**
 * 断开 WebSocket 连接
 */
export function disconnectWebSocket() {
  if (socket) {
    socket.close({
      success: () => {
        console.log('WebSocket 主动关闭')
        isConnected = false
        socket = null
      }
    })
  }
}

/**
 * 订阅新订单通知
 */
export function subscribeNewOrder(callback: OrderCallback) {
  orderCallbacks.push(callback)
  return () => {
    const index = orderCallbacks.indexOf(callback)
    if (index > -1) {
      orderCallbacks.splice(index, 1)
    }
  }
}

/**
 * 检查 WebSocket 连接状态
 */
export function isWebSocketConnected(): boolean {
  return isConnected
}
