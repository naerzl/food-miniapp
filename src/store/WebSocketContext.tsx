/**
 * WebSocket 通知 Context
 * 用于全局接收新订单通知
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { connectWebSocket, disconnectWebSocket, subscribeNewOrder } from '../services/websocket'

interface WebSocketContextType {
  isConnected: boolean
  lastOrder: any | null
  clearLastOrder: () => void
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  lastOrder: null,
  clearLastOrder: () => {}
})

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [lastOrder, setLastOrder] = useState<any | null>(null)

  useEffect(() => {
    // 连接 WebSocket
    connectWebSocket()
      .then(() => {
        setIsConnected(true)
      })
      .catch((err) => {
        console.error('WebSocket 连接失败:', err)
        setIsConnected(false)
      })

    // 订阅新订单通知
    const unsubscribe = subscribeNewOrder((order) => {
      console.log('收到新订单通知:', order)
      setLastOrder(order)

      // 显示通知提示
      Taro.showToast({
        title: `新订单: ${order.orderNo || '未知'}`,
        icon: 'none',
        duration: 3000
      })

      // 震动提醒（如果设备支持）
      try {
        Taro.vibrateShort()
      } catch (e) {
        // 忽略不支持震动的错误
      }
    })

    // 页面卸载时断开连接
    return () => {
      unsubscribe()
      disconnectWebSocket()
    }
  }, [])

  const clearLastOrder = useCallback(() => {
    setLastOrder(null)
  }, [])

  return (
    <WebSocketContext.Provider value={{ isConnected, lastOrder, clearLastOrder }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  return useContext(WebSocketContext)
}
