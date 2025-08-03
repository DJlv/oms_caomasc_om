<template>
  <!-- 用户列表页面容器 -->
  <div class="user-list">

    <!-- 搜索和筛选区域 -->

      <el-form :model="searchForm" inline>
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input
            v-model="searchForm.email"
            placeholder="请输入邮箱"
            clearable
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 200px">
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-button type="primary" @click="handleAdd">添加</el-button>
    <!-- 用户数据表格 -->

      <el-table
        :data="userList"
        v-loading="loading"
        style="width: 100%;padding: 10px;"
        height="70vh"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="scope">
            <el-tag :type="getRoleType(scope.row.role)">
              {{ scope.row.role }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="'active'"
              :inactive-value="'inactive'"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="scope">
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

  </div>
</template>

<script setup>
/**
 * 用户列表页面组件
 * 提供用户数据的展示、搜索、分页、增删改查等功能
 */

import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { formatDate } from '@/utils/index.js'

// 获取路由实例
const router = useRouter()

// 加载状态
const loading = ref(false)

// 搜索表单数据
const searchForm = reactive({
  username: '',
  email: '',
  status: ''
})

// 分页数据
const pagination = reactive({
  page: 1,
  size: 10,
  total: 0
})

// 用户列表数据
const userList = ref([
  {
    id: 1,
    username: 'admin',
    email: 'admin@example.com',
    phone: '13800138000',
    role: 'admin',
    status: 'active',
    createTime: '2024-01-01 10:00:00'
  },
  {
    id: 2,
    username: 'user1',
    email: 'user1@example.com',
    phone: '13800138001',
    role: 'user',
    status: 'active',
    createTime: '2024-01-02 11:00:00'
  },
  {
    id: 3,
    username: 'user2',
    email: 'user2@example.com',
    phone: '13800138002',
    role: 'user',
    status: 'inactive',
    createTime: '2024-01-03 12:00:00'
  }
])

// 选中的用户
const selectedUsers = ref([])

/**
 * 获取角色对应的标签类型
 * @param {string} role - 角色名称
 * @returns {string} 标签类型
 */
const getRoleType = (role) => {
  const roleMap = {
    admin: 'danger',
    user: 'primary',
    guest: 'info'
  }
  return roleMap[role] || 'info'
}

/**
 * 处理搜索
 */
const handleSearch = () => {
  pagination.page = 1
  fetchUserList()
}

/**
 * 重置搜索条件
 */
const handleReset = () => {
  Object.assign(searchForm, {
    username: '',
    email: '',
    status: ''
  })
  pagination.page = 1
  fetchUserList()
}

/**
 * 处理添加用户
 */
const handleAdd = () => {
  router.push('/user/add')
}

/**
 * 处理编辑用户
 * @param {Object} user - 用户数据
 */
const handleEdit = (user) => {
  ElMessage.info('编辑功能开发中...')
}

/**
 * 处理删除用户
 * @param {Object} user - 用户数据
 */
const handleDelete = (user) => {
  ElMessageBox.confirm(
    `确定要删除用户 "${user.username}" 吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 调用删除 API
    ElMessage.success('删除成功')
    fetchUserList()
  })
}

/**
 * 处理状态变更
 * @param {Object} user - 用户数据
 */
const handleStatusChange = (user) => {
  // TODO: 调用状态更新 API
  ElMessage.success(`用户 ${user.username} 状态已更新`)
}

/**
 * 处理表格选择变更
 * @param {Array} selection - 选中的行数据
 */
const handleSelectionChange = (selection) => {
  selectedUsers.value = selection
}

/**
 * 处理分页大小变更
 * @param {number} size - 新的分页大小
 */
const handleSizeChange = (size) => {
  pagination.size = size
  pagination.page = 1
  fetchUserList()
}

/**
 * 处理当前页变更
 * @param {number} page - 新的页码
 */
const handleCurrentChange = (page) => {
  pagination.page = page
  fetchUserList()
}

/**
 * 获取用户列表数据
 */
const fetchUserList = () => {
  loading.value = true
  
  // 模拟 API 调用
  setTimeout(() => {
    // TODO: 调用真实的 API
    pagination.total = userList.value.length
    loading.value = false
  }, 500)
}

/**
 * 组件挂载时获取数据
 */
onMounted(() => {
  fetchUserList()
})
</script>

<style scoped>
/* 用户列表页面样式 */
.user-list {
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