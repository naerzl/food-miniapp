import SparkMD5 from 'spark-md5'
import Taro from '@tarojs/taro'

/**
 * 计算文件 MD5（适配微信小程序环境）
 * @param filePath 文件临时路径（如从 chooseImage/getImageInfo 获取）
 * @returns 文件的 MD5 哈希值
 */
export async function calculateFileMd5(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fs = Taro.getFileSystemManager()

    fs.readFile({
      filePath,
      success: (res) => {
        const buffer = res.data as ArrayBuffer
        const spark = new SparkMD5.ArrayBuffer()
        spark.append(buffer)
        const md5 = spark.end()
        resolve(md5)
      },
      fail: (err) => {
        console.error('读取文件失败:', err)
        reject(new Error('文件读取失败'))
      },
    })
  })
}
