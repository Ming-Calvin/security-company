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

const app = createApp(App)

app.use(createPinia())  // 启用 Pinia
app.use(router)         // 启用 Vue Router
app.use(ElementPlus)    // 启用 Element Plus

app.mount('#app')
