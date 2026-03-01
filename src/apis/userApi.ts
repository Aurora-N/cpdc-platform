import apiClient from '@/utils/apiClient'
import type { UserLoginDTO, UserRegisterDTO, UserLoginVO, ApiResponse } from '@/types/user'

/**
 * 用户登录
 */
export const login = (data: UserLoginDTO) => {
  return apiClient.post<any, ApiResponse<UserLoginVO>>('/user/login', data)
}

/**
 * 用户注册
 */
export const register = (data: UserRegisterDTO) => {
  return apiClient.post<any, ApiResponse<string>>('/user/register', data)
}

/**
 * 用户登出
 */
export const logout = () => {
  return apiClient.post<any, ApiResponse<string>>('/user/logout')
}

/**
 * 获取个人信息
 */
export const getProfile = () => {
  return apiClient.get<any, ApiResponse<string>>('/user/profile')
}

/**
 * 更新个人信息
 */
export const updateProfile = (data: UserRegisterDTO) => {
  return apiClient.post<any, ApiResponse<string>>('/user/update', data)
}
