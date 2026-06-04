import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Button, Input } from '@tarojs/components'
import { reqPatchUpdateUser, reqPostCheckFile, reqPostPresignedUrl, reqPostConfirmUpload } from '../services'
import { useAuth } from '../store'
import { calculateFileMd5 } from '../utils/md5'

interface EditProfileModalProps {
  visible: boolean
  onClose: () => void
  onSuccess: () => void
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ visible, onClose, onSuccess }) => {
  const { userInfo, updateUserInfo } = useAuth()
  const [nickname, setNickname] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (visible && userInfo) {
      setNickname(userInfo.nickname || userInfo.username || '')
      setAvatarUrl(userInfo.avatar || '')
    }
  }, [visible, userInfo])

  const handleChooseAvatar = async (e: any) => {
    const avatarPath = e.detail.avatarUrl
    if (!avatarPath) return

    try {
      setLoading(true)
      Taro.showLoading({ title: '上传头像中...' })

      // 计算文件的 MD5
      const md5 = await calculateFileMd5(avatarPath)
      const filename = `avatar_${Date.now()}.jpg`

      // 秒传检查
      const checkRes = await reqPostCheckFile(md5)
      if (checkRes.exists && checkRes.url) {
        setAvatarUrl(checkRes.url)
        Taro.hideLoading()
        return
      }

      // 获取预签名上传 URL
      const presignedRes = await reqPostPresignedUrl({
        md5,
        filename,
        contentType: 'image/jpeg',
        folder: 'avatars',
      })

      // 读取文件为 ArrayBuffer
      const fileData = await new Promise<ArrayBuffer>((resolve, reject) => {
        Taro.getFileSystemManager().readFile({
          filePath: avatarPath,
          success: (res) => resolve(res.data as ArrayBuffer),
          fail: (err) => reject(err),
        })
      })

      // 使用 PUT 方法上传文件到 MinIO
      await Taro.request({
        url: presignedRes.uploadUrl,
        method: 'PUT',
        header: {
          'Content-Type': 'image/jpeg',
        },
        data: fileData,
      })

      // 确认上传
      const confirmRes = await reqPostConfirmUpload({
        md5,
        storageKey: presignedRes.storageKey,
        originalName: filename,
        contentType: 'image/jpeg',
        size: 0,
        folder: 'avatars',
      })

      setAvatarUrl(confirmRes.url)
      Taro.hideLoading()
    } catch (error) {
      Taro.hideLoading()
      console.error('上传头像失败:', error)
      Taro.showToast({ title: '上传头像失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!userInfo) return

    if (!nickname.trim()) {
      Taro.showToast({ title: '请输入昵称', icon: 'none' })
      return
    }

    try {
      setLoading(true)
      Taro.showLoading({ title: '保存中...' })

      const updatedUser = await reqPatchUpdateUser(userInfo.id, {
        nickname: nickname.trim(),
        avatar: avatarUrl || undefined,
      })

      // 更新本地存储的用户信息
      updateUserInfo({
        ...userInfo,
        nickname: updatedUser.nickname,
        avatar: updatedUser.avatar,
      })

      Taro.hideLoading()
      Taro.showToast({ title: '保存成功', icon: 'success' })
      onSuccess()
      onClose()
    } catch (error) {
      Taro.hideLoading()
      console.error('保存用户信息失败:', error)
      Taro.showToast({ title: '保存失败', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  if (!visible) return null

  return (
    <View className="fixed inset-0 z-50 flex items-end justify-center">
      {/* 遮罩层 */}
      <View
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* 弹窗内容 */}
      <View className="relative w-full rounded-t-3xl bg-white pb-8">
        {/* 头部 */}
        <View className="flex items-center justify-between px-6 py-4">
          <Text className="text-lg font-bold text-[#2f3327]">编辑个人信息</Text>
          <View onClick={onClose}>
            <Text className="text-2xl text-[#A39584]">×</Text>
          </View>
        </View>

        {/* 头像区域 */}
        <View className="flex flex-col items-center px-6 py-4">
          <Button
            className="m-0 h-20 w-20 overflow-hidden rounded-full border-0 bg-transparent p-0"
            openType="chooseAvatar"
            onChooseAvatar={handleChooseAvatar}
          >
            {avatarUrl ? (
              <Image
                className="h-20 w-20 rounded-full"
                src={avatarUrl}
                mode="aspectFill"
              />
            ) : (
              <View className="flex h-20 w-20 items-center justify-center rounded-full bg-[#FFFDF7]">
                <Text className="text-[40px]">👤</Text>
              </View>
            )}
          </Button>
          <Text className="mt-2 text-[13px] text-[#8B7355]">点击更换头像</Text>
        </View>

        {/* 昵称输入 */}
        <View className="px-6 py-4">
          <Text className="mb-2 block text-[14px] font-medium text-[#2f3327]">昵称</Text>
          <Input
            className="rounded-xl border border-[#E8DDD0] px-4 py-3 text-[15px]"
            type="nickname"
            placeholder="请输入昵称"
            value={nickname}
            onInput={(e) => setNickname(e.detail.value)}
            maxlength={20}
          />
        </View>

        {/* 保存按钮 */}
        <View className="px-6 pt-2">
          <View
            className={`flex w-full items-center justify-center rounded-full py-3.5 ${
              loading ? 'bg-[#E8833A]/60' : 'bg-[#E8833A] active:scale-[0.98]'
            } transition-transform`}
            onClick={loading ? undefined : handleSave}
          >
            <Text className="font-medium text-white">
              {loading ? '保存中...' : '保存'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default EditProfileModal
