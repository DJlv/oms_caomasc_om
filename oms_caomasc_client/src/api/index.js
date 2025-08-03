/**
 * API 服务基础配置文件
 * 配置 axios 实例、请求拦截器、响应拦截器等
 */

import axios from 'axios'
import { ElMessage } from 'element-plus'

/**
 * 创建 axios 实例
 * 配置基础 URL、超时时间、请求头等
 */
const api = axios.create({
  baseURL: '/api', // 基础 URL，会被 Vite 代理到后端服务
  timeout: 10000, // 请求超时时间（毫秒）
  headers: {
    'Content-Type': 'application/json'
  }
})

/**
 * 请求拦截器
 * 在发送请求前执行，用于：
 * - 添加认证 token
 * - 添加请求头
 * - 请求参数处理
 */
api.interceptors.request.use(
  (config) => {
    // 从本地存储获取 token
    const token = localStorage.getItem('token')
    
    // 如果有 token，添加到请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    console.log('发送请求:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 * 在接收到响应后执行，用于：
 * - 统一错误处理
 * - 响应数据格式化
 * - token 过期处理
 */
api.interceptors.response.use(
  (response) => {
    console.log('收到响应:', response.config.url, response.status)
    
    // 如果响应成功，直接返回数据
    return response.data
  },
  (error) => {
    console.error('响应错误:', error)
    
    // 根据错误状态码进行不同处理
    if (error.response) {
      const { status, data } = error.response
      
      switch (status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('token')
          localStorage.removeItem('userInfo')
          window.location.href = '/login'
          ElMessage.error('登录已过期，请重新登录')
          break
        case 403:
          ElMessage.error('没有权限访问该资源')
          break
        case 404:
          ElMessage.error('请求的资源不存在')
          break
        case 500:
          ElMessage.error('服务器内部错误')
          break
        default:
          ElMessage.error(data?.message || '请求失败')
      }
    } else if (error.request) {
      // 网络错误
      ElMessage.error('网络连接失败，请检查网络设置')
    } else {
      // 其他错误
      ElMessage.error('请求配置错误')
    }
    
    return Promise.reject(error)
  }
)

export default api 