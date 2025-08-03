<template>
  <!-- 仪表盘页面容器 -->
  <div class="dashboard">
    <!-- 系统选择区域 -->
    <div class="system-selection">
      <el-row :gutter="20" class="system-cards">
        <el-col 
          v-for="system in systemList" 
          :key="system.id" 
          :xs="24" 
          :sm="12" 
          :md="8" 
          :lg="6"
        >
          <div class="system-card" @click="handleSystemSelect(system)">
            <div class="system-icon" :class="system.iconClass">
              <span class="icon-text">{{ system.title.charAt(0) }}</span>
            </div>
            <div class="system-info">
              <h3 class="system-title">{{ system.title }}</h3>
              <p class="system-desc">{{ system.description }}</p>
              <div class="system-status">
                <el-tag :type="system.status === 'online' ? 'success' : 'danger'" size="small">
                  {{ system.status === 'online' ? '在线' : '离线' }}
                </el-tag>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 获取路由实例
const router = useRouter()

/**
 * 系统列表数据
 * 包含所有可用的系统模块
 */
const systemList = ref([
  {
    id: 'oms',
    title: 'OMS系统',
    description: '订单管理系统主界面',
    icon: 'Odometer',
    iconClass: 'oms-icon',
    status: 'online',
    path: '/dashboard',
    menuKey: 'oms'
  },
  {
    id: 'client',
    title: '用户端',
    description: '面向用户的业务界面',
    icon: 'User',
    iconClass: 'client-icon',
    status: 'online',
    path: '/user/list',
    menuKey: 'client'
  },
  {
    id: 'admin',
    title: '管理端',
    description: '系统管理和配置界面',
    icon: 'Setting',
    iconClass: 'admin-icon',
    status: 'online',
    path: '/system/menu',
    menuKey: 'admin'
  },
  {
    id: 'api',
    title: 'API服务',
    description: '后端API接口管理',
    icon: 'Connection',
    iconClass: 'api-icon',
    status: 'online',
    path: '/api/docs',
    menuKey: 'api'
  },
  {
    id: 'gateway',
    title: '网关服务',
    description: 'API网关和路由管理',
    icon: 'Share',
    iconClass: 'gateway-icon',
    status: 'online',
    path: '/gateway/config',
    menuKey: 'gateway'
  },
  {
    id: 'auth',
    title: '认证服务',
    description: '用户认证和权限管理',
    icon: 'Lock',
    iconClass: 'auth-icon',
    status: 'online',
    path: '/auth/users',
    menuKey: 'auth'
  }
])

/**
 * 统计数据
 * 包含用户数、订单数、收入、服务数等关键指标
 */
const stats = ref({
  userCount: 1250,      // 用户总数
  orderCount: 856,      // 订单总数
  revenue: '125,680',   // 总收入（格式化显示）
  serviceCount: 5       // 微服务数量
})

/**
 * 处理系统选择
 * @param {object} system - 选中的系统对象
 */
const handleSystemSelect = async (system) => {
  try {
    // 检查系统状态
    if (system.status !== 'online') {
      ElMessage.warning(`${system.title}当前不可用`)
      return
    }
    
    // 保存当前选择的系统到本地存储
    localStorage.setItem('currentSystem', system.menuKey)
    localStorage.setItem('systemInfo', JSON.stringify(system))
    
    // 显示选择成功消息
    ElMessage.success(`已切换到${system.title}`)
    
    // 跳转到对应的系统页面
    router.push(system.path)
    
  } catch (error) {
    ElMessage.error('系统切换失败')
    console.error('System selection error:', error)
  }
}

/**
 * 组件挂载后的生命周期钩子
 * 在这里可以调用 API 获取真实数据
 */
onMounted(() => {
  console.log('仪表盘加载完成')
})
</script>

<style scoped>
/* 仪表盘容器样式 */
.dashboard {
  padding: 0;
}

/* 系统选择区域样式 */
.system-selection {
  margin-bottom: 30px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.section-desc {
  color: #666;
  font-size: 14px;
  margin: 0 0 20px 0;
}

.system-cards {
  margin-bottom: 20px;
}

/* 系统卡片样式 */
.system-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.system-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: #409EFF;
}

.system-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  font-size: 24px;
  color: white;
}

.icon-text {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

/* 系统图标样式 */
.oms-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.client-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.admin-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.api-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

.gateway-icon {
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
}

.auth-icon {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
}

.system-info {
  text-align: center;
}

.system-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.system-desc {
  font-size: 13px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.system-status {
  display: flex;
  justify-content: center;
}

/* 统计卡片行样式 */
.stats-row {
  margin-bottom: 20px;
}

/* 统计卡片样式 */
.stats-card {
  height: 120px;
}

/* 统计内容布局样式 */
.stats-content {
  display: flex;
  align-items: center;
  height: 100%;
}

/* 统计图标样式 */
.stats-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  font-size: 24px;
  color: white;
}

/* 用户图标样式 - 紫色渐变 */
.user-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 订单图标样式 - 粉色渐变 */
.order-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

/* 收入图标样式 - 蓝色渐变 */
.revenue-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

/* 服务图标样式 - 绿色渐变 */
.service-icon {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
}

/* 统计信息样式 */
.stats-info {
  flex: 1;
}

/* 统计数字样式 */
.stats-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 5px;
}

/* 统计标签样式 */
.stats-label {
  font-size: 13px;
}
</style> 