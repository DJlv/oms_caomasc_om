<template>
  <!-- 添加用户页面容器 -->
  <div class="add-user-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>添加用户</h2>
      <p>创建新的系统用户账户</p>
    </div>

    <!-- 用户表单 -->
    <el-form
      ref="userFormRef"
      :model="userForm"
      :rules="userRules"
      label-width="100px"
      class="user-form"
      @submit.prevent="handleSubmit"
    >
      <!-- 基本信息分组 -->
      <div class="form-section">
        <div class="form-section-title">基本信息</div>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="用户名" prop="username" required>
              <el-input
                v-model="userForm.username"
                placeholder="请输入用户名"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email" required>
              <el-input
                v-model="userForm.email"
                placeholder="请输入邮箱"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input
                v-model="userForm.phone"
                placeholder="请输入手机号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="realName">
              <el-input
                v-model="userForm.realName"
                placeholder="请输入真实姓名"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="密码" prop="password" required>
              <el-input
                v-model="userForm.password"
                type="password"
                placeholder="请输入密码"
                show-password
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="确认密码" prop="confirmPassword" required>
              <el-input
                v-model="userForm.confirmPassword"
                type="password"
                placeholder="请再次输入密码"
                show-password
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 角色和权限分组 -->
      <div class="form-section">
        <div class="form-section-title">角色和权限</div>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="角色" prop="role" required>
              <el-select
                v-model="userForm.role"
                placeholder="请选择角色"
                style="width: 100%"
                clearable
              >
                <el-option label="管理员" value="admin" />
                <el-option label="普通用户" value="user" />
                <el-option label="操作员" value="operator" />
                <el-option label="访客" value="guest" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="status" required>
              <el-radio-group v-model="userForm.status">
                <el-radio label="active">启用</el-radio>
                <el-radio label="inactive">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 其他信息分组 -->
      <div class="form-section">
        <div class="form-section-title">其他信息</div>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="部门" prop="department">
              <el-input
                v-model="userForm.department"
                placeholder="请输入部门"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="职位" prop="position">
              <el-input
                v-model="userForm.position"
                placeholder="请输入职位"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="备注" prop="remarks">
              <el-input
                v-model="userForm.remarks"
                type="textarea"
                :rows="4"
                placeholder="请输入备注信息"
                maxlength="500"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </div>

      <!-- 表单操作按钮 -->
      <div class="form-actions">
        <el-button type="primary" @click="handleSubmit" :loading="loading">
          {{ loading ? '提交中...' : '提交' }}
        </el-button>
        <el-button @click="handleCancel">取消</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script setup>
/**
 * 添加用户页面组件
 * 提供用户创建功能，包括表单验证、数据提交等
 */

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

// 获取路由实例
const router = useRouter()

// 表单引用
const userFormRef = ref()

// 加载状态
const loading = ref(false)

/**
 * 用户表单数据
 */
const userForm = reactive({
  username: '',
  email: '',
  phone: '',
  realName: '',
  password: '',
  confirmPassword: '',
  role: '',
  status: 'active',
  department: '',
  position: '',
  remarks: ''
})

/**
 * 表单验证规则
 */
const userRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== userForm.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ],
  status: [
    { required: true, message: '请选择状态', trigger: 'change' }
  ]
}

/**
 * 处理表单提交
 */
const handleSubmit = async () => {
  if (!userFormRef.value) return

  try {
    // 验证表单
    await userFormRef.value.validate()
    
    // 设置加载状态
    loading.value = true
    
    // 模拟API调用
    setTimeout(() => {
      ElMessage.success('用户创建成功')
      router.push('/user/list')
      loading.value = false
    }, 1000)
    
  } catch (error) {
    loading.value = false
    console.error('表单验证失败:', error)
  }
}

/**
 * 处理取消操作
 */
const handleCancel = () => {
  ElMessageBox.confirm('确定要取消添加用户吗？未保存的数据将丢失', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    router.push('/user/list')
  })
}

/**
 * 处理重置操作
 */
const handleReset = () => {
  ElMessageBox.confirm('确定要重置表单吗？所有已填写的数据将清空', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userFormRef.value.resetFields()
    ElMessage.success('表单已重置')
  })
}
</script>

<style scoped>
/* 添加用户页面容器样式 */
.add-user-container {
  padding: 0;
  max-width: 1200px;
  margin: 0 auto;
}

/* 页面头部样式 */
.page-header {
  margin-bottom: 24px;
  padding: 20px 0;
  border-bottom: 1px solid #dcdfe6;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.page-header p {
  font-size: 14px;
  margin: 0;
}

/* 用户表单样式 */
.user-form {
  background: transparent;
}

/* 表单操作按钮样式 */
.form-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 32px;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .add-user-container {
    padding: 0 16px;
  }
  
  .form-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .form-actions .el-button {
    width: 100%;
  }
}

/* 表单分组样式增强 */
.form-section {
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.form-section:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.form-section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #dcdfe6;
  position: relative;
}

.form-section-title::before {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 40px;
  height: 2px;
  background: #409eff;
  border-radius: 1px;
}

/* 表单项间距优化 */
.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__label {
  font-weight: 500;
}

/* 输入框样式增强 */
:deep(.el-input__inner) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.el-input__inner:focus) {
  transform: translateY(-1px);
}

/* 下拉选择框样式 */
:deep(.el-select .el-input__inner) {
  border-radius: 8px;
}

/* 单选框组样式 */
:deep(.el-radio-group) {
  display: flex;
  gap: 16px;
}

:deep(.el-radio) {
  margin-right: 0;
}

/* 文本域样式 */
:deep(.el-textarea__inner) {
  border-radius: 8px;
  resize: vertical;
  min-height: 100px;
}

/* 按钮样式增强 */
.form-actions .el-button {
  min-width: 100px;
  height: 40px;
  font-weight: 500;
}

.form-actions .el-button--primary {
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  border: none;
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.form-actions .el-button--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.4);
}
</style> 