# OMS微服务前端客户端

## 项目简介

这是 OMS 微服务管理系统的前端客户端，基于 Vue 3 + Element Plus 构建。

## 技术栈

- **Vue 3** - 渐进式 JavaScript 框架
- **Vite** - 下一代前端构建工具
- **Vue Router** - Vue.js 官方路由管理器
- **Pinia** - Vue 的状态管理库
- **Element Plus** - Vue 3 的组件库
- **Axios** - HTTP 客户端

## 项目结构

```
oms_caomasc_client/
├── public/                 # 静态资源
├── src/
│   ├── layout/            # 布局组件
│   ├── router/            # 路由配置
│   ├── views/             # 页面组件
│   │   ├── login/         # 登录页面
│   │   ├── dashboard/     # 仪表盘
│   │   ├── user/          # 用户管理
│   │   └── order/         # 订单管理
│   ├── App.vue            # 根组件
│   └── main.js            # 入口文件
├── index.html             # HTML 模板
├── package.json           # 项目配置
├── vite.config.js         # Vite 配置
└── README.md              # 项目说明
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 功能特性

- ✅ 用户登录/登出
- ✅ 响应式布局
- ✅ 路由管理
- ✅ 状态管理
- ✅ 仪表盘展示
- ✅ 用户管理（待开发）
- ✅ 订单管理（待开发）

## 默认账号

- 用户名：admin
- 密码：123456

## 开发说明

### 添加新页面

1. 在 `src/views/` 下创建新的页面组件
2. 在 `src/router/index.js` 中添加路由配置
3. 在 `src/layout/index.vue` 中添加菜单项

### API 接口

项目配置了代理，所有 `/api` 开头的请求会被代理到后端服务。

### 样式规范

- 使用 Element Plus 组件库
- 遵循 BEM 命名规范
- 响应式设计

## 部署说明

构建完成后，将 `dist` 目录部署到 Web 服务器即可。

## 许可证

MIT License 