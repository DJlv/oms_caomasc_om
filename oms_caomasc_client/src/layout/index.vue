<template>
  <!-- 主布局容器，使用 Element Plus 的 Container 组件 -->
  <el-container class="layout-container">
    <!-- 顶部导航栏 -->
    <el-header class="header">
      <!-- 左侧Logo和主导航 -->
      <div class="header-left">
        <!-- Logo -->
        <div class="logo">
          <h2>OMS系统</h2>
        </div>
        
        <!-- 主导航菜单 -->
        <nav class="main-nav">
          <!-- 动态生成菜单项 -->
          <template v-for="menu in menuData" :key="menu.id">
            <!-- 普通菜单项 -->
            <div v-if="!menu.sections || menu.sections.length === 0" class="nav-item" @click="handleMenuClick(menu)">
              <span>{{ menu.title }}</span>
            </div>
            <!-- 带子菜单的菜单项 -->
            <div v-else class="nav-item dropdown" @mouseenter="handleMenuEnter(menu.id)" @mouseleave="handleMenuLeave(menu.id)" @click="handleMenuClick(menu)">
              <span>{{ menu.title }}</span>
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              <!-- 子菜单 -->
              <div class="dropdown-menu" v-show="activeDropdown === menu.id" @mouseenter="handleSubmenuEnter(menu.id)" @mouseleave="handleSubmenuLeave(menu.id)" :style="{ width: getMenuWidth(menu), minHeight: getMenuHeight(menu), left: getMenuPosition(menu) }">
                <div class="submenu-content">
                  <div v-for="(section, sectionIndex) in menu.sections" :key="sectionIndex" class="submenu-column">
                    <div class="submenu-items">
                      <h4>{{ section.title }}</h4>
                      <div v-for="item in section.items" :key="item.id" class="submenu-item" @click="handleSubmenuClick(item)">
                        <span>{{ item.title }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </nav>
      </div>
      
      <!-- 右侧用户信息区域 -->
      <div class="header-right">
        <h1 style="padding-right:100px;">{{ $route.meta.title }}</h1>
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-avatar size="small" :src="userAvatar" />
            <span>{{ userName }}</span>
            <el-icon><ArrowDown /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="switch-system">切换系统</el-dropdown-item>
              <el-dropdown-item command="profile">个人信息</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>

    <!-- 主内容区域 -->
    <el-main class="main-content">
      <!-- 面包屑导航 -->
      <!-- <div class="breadcrumb-container">
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div> -->
      
      <!-- 路由视图 -->
      <router-view />
    </el-main>
  </el-container>
</template>

<script setup>
/**
 * 主布局组件
 * 包含顶部导航和主内容区域
 * 采用B站风格的顶部导航设计
 */

import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

// 获取路由实例，用于编程式导航
const router = useRouter()

// 系统菜单配置
const systemMenus = {
  oms: [
    {
      id: 'dashboard',
      title: '仪表盘',
      path: '/dashboard',
      children: null
    },
    {
      id: 'user',
      title: '用户管理',
      path: null,
      sections: [
        {
          title: '用户基础操作',
          items: [
            { id: 'user-list', title: '用户列表', path: '/user/list' },
            { id: 'user-add', title: '添加用户', path: '/user/add' },
            { id: 'user-edit', title: '编辑用户', path: '/user/edit' },
            { id: 'user-delete', title: '删除用户', path: '/user/delete' },
            { id: 'user-import', title: '批量导入', path: '/user/import' },
            { id: 'user-export', title: '导出数据', path: '/user/export' }
          ]
        },
        {
          title: '用户权限管理',
          items: [
            { id: 'user-role', title: '角色管理', path: '/user/role' },
            { id: 'user-permission', title: '权限设置', path: '/user/permission' },
            { id: 'user-group', title: '用户分组', path: '/user/group' },
            { id: 'user-department', title: '部门管理', path: '/user/department' }
          ]
        },
        {
          title: '用户数据分析',
          items: [
            { id: 'user-analysis', title: '用户分析', path: '/user/analysis' },
            { id: 'user-report', title: '用户报表', path: '/user/report' },
            { id: 'user-statistics', title: '用户统计', path: '/user/statistics' },
            { id: 'user-behavior', title: '行为分析', path: '/user/behavior' }
          ]
        }
      ]
    },
    {
      id: 'order',
      title: '订单管理',
      path: null,
      sections: [
        {
          title: '订单基础操作',
          items: [
            { id: 'order-list', title: '订单列表', path: '/order/list' },
            { id: 'order-create', title: '创建订单', path: '/order/create' },
            { id: 'order-edit', title: '编辑订单', path: '/order/edit' },
            { id: 'order-cancel', title: '取消订单', path: '/order/cancel' },
            { id: 'order-refund', title: '退款处理', path: '/order/refund' },
            { id: 'order-batch', title: '批量操作', path: '/order/batch' }
          ]
        },
        {
          title: '订单物流管理',
          items: [
            { id: 'order-shipping', title: '发货管理', path: '/order/shipping' },
            { id: 'order-tracking', title: '物流跟踪', path: '/order/tracking' },
            { id: 'order-delivery', title: '配送管理', path: '/order/delivery' },
            { id: 'order-warehouse', title: '仓库管理', path: '/order/warehouse' }
          ]
        },
        {
          title: '订单数据分析',
          items: [
            { id: 'order-analysis', title: '订单分析', path: '/order/analysis' },
            { id: 'order-report', title: '订单报表', path: '/order/report' },
            { id: 'order-trend', title: '趋势分析', path: '/order/trend' },
            { id: 'order-performance', title: '业绩统计', path: '/order/performance' }
          ]
        }
      ]
    },
    {
      id: 'product',
      title: '商品管理',
      path: null,
      sections: [
        {
          title: '商品基础管理',
          items: [
            { id: 'product-list', title: '商品列表', path: '/product/list' },
            { id: 'product-add', title: '添加商品', path: '/product/add' },
            { id: 'product-edit', title: '编辑商品', path: '/product/edit' },
            { id: 'product-category', title: '分类管理', path: '/product/category' },
            { id: 'product-brand', title: '品牌管理', path: '/product/brand' },
            { id: 'product-attribute', title: '属性管理', path: '/product/attribute' }
          ]
        },
        {
          title: '商品库存管理',
          items: [
            { id: 'product-stock', title: '库存管理', path: '/product/stock' },
            { id: 'product-inventory', title: '库存盘点', path: '/product/inventory' },
            { id: 'product-supplier', title: '供应商管理', path: '/product/supplier' },
            { id: 'product-purchase', title: '采购管理', path: '/product/purchase' }
          ]
        },
        {
          title: '商品营销管理',
          items: [
            { id: 'product-promotion', title: '促销管理', path: '/product/promotion' },
            { id: 'product-discount', title: '折扣设置', path: '/product/discount' },
            { id: 'product-seo', title: 'SEO优化', path: '/product/seo' },
            { id: 'product-review', title: '评价管理', path: '/product/review' }
          ]
        }
      ]
    },
    {
      id: 'finance',
      title: '财务管理',
      path: null,
      sections: [
        {
          title: '财务基础操作',
          items: [
            { id: 'finance-income', title: '收入管理', path: '/finance/income' },
            { id: 'finance-expense', title: '支出管理', path: '/finance/expense' },
            { id: 'finance-invoice', title: '发票管理', path: '/finance/invoice' },
            { id: 'finance-tax', title: '税务管理', path: '/finance/tax' }
          ]
        },
        {
          title: '财务报表分析',
          items: [
            { id: 'finance-report', title: '财务报表', path: '/finance/report' },
            { id: 'finance-analysis', title: '财务分析', path: '/finance/analysis' },
            { id: 'finance-budget', title: '预算管理', path: '/finance/budget' },
            { id: 'finance-audit', title: '审计管理', path: '/finance/audit' }
          ]
        }
      ]
    }
  ],
  client: [
    {
      id: 'dashboard',
      title: '仪表盘',
      path: '/dashboard',
      children: null
    },
    {
      id: 'user',
      title: '用户中心',
      path: null,
      sections: [
        {
          title: '个人信息',
          items: [
            { id: 'user-profile', title: '个人资料', path: '/user/profile' },
            { id: 'user-settings', title: '账户设置', path: '/user/settings' },
            { id: 'user-security', title: '安全设置', path: '/user/security' }
          ]
        },
        {
          title: '订单管理',
          items: [
            { id: 'order-my', title: '我的订单', path: '/order/my' },
            { id: 'order-favorite', title: '收藏夹', path: '/order/favorite' },
            { id: 'order-history', title: '历史记录', path: '/order/history' }
          ]
        }
      ]
    },
    {
      id: 'product',
      title: '商品浏览',
      path: null,
      sections: [
        {
          title: '商品分类',
          items: [
            { id: 'product-category', title: '全部分类', path: '/product/category' },
            { id: 'product-search', title: '搜索商品', path: '/product/search' },
            { id: 'product-hot', title: '热门商品', path: '/product/hot' }
          ]
        },
        {
          title: '购物功能',
          items: [
            { id: 'cart', title: '购物车', path: '/cart' },
            { id: 'wishlist', title: '愿望清单', path: '/wishlist' },
            { id: 'compare', title: '商品对比', path: '/compare' }
          ]
        }
      ]
    }
  ],
  admin: [
    {
      id: 'dashboard',
      title: '管理仪表盘',
      path: '/dashboard',
      children: null
    },
    {
      id: 'system',
      title: '系统管理',
      path: null,
      sections: [
        {
          title: '系统配置',
          items: [
            { id: 'system-menu', title: '菜单栏管理', path: '/system/menu' },
            { id: 'system-role', title: '角色管理', path: '/system/role' },
            { id: 'system-permission', title: '权限管理', path: '/system/permission' },
            { id: 'system-config', title: '系统配置', path: '/system/config' }
          ]
        },
        {
          title: '系统监控',
          items: [
            { id: 'system-log', title: '操作日志', path: '/system/log' },
            { id: 'system-monitor', title: '系统监控', path: '/system/monitor' },
            { id: 'system-backup', title: '数据备份', path: '/system/backup' },
            { id: 'system-restore', title: '数据恢复', path: '/system/restore' }
          ]
        }
      ]
    },
    {
      id: 'user',
      title: '用户管理',
      path: null,
      sections: [
        {
          title: '用户管理',
          items: [
            { id: 'user-list', title: '用户列表', path: '/user/list' },
            { id: 'user-add', title: '添加用户', path: '/user/add' },
            { id: 'user-role', title: '角色管理', path: '/user/role' },
            { id: 'user-permission', title: '权限设置', path: '/user/permission' }
          ]
        }
      ]
    }
  ],
  api: [
    {
      id: 'api-docs',
      title: 'API文档',
      path: '/api/docs',
      children: null
    },
    {
      id: 'api-test',
      title: '接口测试',
      path: null,
      sections: [
        {
          title: '接口管理',
          items: [
            { id: 'api-list', title: '接口列表', path: '/api/list' },
            { id: 'api-test', title: '接口测试', path: '/api/test' },
            { id: 'api-mock', title: 'Mock数据', path: '/api/mock' }
          ]
        }
      ]
    }
  ],
  gateway: [
    {
      id: 'gateway-config',
      title: '网关配置',
      path: '/gateway/config',
      children: null
    },
    {
      id: 'gateway-route',
      title: '路由管理',
      path: null,
      sections: [
        {
          title: '路由配置',
          items: [
            { id: 'route-list', title: '路由列表', path: '/gateway/route/list' },
            { id: 'route-add', title: '添加路由', path: '/gateway/route/add' },
            { id: 'route-edit', title: '编辑路由', path: '/gateway/route/edit' }
          ]
        }
      ]
    }
  ],
  auth: [
    {
      id: 'auth-users',
      title: '用户认证',
      path: '/auth/users',
      children: null
    },
    {
      id: 'auth-permission',
      title: '权限管理',
      path: null,
      sections: [
        {
          title: '认证管理',
          items: [
            { id: 'auth-login', title: '登录管理', path: '/auth/login' },
            { id: 'auth-logout', title: '登出管理', path: '/auth/logout' },
            { id: 'auth-token', title: 'Token管理', path: '/auth/token' }
          ]
        }
      ]
    }
  ]
}

// 动态菜单数据
const menuData = ref(systemMenus.oms) // 默认显示OMS系统菜单

/**
 * 根据系统类型更新菜单
 * @param {string} systemType - 系统类型
 */
const updateMenuBySystem = (systemType) => {
  if (systemMenus[systemType]) {
    // 检查当前路由，如果是首页则只显示仪表盘
    const currentPath = router.currentRoute.value.path
    if (currentPath === '/dashboard') {
      menuData.value = [
        {
          id: 'dashboard',
          title: '仪表盘',
          path: '/dashboard',
          children: null
        }
      ]
      console.log('首页只显示仪表盘菜单')
    } else {
      menuData.value = systemMenus[systemType]
      console.log(`菜单已更新为: ${systemType} 系统`)
    }
  } else {
    console.warn(`未找到系统类型: ${systemType} 的菜单配置`)
  }
}

/**
 * 初始化菜单系统
 */
const initMenuSystem = () => {
  // 从本地存储获取当前系统
  const currentSystem = localStorage.getItem('currentSystem')
  
  // 检查当前路由
  const currentPath = router.currentRoute.value.path
  
  // 如果是首页，只显示仪表盘菜单
  if (currentPath === '/dashboard') {
    menuData.value = [
      {
        id: 'dashboard',
        title: '仪表盘',
        path: '/dashboard',
        children: null
      }
    ]
    console.log('首页只显示仪表盘菜单')
  } else {
    // 其他页面根据系统显示对应菜单
    if (currentSystem && systemMenus[currentSystem]) {
      updateMenuBySystem(currentSystem)
    } else {
      // 默认使用OMS系统
      updateMenuBySystem('oms')
    }
  }
}

// 用户信息响应式数据
const userName = ref('管理员')
const userAvatar = ref('')

// 当前激活的下拉菜单
const activeDropdown = ref('')
// 鼠标是否在菜单区域内
const isMouseInMenu = ref(false)

// 初始化菜单系统
initMenuSystem()

// 监听路由变化，动态更新菜单
watch(
  () => router.currentRoute.value.path,
  (newPath) => {
    console.log('路由变化:', newPath)
    if (newPath === '/dashboard') {
      // 首页只显示仪表盘菜单
      menuData.value = [
        {
          id: 'dashboard',
          title: '仪表盘',
          path: '/dashboard',
          children: null
        }
      ]
      console.log('首页只显示仪表盘菜单')
    } else {
      // 其他页面根据系统显示对应菜单
      const currentSystem = localStorage.getItem('currentSystem')
      if (currentSystem && systemMenus[currentSystem]) {
        updateMenuBySystem(currentSystem)
      } else {
        updateMenuBySystem('oms')
      }
    }
  },
  { immediate: true }
)

/**
 * 路由跳转方法
 * @param {string} path - 路由路径
 */
const pushRouter = (path) => {
  console.log('Navigating to:', path)
  try {
    // 检查路径是否有效
    if (path && path.startsWith('/')) {
      router.push(path).catch(err => {
        console.error('Navigation error:', err)
        // 如果路由不存在，跳转到首页
        router.push('/dashboard')
      })
    } else {
      console.warn('Invalid path:', path)
      router.push('/dashboard')
    }
    activeDropdown.value = '' // 关闭下拉菜单
  } catch (error) {
    console.error('Router push error:', error)
    // 发生错误时跳转到首页
    router.push('/dashboard')
  }
}

/**
 * 切换下拉菜单
 * @param {string} dropdown - 下拉菜单名称
 */
const toggleDropdown = (dropdown) => {
  console.log('Toggle dropdown:', dropdown)
  if (activeDropdown.value === dropdown) {
    activeDropdown.value = ''
  } else {
    activeDropdown.value = dropdown
  }
}

/**
 * 处理菜单项鼠标进入
 * @param {string} dropdown - 下拉菜单名称
 */
const handleMenuEnter = (dropdown) => {
  console.log('Menu enter:', dropdown)
  isMouseInMenu.value = true
  activeDropdown.value = dropdown
  
  // 调试动态尺寸
  const menu = menuData.value.find(m => m.id === dropdown)
  if (menu) {
    console.log('Menu width:', getMenuWidth(menu))
    console.log('Menu height:', getMenuHeight(menu))
  }
}

/**
 * 处理菜单项鼠标离开
 * @param {string} dropdown - 下拉菜单名称
 */
const handleMenuLeave = (dropdown) => {
  console.log('Menu leave:', dropdown)
  isMouseInMenu.value = false
  // 延迟隐藏，给用户时间移动到子菜单
  setTimeout(() => {
    if (!isMouseInMenu.value && activeDropdown.value === dropdown) {
      activeDropdown.value = ''
    }
  }, 300)
}

/**
 * 处理子菜单鼠标进入
 * @param {string} dropdown - 下拉菜单名称
 */
const handleSubmenuEnter = (dropdown) => {
  console.log('Submenu enter:', dropdown)
  isMouseInMenu.value = true
  activeDropdown.value = dropdown
}

/**
 * 处理子菜单鼠标离开
 * @param {string} dropdown - 下拉菜单名称
 */
const handleSubmenuLeave = (dropdown) => {
  console.log('Submenu leave:', dropdown)
  isMouseInMenu.value = false
  // 延迟隐藏
  setTimeout(() => {
    if (!isMouseInMenu.value && activeDropdown.value === dropdown) {
      activeDropdown.value = ''
    }
  }, 300)
}

/**
 * 显示下拉菜单（保留原方法以备后用）
 * @param {string} dropdown - 下拉菜单名称
 */
const showDropdown = (dropdown) => {
  console.log('Show dropdown:', dropdown)
  activeDropdown.value = dropdown
  console.log('Active dropdown after show:', activeDropdown.value)
}

/**
 * 隐藏下拉菜单（保留原方法以备后用）
 * @param {string} dropdown - 下拉菜单名称
 */
const hideDropdown = (dropdown) => {
  console.log('Hide dropdown:', dropdown)
  // 延迟隐藏，给用户时间移动到子菜单
  setTimeout(() => {
    if (activeDropdown.value === dropdown) {
      activeDropdown.value = ''
    }
  }, 500) // 增加延迟时间到500ms
}



/**
 * 处理菜单点击事件
 * @param {object} menu - 菜单对象
 */
const handleMenuClick = (menu) => {
  console.log('Menu clicked:', menu)
  console.log('Menu sections:', menu.sections)
  console.log('Menu path:', menu.path)
  
  // 如果有子菜单，不进行路由跳转，只显示子菜单
  if (menu.sections && menu.sections.length > 0) {
    console.log('Menu has submenu, not navigating')
    return
  }
  // 如果没有子菜单且有路径，则进行路由跳转
  if (menu.path) {
    console.log('Navigating to path:', menu.path)
    pushRouter(menu.path)
  } else {
    console.warn('Menu has no path and no submenu')
  }
}

/**
 * 处理子菜单项点击事件
 * @param {object} item - 子菜单项对象
 */
const handleSubmenuClick = (item) => {
  console.log('Submenu item clicked:', item)
  if (item.path) {
    console.log('Navigating to submenu path:', item.path)
    pushRouter(item.path)
  } else {
    console.warn('Submenu item has no path:', item)
  }
}

/**
 * 计算菜单的宽度
 * @param {object} menu - 菜单对象
 * @returns {string} 宽度值
 */
const getMenuWidth = (menu) => {
  if (!menu.sections || menu.sections.length === 0) return 'auto'
  
  const sectionCount = menu.sections.length
  
  // 动态计算每个分组的最佳宽度
  let totalItems = 0
  let maxItemsInSection = 0
  let maxTitleLength = 0
  let sectionTitleLengths = []
  
  // 分析菜单数据
  menu.sections.forEach(section => {
    const itemCount = section.items ? section.items.length : 0
    totalItems += itemCount
    maxItemsInSection = Math.max(maxItemsInSection, itemCount)
    
    let sectionMaxLength = 0
    // 计算每个分组的最长标题长度
    if (section.items) {
      section.items.forEach(item => {
        sectionMaxLength = Math.max(sectionMaxLength, item.title.length)
        maxTitleLength = Math.max(maxTitleLength, item.title.length)
      })
    }
    sectionTitleLengths.push(sectionMaxLength)
  })
  
  // 根据内容动态计算基础宽度
  // 每个字符大约8px宽度，加上图标和间距
  const charWidth = 8
  const iconWidth = 20
  const itemPadding = 16
  const sectionPadding = 20
  
  // 计算每个分组的最佳宽度
  const sectionWidths = sectionTitleLengths.map(length => {
    // 限制最大字符长度，避免过长的标题影响布局
    const maxCharLength = 20
    const effectiveLength = Math.min(length, maxCharLength)
    return Math.max(160, effectiveLength * charWidth + iconWidth + itemPadding + sectionPadding)
  })
  
  // 计算总宽度 - 确保每列宽度相同
  const gap = 0 // 移除列间距，使用边框分隔
  const padding = 40 // 增加左右内边距
  const columnWidth = Math.max(180, Math.max(...sectionWidths)) // 使用最大宽度作为统一列宽
  let totalWidth = sectionCount * columnWidth + (sectionCount - 1) * gap + padding
  
  // 设置合理的宽度限制
  const minWidth = Math.max(400, sectionCount * 180)
  const maxWidth = Math.min(1000, sectionCount * 220)
  
  // 确保宽度不会超出屏幕边界
  const screenWidth = window.innerWidth || 1200
  const maxAllowedWidth = Math.min(maxWidth, screenWidth - 80) // 留出40px边距
  
  totalWidth = Math.max(minWidth, Math.min(maxAllowedWidth, totalWidth))
  
  console.log(`Menu: ${menu.title}, Sections: ${sectionCount}, Items: ${totalItems}, Width: ${totalWidth}px, Section widths:`, sectionWidths)
  
  return `${totalWidth}px`
}

/**
 * 计算菜单的高度
 * @param {object} menu - 菜单对象
 * @returns {string} 高度值
 */
const getMenuHeight = (menu) => {
  if (!menu.sections || menu.sections.length === 0) return 'auto'
  
  const maxItemsInSection = Math.max(...menu.sections.map(section => 
    section.items ? section.items.length : 0
  ))
  
  // 根据最大项目数计算高度
  const itemHeight = 32 // 每个项目的高度
  const padding = 40 // 上下内边距
  const sectionGap = 20 // 分组间距
  const height = maxItemsInSection * itemHeight + padding + sectionGap
  
  return `${Math.max(height, 120)}px` // 最小高度120px
}

/**
 * 计算菜单的位置
 * @param {object} menu - 菜单对象
 * @returns {string} 位置值
 */
const getMenuPosition = (menu) => {
  // 默认位置
  return '0px'
}

/**
 * 处理用户下拉菜单命令
 * @param {string} command - 菜单命令
 */
const handleCommand = (command) => {
  if (command === 'logout') {
    // 退出登录处理
    ElMessageBox.confirm(
      '确定要退出登录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // 清除本地存储的用户信息
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
      localStorage.removeItem('currentSystem')
      localStorage.removeItem('systemInfo')
      
      // 跳转到登录页
      router.push('/login')
      ElMessage.success('已退出登录')
    })
  } else if (command === 'profile') {
    // 个人信息功能（待开发）
    ElMessage.info('个人信息功能开发中...')
  } else if (command === 'switch-system') {
    // 切换系统
    router.push('/dashboard')
  }
}
</script>

