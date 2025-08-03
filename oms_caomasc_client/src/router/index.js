/**
 * Vue Router 路由配置文件
 * 定义应用的所有路由规则、路由守卫等
 */

import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/layout/index.vue'

/**
 * 路由配置数组
 * 每个路由对象包含以下属性：
 * - path: 路由路径
 * - name: 路由名称（用于编程式导航）
 * - component: 路由组件
 * - meta: 路由元信息（标题、图标、权限等）
 * - children: 子路由（嵌套路由）
 */
const routes = [
  // 登录页面路由
  {
    path: '/login',
    name: 'Login',
    // 使用动态导入实现路由懒加载，提高首屏加载速度
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' }
  },
  
  // 主布局路由（包含侧边栏和顶部导航）
  {
    path: '/',
    component: Layout,
    // 重定向到仪表盘页面
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: '仪表盘', icon: 'Odometer' }
      }
    ]
  },
  
  // 用户管理模块路由
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    meta: { title: '用户管理', icon: 'User' },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/views/user/list.vue'),
        meta: { title: '用户列表' }
      },
      {
        path: 'add',
        name: 'UserAdd',
        component: () => import('@/views/user/add.vue'),
        meta: { title: '添加用户' }
      },
      {
        path: 'analysis',
        name: 'UserAnalysis',
        component: () => import('@/views/user/analysis.vue'),
        meta: { title: '用户分析' }
      },
      {
        path: 'export',
        name: 'UserExport',
        component: () => import('@/views/user/export.vue'),
        meta: { title: '导出数据' }
      }
    ]
  },
  
  // 订单管理模块路由
  {
    path: '/order',
    component: Layout,
    redirect: '/order/list',
    meta: { title: '订单管理', icon: 'ShoppingCart' },
    children: [
      {
        path: 'list',
        name: 'OrderList',
        component: () => import('@/views/order/list.vue'),
        meta: { title: '订单列表' }
      },
      {
        path: 'create',
        name: 'OrderCreate',
        component: () => import('@/views/order/create.vue'),
        meta: { title: '创建订单' }
      },
      {
        path: 'analysis',
        name: 'OrderAnalysis',
        component: () => import('@/views/order/analysis.vue'),
        meta: { title: '订单分析' }
      },
      {
        path: 'report',
        name: 'OrderReport',
        component: () => import('@/views/order/report.vue'),
        meta: { title: '订单报表' }
      },
      {
        // 动态路由参数，:id 表示订单ID
        path: 'detail/:id',
        name: 'OrderDetail',
        component: () => import('@/views/order/detail.vue'),
        meta: { title: '订单详情' }
      }
    ]
  },
  
  // 系统管理模块路由
  {
    path: '/system',
    component: Layout,
    redirect: '/system/menu',
    meta: { title: '系统管理', icon: 'Setting' },
    children: [
      {
        path: 'menu',
        name: 'MenuManagement',
        component: () => import('@/views/menu/index.vue'),
        meta: { title: '菜单栏管理' }
      }
    ]
  }
]

/**
 * 创建路由实例
 * createWebHistory: 使用 HTML5 History API，URL 更美观
 * 如果部署到子目录，需要设置 base 参数
 */
const router = createRouter({
  history: createWebHistory(),
  routes
})

/**
 * 全局前置守卫
 * 在路由跳转前执行，用于：
 * - 身份验证
 * - 权限检查
 * - 页面标题设置
 * - 加载状态管理
 */
router.beforeEach((to, from, next) => {
  // 从本地存储获取用户 token
  const token = localStorage.getItem('token')
  
  // 如果是登录页面，直接放行
  if (to.path === '/login') {
    next()
  } else {
    // 如果有 token，说明已登录，允许访问
    if (token) {
      next()
    } else {
      // 没有 token，重定向到登录页
      next('/login')
    }
  }
})

export default router 