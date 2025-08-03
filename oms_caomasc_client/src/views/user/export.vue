<template>
  <div class="user-export">
    <div class="page-header">
      <h2>导出数据</h2>
      <p>用户数据导出功能</p>
    </div>
    
    <el-card class="export-card">
      <template #header>
        <span>数据导出</span>
      </template>
      
      <div class="export-content">
        <p>数据导出功能开发中...</p>
      </div>
    </el-card>
  </div>
</template>

<script setup>
// 用户导出页面组件
</script>

<style scoped>
.user-export {
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

.export-card {
  margin-bottom: 20px;
}

.export-content {
  padding: 20px;
  text-align: center;
  color: #666;
}
</style> 