<template>
  <!-- 订单详情页面容器 -->
  <div class="order-detail">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <div class="header-left">
        <el-button @click="handleBack" icon="ArrowLeft">返回</el-button>
        <h2>订单详情</h2>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleEdit">编辑订单</el-button>
        <el-button @click="handlePrint">打印订单</el-button>
      </div>
    </div>

    <!-- 订单基本信息 -->
    <el-card class="info-card">
      <template #header>
        <div class="card-header">
          <span>基本信息</span>
        </div>
      </template>
      
      <el-descriptions :column="3" border>
        <el-descriptions-item label="订单号">
          {{ orderDetail.orderNo }}
        </el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(orderDetail.status)">
            {{ getStatusText(orderDetail.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="订单金额">
          <span class="amount">¥{{ formatMoney(orderDetail.amount) }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="客户名称">
          {{ orderDetail.customerName }}
        </el-descriptions-item>
        <el-descriptions-item label="联系电话">
          {{ orderDetail.customerPhone }}
        </el-descriptions-item>
        <el-descriptions-item label="支付方式">
          {{ orderDetail.paymentMethod }}
        </el-descriptions-item>
        <el-descriptions-item label="创建时间">
          {{ formatDate(orderDetail.createTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="更新时间">
          {{ formatDate(orderDetail.updateTime) }}
        </el-descriptions-item>
        <el-descriptions-item label="备注">
          {{ orderDetail.remark || '无' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <!-- 订单商品信息 -->
    <el-card class="items-card">
      <template #header>
        <div class="card-header">
          <span>商品信息</span>
        </div>
      </template>
      
      <el-table :data="orderDetail.items" style="width: 100%" border>
        <el-table-column prop="productName" label="商品名称" />
        <el-table-column prop="sku" label="SKU" width="120" />
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column prop="unitPrice" label="单价" width="120">
          <template #default="scope">
            ¥{{ formatMoney(scope.row.unitPrice) }}
          </template>
        </el-table-column>
        <el-table-column prop="totalPrice" label="小计" width="120">
          <template #default="scope">
            ¥{{ formatMoney(scope.row.totalPrice) }}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 订单状态记录 -->
    <el-card class="status-card">
      <template #header>
        <div class="card-header">
          <span>状态记录</span>
        </div>
      </template>
      
      <el-timeline>
        <el-timeline-item
          v-for="(status, index) in orderDetail.statusHistory"
          :key="index"
          :timestamp="formatDate(status.time)"
          :type="getTimelineItemType(status.status)"
        >
          <h4>{{ getStatusText(status.status) }}</h4>
          <p>{{ status.description }}</p>
          <p class="operator">操作人：{{ status.operator }}</p>
        </el-timeline-item>
      </el-timeline>
    </el-card>
  </div>
</template>

<script setup>
/**
 * 订单详情页面组件
 * 显示订单的详细信息，包括基本信息、商品信息、状态记录等
 */

import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { formatDate, formatMoney } from '@/utils/index.js'

// 获取路由参数和实例
const route = useRoute()
const router = useRouter()

// 订单详情数据
const orderDetail = ref({
  id: 1,
  orderNo: 'ORD202401001',
  customerName: '张三',
  customerPhone: '13800138000',
  amount: 1200.00,
  status: 'completed',
  paymentMethod: '支付宝',
  createTime: '2024-01-01 10:00:00',
  updateTime: '2024-01-01 15:30:00',
  remark: '客户要求尽快发货',
  items: [
    {
      productName: 'iPhone 15 Pro',
      sku: 'IP15P-256G-BLACK',
      quantity: 1,
      unitPrice: 8999.00,
      totalPrice: 8999.00
    },
    {
      productName: 'AirPods Pro',
      sku: 'APP-2ND-GEN',
      quantity: 1,
      unitPrice: 1899.00,
      totalPrice: 1899.00
    }
  ],
  statusHistory: [
    {
      status: 'pending',
      description: '订单已创建，等待处理',
      operator: '系统',
      time: '2024-01-01 10:00:00'
    },
    {
      status: 'processing',
      description: '订单已确认，开始处理',
      operator: '张三',
      time: '2024-01-01 11:30:00'
    },
    {
      status: 'completed',
      description: '订单已完成，商品已发货',
      operator: '李四',
      time: '2024-01-01 15:30:00'
    }
  ]
})

/**
 * 获取状态对应的标签类型
 * @param {string} status - 订单状态
 * @returns {string} 标签类型
 */
const getStatusType = (status) => {
  const statusMap = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success',
    cancelled: 'info'
  }
  return statusMap[status] || 'info'
}

/**
 * 获取状态对应的文本
 * @param {string} status - 订单状态
 * @returns {string} 状态文本
 */
const getStatusText = (status) => {
  const statusMap = {
    pending: '待处理',
    processing: '处理中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

/**
 * 获取时间线项目类型
 * @param {string} status - 订单状态
 * @returns {string} 时间线项目类型
 */
const getTimelineItemType = (status) => {
  const typeMap = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success',
    cancelled: 'danger'
  }
  return typeMap[status] || 'info'
}

/**
 * 处理返回操作
 */
const handleBack = () => {
  router.back()
}

/**
 * 处理编辑订单
 */
const handleEdit = () => {
  ElMessage.info('编辑订单功能开发中...')
}

/**
 * 处理打印订单
 */
const handlePrint = () => {
  ElMessage.info('打印功能开发中...')
}

/**
 * 获取订单详情数据
 */
const fetchOrderDetail = () => {
  const orderId = route.params.id
  console.log('获取订单详情，订单ID:', orderId)
  
  // TODO: 调用真实的 API 获取订单详情
  // 这里使用模拟数据
}

/**
 * 组件挂载时获取数据
 */
onMounted(() => {
  fetchOrderDetail()
})
</script>

<style scoped>
/* 订单详情页面样式 */
.order-detail {
  padding: 0;
}

/* 页面头部样式 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left h2 {
  margin: 0;
}

.header-right {
  display: flex;
  gap: 10px;
}

/* 卡片样式 */
.info-card,
.items-card,
.status-card {
  margin-bottom: 20px;
}

.card-header {
  font-weight: bold;
}

/* 金额样式 */
.amount {
  font-size: 18px;
  font-weight: bold;
  color: #e6a23c;
}

/* 操作人样式 */
.operator {
  font-size: 12px;
  margin-top: 5px;
}

/* 时间线样式 */
.el-timeline {
  padding: 0;
}

.el-timeline-item h4 {
  margin: 0 0 5px 0;
  font-size: 14px;
}

.el-timeline-item p {
  margin: 0;
  font-size: 13px;
}
</style> 