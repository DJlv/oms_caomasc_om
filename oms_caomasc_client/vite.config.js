/**
 * Vite 构建工具配置文件
 * 用于配置项目的构建、开发服务器、插件等
 */

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  // 插件配置
  plugins: [
    vue() // Vue 3 插件，支持 .vue 单文件组件
  ],
  
  // 路径解析配置
  resolve: {
    alias: {
      // 设置 @ 别名指向 src 目录，方便导入文件
      '@': resolve(__dirname, 'src')
    }
  },
  
  // 开发服务器配置
  server: {
    port: 3000, // 开发服务器端口
    proxy: {
      // API 代理配置
      // 所有以 /api 开头的请求都会被代理到后端服务
      '/api': {
        target: 'http://localhost:8080', // 后端服务地址
        changeOrigin: true, // 改变请求头中的 Origin 字段
        rewrite: (path) => path.replace(/^\/api/, '') // 重写路径，移除 /api 前缀
      }
    }
  },
  
  // 构建配置
  build: {
    outDir: 'dist', // 构建输出目录
    assetsDir: 'assets' // 静态资源目录
  }
}) 