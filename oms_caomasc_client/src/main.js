/**
 * Vue 应用入口文件
 * 负责初始化 Vue 应用、注册全局组件、配置插件等
 */

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'

// 暗色主题样式已移除

// 创建 Vue 应用实例
const app = createApp(App)

// 注册所有 Element Plus 图标组件为全局组件
// 这样可以在任何组件中直接使用图标，无需单独导入
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 使用 Pinia 状态管理
// Pinia 是 Vue 3 的官方状态管理库，替代了 Vuex
app.use(createPinia())

// 使用 Vue Router 路由管理
// 提供单页应用的路由功能
app.use(router)

// 使用 Element Plus UI 组件库
// 提供丰富的 UI 组件和样式
app.use(ElementPlus)

// 将应用挂载到 DOM 元素 #app
app.mount('#app') 