<style scoped>
/* 布局容器样式 */
.layout-container {
  height: 100vh;
  background-color: #f5f5f5;
}

/* 顶部导航栏样式 - 参考B站风格 */
.header {
  background-color: #ffffff;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 60px;
}

/* 左侧区域样式 */
.header-left {
  display: flex;
  align-items: center;
  gap: 30px;
}

/* Logo 样式 */
.logo h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333333;
}

/* 主导航菜单样式 */
.main-nav {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* 导航项样式 */
.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  font-size: 14px;
  color: #333333;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  background-color: transparent;
}

.nav-item:hover {
  background-color: #f0f0f0;
  color: #409EFF;
}

.nav-item .el-icon {
  font-size: 16px;
}

/* 下拉菜单容器 */
.dropdown {
  position: relative;
  display: inline-block;
  /* 确保下拉菜单容器有足够的空间 */
  z-index: 1001;
}

/* 下拉菜单样式 */
.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  max-width: 90vw;
  margin-top: 5px;
  opacity: 1;
  visibility: visible;
  transition: all 0.3s ease;
  /* 确保菜单在鼠标移动时有足够的时间 */
  pointer-events: auto;
  /* 防止内容溢出 */
  overflow: hidden;
  /* 确保菜单不会超出屏幕边界 */
  max-width: calc(100vw - 40px);
}

