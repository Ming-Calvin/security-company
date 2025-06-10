// unocss.config.ts
import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
} from 'unocss'

export default defineConfig({
  // 预设
  presets: [
    presetUno(), // 默认预设
    presetAttributify(), // 属性化模式支持，例如 <div text-center></div>
    presetIcons({   // 图标预设
      scale: 1.2,
      warn: true,
    }),
  ],
  // 自定义规则
  rules: [
    // 例如：['m-1', { margin: '0.25rem' }]
  ],
  // 自定义快捷方式
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'text-[0.9em] inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600 !outline-none'],
  ],
})
