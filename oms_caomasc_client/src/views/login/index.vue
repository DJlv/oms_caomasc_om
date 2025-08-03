<template>
  <!-- 登录页面容器 -->
  <div class="login-container">
    <!-- 登录表单卡片 -->
    <div class="login-box">
      <!-- 登录页面头部 -->
      <div class="login-header">
        <h2>OMS微服务管理系统</h2>
        <p>欢迎登录</p>
      </div>
      
      <!-- 登录表单 -->
      <el-form
        ref="loginFormRef"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        @submit.prevent="handleLogin"
      >
        <!-- 用户名输入框 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入用户名"
            size="large"
            prefix-icon="User"
          />
        </el-form-item>
        
        <!-- 密码输入框 -->
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            size="large"
            prefix-icon="Lock"
            show-password
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            class="login-button"
            @click="handleLogin"
          >
            {{ loading ? '登录中...' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 登录页面底部提示 -->
      <div class="login-footer">
        <p>默认账号：admin / 123456</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 登录页面组件
 * 提供用户登录功能，包括表单验证、登录请求处理等
 */

import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

// 获取路由实例，用于登录成功后跳转
const router = useRouter()

// 表单引用，用于表单验证
const loginFormRef = ref()

// 登录加载状态
const loading = ref(false)

/**
 * 登录表单数据
 * 使用 reactive 创建响应式对象
 */
const loginForm = reactive({
  username: 'admin', // 默认用户名
  password: '123456' // 默认密码
})

/**
 * 表单验证规则
 * 定义用户名和密码的验证规则
 */
const loginRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

/**
 * 处理登录逻辑
 * 包括表单验证、登录请求、错误处理等
 */
const handleLogin = async () => {
  // 检查表单引用是否存在
  if (!loginFormRef.value) return
  
  try {
    // 验证表单数据
    await loginFormRef.value.validate()
    
    // 设置加载状态
    loading.value = true
    
    // 模拟登录请求（实际项目中这里应该调用真实的 API）
    setTimeout(() => {
      // 简单的用户名密码验证
      if (loginForm.username === 'admin' && loginForm.password === '123456') {
        // 登录成功，保存用户信息到本地存储
        localStorage.setItem('token', 'mock-token-' + Date.now())
        localStorage.setItem('userInfo', JSON.stringify({
          username: loginForm.username,
          role: 'admin'
        }))
        
        // 显示成功消息
        ElMessage.success('登录成功')
        
        // 跳转到仪表盘页面
        router.push('/dashboard')
      } else {
        // 登录失败，显示错误消息
        ElMessage.error('用户名或密码错误')
      }
      
      // 重置加载状态
      loading.value = false
    }, 1000) // 模拟网络延迟
    
  } catch (error) {
    // 表单验证失败或其他错误
    loading.value = false
    console.error('登录验证失败:', error)
  }
}
</script>

<style scoped>
/* 登录页面容器样式 */
.login-container {
  height: 100vh; /* 占满整个视口高度 */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 登录表单卡片样式 */
.login-box {
  width: 400px;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

/* 登录页面头部样式 */
.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  margin-bottom: 10px;
  font-size: 24px;
  font-weight: 500;
}

.login-header p {
  margin: 0;
  font-size: 14px;
}

/* 登录表单样式 */
.login-form {
  margin-bottom: 20px;
}

/* 登录按钮样式 */
.login-button {
  width: 100%;
  height: 45px;
  font-size: 16px;
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  border: none;
}

.login-button:hover {
  background: linear-gradient(135deg, #337ecc 0%, #2d6da3 100%);
}

/* 登录页面底部样式 */
.login-footer {
  text-align: center;
  font-size: 13px;
}

.login-footer p {
  margin: 0;
}

/* 输入框样式覆盖 */
:deep(.el-input__inner) {
  font-size: 14px;
}

:deep(.el-input__inner:focus) {
  border-color: #409eff !important;
}
</style> 