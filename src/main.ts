// src/main.ts
import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'

// UnoCSS
import 'virtual:uno.css'

// 全局SCSS
import './styles/main.scss'

// 引入所有图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 中文包
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)  // 启用 Pinia
app.use(router)         // 启用 Vue Router
app.use(ElementPlus, { locale: zhCn })    // 启用 Element Plus

// 循环遍历并全局注册所有图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount('#app')
