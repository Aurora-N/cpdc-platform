// 帖子相关类型定义

import type { ApiResponse } from './user'

// 分页查询参数
export interface PageQueryDTO {
  current?: number
  size?: number
  keyword?: string
}

// 评论查询参数
export interface QueryReplyDTO extends PageQueryDTO {
  postId: number
  answerId: number
}

// 分页返回数据
export interface PageResult<T> {
  records: T[]
  total: number
  pages: number
  current: number
  size: number
}

// 帖子信息
export interface Post {
  id: number
  title: string
  content: string
  authorId: number
  authorName?: string // 作者名称（后端需要关联用户表）
  authorAvatar?: string // 作者头像（可选）
  images?: string[] // 图片URL数组
  watchTimes: number
  likedTimes: number
  replyCount: number
  createdTime: string
  updateTime: string
  isLiked?: boolean // 当前用户是否已点赞
}

// 评论信息
export interface Reply {
  id: number
  postId: number
  answerId: number // 上级ID，0表示回复帖子
  userId: number
  userName?: string // 用户名称
  userAvatar?: string // 用户头像
  content: string
  targetUserId?: number // 回复的目标用户ID
  targetReplyId?: number // 回复的评论ID
  targetUserName?: string // 目标用户名称
  images?: string[] // 图片URL数组
  createdTime: string
  updateTime: string
  children?: Reply[] // 子评论（多级回复）
}

// 创建帖子DTO
export interface CreatePostDTO {
  title: string
  content: string
  images?: string[] // 图片URL数组
}

// 创建评论DTO
export interface CreateReplyDTO {
  postId: number
  content: string
  answerId: number // 上级ID，0或不传表示回复帖子
  targetUserId?: number // 回复的目标用户ID
  targetReplyId?: number // 回复的评论ID
  images?: string[] // 图片URL数组
}

// 帖子列表响应
export type PostListResponse = ApiResponse<PageResult<Post>>

// 帖子详情响应
export type PostDetailResponse = ApiResponse<Post>

// 评论列表响应
export type ReplyListResponse = ApiResponse<PageResult<Reply>>

// 点赞响应 (后端返回 Result<String>)
export type LikeResponse = ApiResponse<string>
