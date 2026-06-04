import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import tailwindcss from 'tailwindcss'
import { UnifiedViteWeappTailwindcssPlugin } from 'weapp-tailwindcss/vite'
import * as fs from 'fs'
import * as path from 'path'
import devConfig from './dev'
import prodConfig from './prod'

function customTabBarPlugin(): any {
  const srcDir = path.resolve(__dirname, '../src/custom-tab-bar')
  const distDir = path.resolve(__dirname, '../dist/custom-tab-bar')

  function emit() {
    if (!fs.existsSync(srcDir)) return
    fs.mkdirSync(distDir, { recursive: true })

    // index.json
    const jsonPath = path.join(srcDir, 'index.json.js')
    if (fs.existsSync(jsonPath)) {
      delete require.cache[require.resolve(jsonPath)]
      const mod = require(jsonPath)
      const json = mod.default ?? mod
      fs.writeFileSync(path.join(distDir, 'index.json'), JSON.stringify(json, null, 2))
    }

    // index.js — 从 TSX 源码提取 tabs 生成 WeChat Component
    const tsxPath = path.join(srcDir, 'index.tsx')
    if (fs.existsSync(tsxPath)) {
      const src = fs.readFileSync(tsxPath, 'utf-8')
      const tabsMatch = src.match(/const tabs = (\[[\s\S]*?\])/)
      const tabs = tabsMatch ? eval(tabsMatch[1]) : []
      fs.writeFileSync(path.join(distDir, 'index.js'), [
        `Component({`,
        `  data: {`,
        `    selected: 0,`,
        `    indicatorStyle: 'transform: translateX(0%);',`,
        `    animated: false,`,
        `    switching: false,`,
        `    tabs: ${JSON.stringify(tabs)}`,
        `  },`,
        `  lifetimes: {`,
        `    attached: function() {`,
        `      this.syncSelected()`,
        `    }`,
        `  },`,
        `  pageLifetimes: {`,
        `    show: function() {`,
        `      this.syncSelected()`,
        `    }`,
        `  },`,
        `  methods: {`,
        `    setSelected: function(index, animated) {`,
        `      this.setData({`,
        `        selected: index,`,
        `        animated: !!animated,`,
        `        indicatorStyle: 'transform: translateX(' + (index * 100) + '%);'`,
        `      })`,
        `    },`,
        `    getCurrentRoute: function() {`,
        `      var pages = getCurrentPages()`,
        `      var cur = pages[pages.length - 1]`,
        `      return cur ? '/' + cur.route : ''`,
        `    },`,
        `    syncSelected: function() {`,
        `      var route = this.getCurrentRoute()`,
        `      if (!route) return`,
        `      var idx = this.data.tabs.findIndex(function(t) { return t.path === route })`,
        `      if (idx >= 0 && idx !== this.data.selected) {`,
        `        this.setSelected(idx)`,
        `      }`,
        `    },`,
        `    switchTab: function(e) {`,
        `      if (this.data.switching) return`,
        `      var index = Number(e.currentTarget.dataset.index)`,
        `      var tab = this.data.tabs[index]`,
        `      if (!tab) return`,
        `      if (tab.path === this.getCurrentRoute()) {`,
        `        this.setSelected(index)`,
        `        return`,
        `      }`,
        `      var self = this`,
        `      this.setData({ switching: true })`,
        `      wx.switchTab({`,
        `        url: tab.path,`,
        `        fail: function() {`,
        `          self.syncSelected()`,
        `        },`,
        `        complete: function() {`,
        `          self.setData({ switching: false })`,
        `        }`,
        `      })`,
        `    }`,
        `  }`,
        `})`,
      ].join('\n'))
    }

    // index.wxml
    fs.writeFileSync(path.join(distDir, 'index.wxml'), [
      `<view class="custom-tabbar {{animated ? 'custom-tabbar--animated' : ''}}">`,
      `  <view class="custom-tabbar__track">`,
      `    <view class="custom-tabbar__indicator" style="{{indicatorStyle}}"></view>`,
      `  </view>`,
      `  <view`,
      `    wx:for="{{tabs}}"`,
      `    wx:key="path"`,
      `    class="custom-tabbar__item {{selected === index ? 'custom-tabbar__item--active' : ''}}"`,
      `    bindtap="switchTab"`,
      `    data-index="{{index}}"`,
      `  >`,
      `    <text class="custom-tabbar__icon">{{item.icon}}</text>`,
      `    <text class="custom-tabbar__text">{{item.text}}</text>`,
      `  </view>`,
      `</view>`,
    ].join('\n'))

    // index.wxss
    const scssPath = path.join(srcDir, 'index.scss')
    if (fs.existsSync(scssPath)) {
      fs.copyFileSync(scssPath, path.join(distDir, 'index.wxss'))
    }
  }

  return {
    name: 'taro:custom-tab-bar',
    // dev 模式: 在 server 启动后写文件 + 监听变化
    configureServer(server) {
      // 延迟执行，等 Taro 完成初始化后再写
      setTimeout(() => emit(), 500)
      server.watcher.add(srcDir)
      server.watcher.on('all', (event: string, filePath: string) => {
        if (filePath.startsWith(srcDir)) {
          setTimeout(() => emit(), 100)
        }
      })
    },
    // build 模式: 在产物写入磁盘后生成
    closeBundle() { emit() },
  }
}

// https://taro-docs.jd.com/docs/next/config#defineconfig-辅助函数
export default defineConfig<'vite'>(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport<'vite'> = {
    projectName: 'food-app',
    date: '2026-6-3',
    designWidth: 375,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    plugins: [],
    defineConstants: {
      __API_BASE_URL__: JSON.stringify(process.env.TARO_APP_API_URL || 'http://localhost:18321'),
    },
    copy: {
      patterns: [],
      options: {},
    },
    framework: 'react',
    compiler: {
      type: 'vite',
      vitePlugins: [
        customTabBarPlugin(),
        {
          name: 'postcss-config-loader-plugin',
          config(config) {
            if (typeof config.css?.postcss === 'object') {
              config.css.postcss.plugins?.unshift(tailwindcss())
            }
          },
        },
        UnifiedViteWeappTailwindcssPlugin({
          rem2rpx: true,
          disabled:
            process.env.TARO_ENV === 'h5' ||
            process.env.TARO_ENV === 'harmony' ||
            process.env.TARO_ENV === 'rn',
          injectAdditionalCssVarScope: true,
        }),
      ] as any,
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {

          }
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
    },
    h5: {
      publicPath: '/',
      staticDirectory: 'static',

      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
          config: {
            namingPattern: 'module', // 转换模式，取值为 global/module
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
    },
    rn: {
      appName: 'QingShi',
      postcss: {
        cssModules: {
          enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        }
      }
    }
  }
  if (process.env.NODE_ENV === 'development') {
    // 本地开发构建配置（不混淆压缩）
    return merge({}, baseConfig, devConfig)
  }
  // 生产构建配置（默认开启压缩混淆等）
  return merge({}, baseConfig, prodConfig)
})