/* 子菜单内容样式 */
.submenu-content {
  display: flex;
  padding: 20px;
  gap: 0;
  justify-content: space-between;
  flex-wrap: nowrap;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
}

.submenu-column {
  flex: 1;
  min-width: 160px;
  max-width: none;
  padding: 0 15px;
  box-sizing: border-box;
  text-align: left;
}

.submenu-column:not(:last-child) {
  border-right: 1px solid #f0f0f0;
  margin-right: 0;
}

.submenu-section {
  margin-bottom: 20px;
}

.submenu-section:last-child {
  margin-bottom: 0;
}

.submenu-section h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 100;
  color: #666666;
  /* text-transform: uppercase; */
  letter-spacing: 0.5px;
}

.submenu-items {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.submenu-items h4 {
  margin: 0 0 12px 0;
  font-size: 13px;
  font-weight: 600;
  color: #666666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 8px 8px 8px;
  text-align: left;
}

/* 子菜单项样式 */
.submenu-item {
  display: flex;
  text-align: center;
  align-items: center;
  height: 32px;
  font-size: 14px;
  color: #333333;
  background-color: transparent;
  border: none;
  border-radius: 6px;
  padding: 0 8px;
  margin: 0;
  transition: all 0.3s ease;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex-shrink: 0;
  width: 100%;
  box-sizing: border-box;
  justify-content: flex-start;
}

.submenu-item:hover {
  background-color: #f0f0f0;
  color: #409EFF;
  transform: translateX(4px);
}

.submenu-item span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
  flex: 1;
  text-align: left;
  padding-left: 0;
}

