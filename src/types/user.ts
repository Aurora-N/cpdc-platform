// 用户相关类型定义

export interface UserLoginDTO {
  userName: string
  password: string
}

export interface UserRegisterDTO {
  userName: string
  password: string
}

export interface UserLoginVO {
  token: string
  userId: number
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
