<template>
  <div class="order-create">
    <div class="page-header">
      <h2>创建订单</h2>
      <p>新建订单功能</p>
    </div>
    
    <el-card class="create-card">
      <template #header>
        <span>订单创建</span>
      </template>
      
      <div class="create-content">
        <p>订单创建功能开发中...</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// 订单创建页面组件
</script>

<style scoped>
.order-create {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.create-card {
  margin-bottom: 20px;
}

.create-content {
  padding: 20px;
  text-align: center;
  color: #666;
}
</style> 