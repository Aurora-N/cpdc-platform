import apiClient from '@/utils/apiClient'
import type {
  QueryReplyDTO,
  PageQueryDTO,
  PostListResponse,
  PostDetailResponse,
  ReplyListResponse,
  CreatePostDTO,
  CreateReplyDTO,
  LikeResponse,
  ApiResponse,
} from '@/types/post'

// 是否使用模拟数据（后端接口完成后，将此值改为 false）
const USE_MOCK_DATA = false

/**
 * 获取帖子列表（分页）
 */
export const getPostList = (params: PageQueryDTO) => {
  return apiClient.get<any, PostListResponse>('/posts', { params })
}

/**
 * 获取帖子详情
 */
export const getPostDetail = (id: number) => {
  return apiClient.get<any, PostDetailResponse>(`/posts/${id}`)
}

/**
 * 创建帖子
 */
export const createPost = (data: CreatePostDTO) => {
  return apiClient.post<any, ApiResponse<number>>('/posts', data)
}

/**
 * 点赞/取消点赞帖子
 */
export const toggleLikePost = (id: number) => {
  return apiClient.post<any, LikeResponse>(`/posts/${id}/like`)
}

/**
 * 获取帖子评论列表（分页）
 */
export const getReplyList = (params: QueryReplyDTO) => {
  return apiClient.get<any, ReplyListResponse>('/reply/list', { params })
}

/**
 * 创建评论
 */
export const createReply = (data: CreateReplyDTO) => {
  return apiClient.post<any, ApiResponse<number>>('/reply', data)
}

/**
 * 上传图片
 */
export const uploadImage = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  return apiClient.post<any, ApiResponse<string>>('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

/**
 * 删除图片
 */
export const deleteImage = (url: string) => {
  return apiClient.delete<any, ApiResponse<string>>('/upload/image', {
    params: { url },
  })
}