.submenu-item .el-icon {
  font-size: 16px;
  width: 16px;
  height: 16px;
}

/* 右侧区域样式 */
.header-right {
  display: flex;
  align-items: center;
}

/* 用户信息样式 */
.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  color: #333333;
}

.user-info:hover {
  background-color: #f0f0f0;
  color: #409EFF;
}

.user-info span {
  margin: 0 8px;
  font-size: 14px;
  font-weight: 500;
}

/* 主内容区域样式 */
.main-content {
  background-color: #ffffff;
  padding: 20px;
  height: calc(100vh - 60px);
  overflow-y: auto;
}

/* 面包屑容器样式 */
.breadcrumb-container {
  background-color: #ffffff;
  padding: 15px 20px;
  border-radius: 6px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 面包屑样式 */
:deep(.el-breadcrumb__item) {
  font-size: 14px;
}

:deep(.el-breadcrumb__inner) {
  color: #666666;
  font-weight: 400;
}

:deep(.el-breadcrumb__inner:hover) {
  color: #409EFF;
}

/* 下拉菜单样式覆盖 */
:deep(.el-dropdown-menu) {
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

:deep(.el-dropdown-menu__item) {
  color: #333333;
  font-size: 14px;
  padding: 10px 16px;
  transition: all 0.3s ease;
}

:deep(.el-dropdown-menu__item:hover) {
  background-color: #f0f0f0;
  color: #409EFF;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header {
    padding: 0 15px;
  }
  
  .header-left {
    gap: 15px;
  }
  
  .logo h2 {
    font-size: 18px;
  }
  
  .nav-item {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .dropdown-menu {
    min-width: 300px;
    max-width: calc(100vw - 20px);
    left: 50%;
    transform: translateX(-50%);
  }
  
  .submenu-content {
    padding: 15px;
    flex-direction: column;
    gap: 15px;
  }
  
  .submenu-column {
    padding: 0 10px;
    max-width: none;
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
    margin-right: 0;
    margin-bottom: 15px;
    text-align: left;
  }
  
  .submenu-column:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
  
  .user-info span {
    display: none;
  }
}

@media (max-width: 480px) {
  .header-left {
    gap: 10px;
  }
  
  .logo h2 {
    font-size: 16px;
  }
  
  .nav-item {
    padding: 4px 8px;
    font-size: 12px;
  }
  
  .nav-item .el-icon {
    font-size: 14px;
  }
  
  .dropdown-menu {
    min-width: 250px;
    max-width: calc(100vw - 10px);
    left: 50%;
    transform: translateX(-50%);
  }
  
  .submenu-content {
    padding: 10px;
    flex-direction: column;
    gap: 10px;
  }
  
  .submenu-column {
    padding: 0 5px;
    max-width: none;
    border-right: none;
    border-bottom: 1px solid #f0f0f0;
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .submenu-column:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
}
</style> 