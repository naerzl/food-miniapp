jest.mock('@tarojs/taro', () => {
  const taro = {
    ENV_TYPE: { WEB: 'WEB' },
    getEnv: jest.fn(() => 'WEAPP'),
    getStorageSync: jest.fn(),
    request: jest.fn(),
    showToast: jest.fn(),
    redirectTo: jest.fn(),
  }

  return {
    __esModule: true,
    default: taro,
    ...taro,
  }
})

global.__API_BASE_URL__ = 'http://localhost:3000'

const Taro = require('@tarojs/taro').default
const { request } = require('../src/services/request')

describe('request', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    Taro.getStorageSync.mockReturnValue('')
  })

  test('resolves standard successful ApiResponse data without showing error toast', async () => {
    Taro.request.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 0,
        message: '成功',
        data: { id: 'dish-1', name: '鸡胸肉沙拉' },
      },
    })

    await expect(request({ url: '/api/dishes/today' })).resolves.toEqual({
      id: 'dish-1',
      name: '鸡胸肉沙拉',
    })

    expect(Taro.showToast).not.toHaveBeenCalled()
  })
})
