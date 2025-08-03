/**
 * 用户相关 API 服务
 * 包含用户登录、注册、信息获取等接口
 */

import api from './index.js'

/**
 * 用户登录
 * @param {Object} loginData - 登录数据
 * @param {string} loginData.username - 用户名
 * @param {string} loginData.password - 密码
 * @returns {Promise} 登录结果
 */
export const login = (loginData) => {
  return api.post('/auth/login', loginData)
}

/**
 * 用户登出
 * @returns {Promise} 登出结果
 */
export const logout = () => {
  return api.post('/auth/logout')
}

/**
 * 获取用户信息
 * @returns {Promise} 用户信息
 */
export const getUserInfo = () => {
  return api.get('/user/info')
}

/**
 * 获取用户列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.size - 每页数量
 * @param {string} params.keyword - 搜索关键词
 * @returns {Promise} 用户列表
 */
export const getUserList = (params) => {
  return api.get('/user/list', { params })
}

/**
 * 创建用户
 * @param {Object} userData - 用户数据
 * @returns {Promise} 创建结果
 */
export const createUser = (userData) => {
  return api.post('/user/create', userData)
}

/**
 * 更新用户信息
 * @param {number} userId - 用户ID
 * @param {Object} userData - 用户数据
 * @returns {Promise} 更新结果
 */
export const updateUser = (userId, userData) => {
  return api.put(`/user/${userId}`, userData)
}

/**
 * 删除用户
 * @param {number} userId - 用户ID
 * @returns {Promise} 删除结果
 */
export const deleteUser = (userId) => {
  return api.delete(`/user/${userId}`)
}

/**
 * 修改密码
 * @param {Object} passwordData - 密码数据
 * @param {string} passwordData.oldPassword - 旧密码
 * @param {string} passwordData.newPassword - 新密码
 * @returns {Promise} 修改结果
 */
export const changePassword = (passwordData) => {
  return api.put('/user/password', passwordData)
} 