<template>
  <!-- 订单列表页面容器 -->
  <div class="order-list">
    <!-- 页面标题和操作按钮 -->
    <div class="page-header">
      <h2>订单列表</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>
        新建订单
      </el-button>
    </div>

    <!-- 搜索和筛选区域 -->
    <el-card class="search-card">
      <el-form :model="searchForm" inline>
        <el-form-item label="订单号">
          <el-input
            v-model="searchForm.orderNo"
            placeholder="请输入订单号"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input
            v-model="searchForm.customerName"
            placeholder="请输入客户名称"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 订单数据表格 -->
    <el-card>
      <el-table
        :data="orderList"
        v-loading="loading"
        style="width: 100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="orderNo" label="订单号" width="150" />
        <el-table-column prop="customerName" label="客户名称" width="120" />
        <el-table-column prop="amount" label="订单金额" width="120">
          <template #default="scope">
            ¥{{ formatMoney(scope.row.amount) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusType(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式" width="100" />
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="remake" label="备注" >
          <template #default="scope">
            {{ formatDate(scope.row.remake) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页组件 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
/**
 * 订单列表页面组件
 * 提供订单数据的展示、搜索、分页、增删改查等功能
 */

import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate, formatMoney } from '@/utils/index.js'

// 获取路由实例
const router = useRouter()

// 加载状态
const loading = ref(false)

// 搜索表单数据
const searchForm = reactive({
  orderNo: '',
  customerName: '',
  status: '',
  dateRange: []
})

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 订单列表数据
const orderList = ref([
  {
    id: 1,
    orderNo: 'ORD202401001',
    customerName: '张三',
    amount: 1200.00,
    status: 'completed',
    paymentMethod: '支付宝',
    createTime: '2024-01-01 10:00:00',
    updateTime: '2024-01-01 15:30:00'
  },
  {
    id: 2,
    orderNo: 'ORD202401002',
    customerName: '李四',
    amount: 800.50,
    status: 'processing',
    paymentMethod: '微信支付',
    createTime: '2024-01-02 11:00:00',
    updateTime: '2024-01-02 14:20:00'
  },
  {
    id: 3,
    orderNo: 'ORD202401003',
    customerName: '王五',
    amount: 1500.00,
    status: 'pending',
    paymentMethod: '银行卡',
    createTime: '2024-01-03 12:00:00',
    updateTime: '2024-01-03 12:00:00'
  },
  {
    id: 4,
    orderNo: 'ORD202401004',
    customerName: '赵六',
    amount: 600.00,
    status: 'cancelled',
    paymentMethod: '支付宝',
    createTime: '2024-01-04 09:00:00',
    updateTime: '2024-01-04 10:30:00'
  }
])

// 选中的订单
const selectedOrders = ref([])

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
 * 处理搜索
 */
const handleSearch = () => {
  pagination.page = 1
  fetchOrderList()
}

/**
 * 重置搜索条件
 */
const handleReset = () => {
  Object.assign(searchForm, {
    orderNo: '',
    customerName: '',
    status: '',
    dateRange: []
  })
  pagination.page = 1
  fetchOrderList()
}

/**
 * 处理新建订单
 */
const handleAdd = () => {
  ElMessage.info('新建订单功能开发中...')
}

/**
 * 处理查看订单详情
 * @param {Object} order - 订单数据
 */
const handleView = (order) => {
  router.push(`/order/detail/${order.id}`)
}

/**
 * 处理编辑订单
 * @param {Object} order - 订单数据
 */
const handleEdit = (order) => {
  ElMessage.info('编辑订单功能开发中...')
}

/**
 * 处理删除订单
 * @param {Object} order - 订单数据
 */
const handleDelete = (order) => {
  ElMessageBox.confirm(
    `确定要删除订单 "${order.orderNo}" 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除 API
    ElMessage.success('删除成功')
    fetchOrderList()
  })
}

/**
 * 处理表格选择变更
 * @param {Array} selection - 选中的行数据
 */
const handleSelectionChange = (selection) => {
  selectedOrders.value = selection
}

/**
 * 处理分页大小变更
 * @param {number} size - 新的分页大小
 */
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.page = 1
  fetchOrderList()
}

/**
 * 处理当前页变更
 * @param {number} page - 新的页码
 */
const handleCurrentChange = (page) => {
  pagination.page = page
  fetchOrderList()
}

/**
 * 获取订单列表数据
 */
const fetchOrderList = () => {
  loading.value = true
  
  // 模拟 API 调用
  setTimeout(() => {
    // TODO: 调用真实的 API
    pagination.total = orderList.value.length
    loading.value = false
  }, 500)
}

/**
 * 组件挂载时获取数据
 */
onMounted(() => {
  fetchOrderList()
})
</script>

<style scoped>
/* 订单列表页面样式 */
.order-list {
  padding: 0;
}

/* 页面头部样式 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
}

/* 搜索卡片样式 */
.search-card {
  margin-bottom: 20px;
}

/* 分页包装器样式 */
.pagination-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style> 