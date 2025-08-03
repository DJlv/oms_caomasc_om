<template>
  <div class="simple-dashboard">
    <h1>首页测试</h1>
    <p>这是一个简单的测试页面</p>
    <el-button type="primary" @click="testClick">测试按钮</el-button>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const testClick = () => {
  ElMessage.success('测试成功！')
}
</script>

<style scoped>
.simple-dashboard {
  padding: 20px;
  text-align: center;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}

p {
  color: #666;
  margin-bottom: 20px;
}
</style> 