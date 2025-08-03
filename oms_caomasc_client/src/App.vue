<template>
  <!-- 应用根容器 -->
  <div id="app">
    <!-- 路由视图容器，用于渲染当前路由对应的组件 -->
    <router-view />
  </div>
</template>

<script setup>
/**
 * 应用根组件
 * 这是整个 Vue 应用的根组件，所有其他组件都是它的子组件
 * 使用 <script setup> 语法糖，简化了 Composition API 的写法
 */

// 这里可以添加全局的逻辑，比如：
// - 全局状态初始化
// - 全局事件监听
// - 应用级别的生命周期钩子
</script>

<style>
/**
 * 全局样式定义
 * 这些样式会应用到整个应用
 */

/* 应用根容器样式 */
#app {
  /* 设置字体族，支持中英文 */
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  
  /* 字体渲染优化，让文字更清晰 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  /* 设置应用高度为视口高度，确保全屏显示 */
  height: 95vh;
  margin: 0;
  padding: 0;
  
  /* 添加边框样式 */
  border: 2px solid #e5e5e5;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  
  /* 设置最大宽度和居中显示 */
  /* max-width: 1400px; */
  /* margin: 10px auto; */
  
  /* 背景色 */
  background-color: #ffffff;
  
  /* 溢出处理 */
  overflow: hidden;
}

/* 全局盒模型设置 */
* {
  /* 使用 border-box 盒模型，包含 padding 和 border 在内的总宽高 */
  box-sizing: border-box;
}

/* 重置 body 默认样式 */
body {
  margin: 0;
  padding: 20px;
  font-size: 13px;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  
  /* 为边框应用添加背景色 */
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style> 