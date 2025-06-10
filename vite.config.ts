// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import VueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  // 路径解析
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  // 插件配置
  plugins: [
    vue(),
    VueDevTools(), // Vue 开发者工具
    UnoCSS(),      // UnoCSS 原子化 CSS 引擎

    // 自动按需导入组件
    Components({
      resolvers: [
        // 自动导入 Element Plus 组件
        ElementPlusResolver(),
      ],
      // 指定组件位置，默认是 src/components
      dirs: ['src/components'],
      // 配置文件生成位置
      dts: 'src/types/components.d.ts',
    }),

    // 自动按需导入 API
    AutoImport({
      // 全局导入的模块
      imports: [
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core',
      ],
      // 解析器
      resolvers: [
        // 自动导入 Element Plus 相关函数，如 ElMessage
        ElementPlusResolver(),
      ],
      // 配置文件生成位置
      dts: 'src/types/auto-imports.d.ts',
      // ESLint 支持
      eslintrc: {
        enabled: true,
      },
    }),
  ],

  // CSS 预处理器配置
  css: {
    preprocessorOptions: {
      scss: {
        // 可以注入全局变量
        // additionalData: ``,
      },
    },
  },
})
