<template>
  <div class="menu-management">
    <!-- 操作工具栏 -->
    <div class="toolbar">
      <el-button type="primary" @click="handleAddMenu" :icon="Plus">
        新增
      </el-button>
      <el-button @click="handleBatchDelete" :icon="Delete" :disabled="!selectedMenus.length">
        批量删除
      </el-button>
      <el-button @click="handleRefresh" :icon="Refresh">
        刷新
      </el-button>
    </div>

    <!-- 菜单列表 -->
    <div class="menu-list">
      <el-table border
        :data="menuList"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        row-key="id"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column type="selection" width="55" />
        
                <el-table-column prop="title" label="菜单名称" min-width="200">
          <template #default="{ row }">
            <el-icon v-if="row.icon" class="menu-icon">
              <component :is="row.icon" />
            </el-icon>
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="project" label="对应工程" min-width="150">
          <template #default="{ row }">
            <el-tag :type="getProjectTag(row.project)" size="small">
              {{ getProjectLabel(row.project) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="path" label="路由路径" min-width="150" />
        
        <el-table-column prop="type" label="菜单类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getMenuTypeTag(row.type)">
              {{ getMenuTypeLabel(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="sort" label="排序" width="80" />
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-switch
              v-model="row.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange(row)"
            />
          </template>
        </el-table-column>
        
        <el-table-column prop="createTime" label="创建时间" width="180" />
        
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEditMenu(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDeleteMenu(row)">删除</el-button>
            <el-button size="small" type="info" @click="handleViewMenu(row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 新增/编辑菜单对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="menuFormRef"
        :model="menuForm"
        :rules="menuRules"
        label-width="100px"
      >
        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="menuForm.title" placeholder="请输入菜单名称" />
        </el-form-item>
        
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="请输入图标名称" />
        </el-form-item>
        
        <el-form-item label="对应工程" prop="project">
          <el-select v-model="menuForm.project" placeholder="请选择对应工程">
            <el-option label="OMS系统" value="oms" />
            <el-option label="用户端" value="client" />
            <el-option label="管理端" value="admin" />
            <el-option label="API服务" value="api" />
            <el-option label="网关服务" value="gateway" />
            <el-option label="认证服务" value="auth" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="menuForm.path" placeholder="请输入路由路径" />
        </el-form-item>
        
        <el-form-item label="菜单类型" prop="type">
          <el-select v-model="menuForm.type" placeholder="请选择菜单类型">
            <el-option label="目录" value="directory" />
            <el-option label="菜单" value="menu" />
            <el-option label="按钮" value="button" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="上级菜单" prop="parentId">
          <el-tree-select
            v-model="menuForm.parentId"
            :data="menuTreeData"
            placeholder="请选择上级菜单"
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>
        
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="menuForm.sort" :min="0" :max="999" />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="menuForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="权限标识" prop="permission">
          <el-input v-model="menuForm.permission" placeholder="请输入权限标识" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitMenu">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查看菜单详情对话框 -->
    <el-dialog
      v-model="viewDialogVisible"
      title="菜单详情"
      width="500px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="菜单名称">{{ currentMenu.title }}</el-descriptions-item>
        <el-descriptions-item label="对应工程">
          <el-tag :type="getProjectTag(currentMenu.project)" size="small">
            {{ getProjectLabel(currentMenu.project) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="路由路径">{{ currentMenu.path }}</el-descriptions-item>
        <el-descriptions-item label="菜单类型">{{ getMenuTypeLabel(currentMenu.type) }}</el-descriptions-item>
        <el-descriptions-item label="排序">{{ currentMenu.sort }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="currentMenu.status === 1 ? 'success' : 'danger'">
            {{ currentMenu.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="权限标识">{{ currentMenu.permission }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ currentMenu.createTime }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Delete, Refresh } from '@element-plus/icons-vue'

// 响应式数据
const menuList = ref([])
const selectedMenus = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const dialogVisible = ref(false)
const viewDialogVisible = ref(false)
const dialogTitle = ref('')
const currentMenu = ref({})

// 表单数据
const menuForm = reactive({
  id: '',
  title: '',
  icon: '',
  project: 'oms',
  path: '',
  type: 'menu',
  parentId: null,
  sort: 0,
  status: 1,
  permission: ''
})

// 表单验证规则
const menuRules = {
  title: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' }
  ],
  path: [
    { required: true, message: '请输入路由路径', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择菜单类型', trigger: 'change' }
  ]
}

// 菜单树数据
const menuTreeData = ref([])

// 获取菜单类型标签
const getMenuTypeTag = (type) => {
  const typeMap = {
    directory: 'primary',
    menu: 'success',
    button: 'warning'
  }
  return typeMap[type] || 'info'
}

// 获取菜单类型标签文本
const getMenuTypeLabel = (type) => {
  const typeMap = {
    directory: '目录',
    menu: '菜单',
    button: '按钮'
  }
  return typeMap[type] || '未知'
}

// 获取工程标签类型
const getProjectTag = (project) => {
  const projectMap = {
    oms: 'primary',
    client: 'success',
    admin: 'warning',
    api: 'info',
    gateway: 'danger',
    auth: 'success'
  }
  return projectMap[project] || 'info'
}

// 获取工程标签文本
const getProjectLabel = (project) => {
  const projectMap = {
    oms: 'OMS系统',
    client: '用户端',
    admin: '管理端',
    api: 'API服务',
    gateway: '网关服务',
    auth: '认证服务'
  }
  return projectMap[project] || '未知'
}

// 初始化数据
onMounted(() => {
  loadMenuList()
  loadMenuTree()
})

// 加载菜单列表
const loadMenuList = async () => {
  try {
    // 模拟API调用
    const mockData = [
      {
        id: 1,
        title: '仪表盘',
        icon: 'Odometer',
        project: 'oms',
        path: '/dashboard',
        type: 'menu',
        sort: 1,
        status: 1,
        permission: 'dashboard:view',
        createTime: '2024-01-01 10:00:00'
      },
      {
        id: 2,
        title: '用户管理',
        icon: 'User',
        project: 'oms',
        path: '/user',
        type: 'directory',
        sort: 2,
        status: 1,
        permission: 'user:view',
        createTime: '2024-01-01 10:00:00',
        children: [
          {
            id: 21,
            title: '用户列表',
            icon: 'List',
            project: 'client',
            path: '/user/list',
            type: 'menu',
            sort: 1,
            status: 1,
            permission: 'user:list',
            createTime: '2024-01-01 10:00:00'
          },
          {
            id: 22,
            title: '添加用户',
            icon: 'Plus',
            project: 'admin',
            path: '/user/add',
            type: 'menu',
            sort: 2,
            status: 1,
            permission: 'user:add',
            createTime: '2024-01-01 10:00:00'
          }
        ]
      },
      {
        id: 3,
        title: '订单管理',
        icon: 'ShoppingCart',
        project: 'oms',
        path: '/order',
        type: 'directory',
        sort: 3,
        status: 1,
        permission: 'order:view',
        createTime: '2024-01-01 10:00:00',
        children: [
          {
            id: 31,
            title: '订单列表',
            icon: 'List',
            project: 'client',
            path: '/order/list',
            type: 'menu',
            sort: 1,
            status: 1,
            permission: 'order:list',
            createTime: '2024-01-01 10:00:00'
          }
        ]
      },
      {
        id: 4,
        title: '系统管理',
        icon: 'Setting',
        project: 'admin',
        path: '/system',
        type: 'directory',
        sort: 4,
        status: 1,
        permission: 'system:view',
        createTime: '2024-01-01 10:00:00',
        children: [
          {
            id: 41,
            title: '菜单栏管理',
            icon: 'Menu',
            project: 'admin',
            path: '/system/menu',
            type: 'menu',
            sort: 1,
            status: 1,
            permission: 'system:menu',
            createTime: '2024-01-01 10:00:00'
          }
        ]
      }
    ]
    
    menuList.value = mockData
    total.value = mockData.length
  } catch (error) {
    ElMessage.error('加载菜单列表失败')
  }
}

// 加载菜单树数据
const loadMenuTree = async () => {
  try {
    // 模拟API调用
    const mockTreeData = [
      {
        id: 0,
        title: '顶级菜单',
        children: [
          {
            id: 1,
            title: '仪表盘',
            children: []
          },
          {
            id: 2,
            title: '用户管理',
            children: []
          },
          {
            id: 3,
            title: '订单管理',
            children: []
          }
        ]
      }
    ]
    
    menuTreeData.value = mockTreeData
  } catch (error) {
    ElMessage.error('加载菜单树失败')
  }
}

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedMenus.value = selection
}

// 处理新增菜单
const handleAddMenu = () => {
  dialogTitle.value = '新增菜单'
  resetMenuForm()
  dialogVisible.value = true
}

// 处理编辑菜单
const handleEditMenu = (row) => {
  dialogTitle.value = '编辑菜单'
  Object.assign(menuForm, row)
  dialogVisible.value = true
}

// 处理删除菜单
const handleDeleteMenu = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除菜单"${row.title}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟API调用
    ElMessage.success('删除成功')
    loadMenuList()
  } catch (error) {
    // 用户取消删除
  }
}

// 处理批量删除
const handleBatchDelete = async () => {
  if (selectedMenus.value.length === 0) {
    ElMessage.warning('请选择要删除的菜单')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      `确定要删除选中的 ${selectedMenus.value.length} 个菜单吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟API调用
    ElMessage.success('批量删除成功')
    loadMenuList()
  } catch (error) {
    // 用户取消删除
  }
}

// 处理查看菜单
const handleViewMenu = (row) => {
  currentMenu.value = { ...row }
  viewDialogVisible.value = true
}

// 处理状态变化
const handleStatusChange = async (row) => {
  try {
    // 模拟API调用
    ElMessage.success(`${row.status === 1 ? '启用' : '禁用'}成功`)
  } catch (error) {
    ElMessage.error('操作失败')
    row.status = row.status === 1 ? 0 : 1 // 恢复状态
  }
}

// 处理刷新
const handleRefresh = () => {
  loadMenuList()
  ElMessage.success('刷新成功')
}

// 处理分页大小变化
const handleSizeChange = (val) => {
  pageSize.value = val
  loadMenuList()
}

// 处理当前页变化
const handleCurrentChange = (val) => {
  currentPage.value = val
  loadMenuList()
}

// 处理对话框关闭
const handleDialogClose = () => {
  resetMenuForm()
}

// 重置表单
const resetMenuForm = () => {
  Object.assign(menuForm, {
    id: '',
    title: '',
    icon: '',
    project: 'oms',
    path: '',
    type: 'menu',
    parentId: null,
    sort: 0,
    status: 1,
    permission: ''
  })
}

// 处理提交菜单
const handleSubmitMenu = async () => {
  try {
    // 模拟API调用
    ElMessage.success(menuForm.id ? '更新成功' : '新增成功')
    dialogVisible.value = false
    loadMenuList()
  } catch (error) {
    ElMessage.error('操作失败')
  }
}
</script>

<style scoped>
.menu-management {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.toolbar {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.menu-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-icon {
  font-size: 16px;
  color: #409EFF;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .menu-management {
    padding: 15px;
  }
  
  .toolbar {
    flex-direction: column;
    gap: 8px;
  }
  
  .toolbar .el-button {
    width: 100%;
  }
}
</style> 