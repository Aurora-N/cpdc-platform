import apiClient from '@/utils/apiClient'
import type {
  PageQueryDTO,
  PostListResponse,
  PostDetailResponse,
  ReplyListResponse,
  CreatePostDTO,
  CreateReplyDTO,
  LikeResponse,
  ApiResponse,
} from '@/types/post'
import {
  getMockPostList,
  getMockPostDetail,
  getMockReplyList,
  mockToggleLike,
  mockPosts,
} from '@/mock/postMock'

// 是否使用模拟数据（后端接口完成后，将此值改为 false）
const USE_MOCK_DATA = true

/**
 * 获取帖子列表（分页）
 */
export const getPostList = (params: PageQueryDTO) => {
  if (USE_MOCK_DATA) {
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: getMockPostList(params.page || 1, params.size || 5, (params as any).keyword),
    })
  }
  return apiClient.get<any, PostListResponse>('/posts', { params })
}

/**
 * 获取帖子详情
 */
export const getPostDetail = (id: number) => {
  if (USE_MOCK_DATA) {
    const post = getMockPostDetail(id)
    if (post) {
      return Promise.resolve({
        code: 200,
        message: 'success',
        data: post,
      })
    }
    return Promise.reject({ code: 404, message: '帖子不存在' })
  }
  return apiClient.get<any, PostDetailResponse>(`/posts/${id}`)
}

/**
 * 创建帖子
 */
export const createPost = (data: CreatePostDTO) => {
  if (USE_MOCK_DATA) {
    const newPost: any = {
      id: mockPosts.length + 1,
      ...data,
      authorId: 1,
      authorName: '当前用户',
      watchTimes: 0,
      likedTimes: 0,
      replyCount: 0,
      createdTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').slice(0, 19),
      isLiked: false,
    }
    mockPosts.unshift(newPost)
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: newPost.id,
    })
  }
  return apiClient.post<any, ApiResponse<number>>('/posts', data)
}

/**
 * 点赞/取消点赞帖子
 */
export const toggleLikePost = (id: number) => {
  if (USE_MOCK_DATA) {
    const post = mockPosts.find((p) => p.id === id)
    if (post) {
      const result = mockToggleLike(id, post.isLiked || false)
      return Promise.resolve({
        code: 200,
        message: 'success',
        data: result,
      })
    }
    return Promise.reject({ code: 404, message: '帖子不存在' })
  }
  return apiClient.post<any, LikeResponse>(`/posts/${id}/like`)
}

/**
 * 获取帖子评论列表（分页）
 */
export const getReplyList = (postId: number, params: PageQueryDTO) => {
  if (USE_MOCK_DATA) {
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: getMockReplyList(postId, params.page || 1, params.size || 10),
    })
  }
  return apiClient.get<any, ReplyListResponse>(`/posts/${postId}/replies`, { params })
}

/**
 * 创建评论
 */
export const createReply = (postId: number, data: CreateReplyDTO) => {
  if (USE_MOCK_DATA) {
    const newReplyId = Date.now()
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: newReplyId,
    })
  }
  return apiClient.post<any, ApiResponse<number>>(`/posts/${postId}/replies`, data)
}

/**
 * 上传图片
 */
export const uploadImage = (file: File) => {
  if (USE_MOCK_DATA) {
    // 模拟上传，返回一个本地图片URL
    return Promise.resolve({
      code: 200,
      message: 'success',
      data: URL.createObjectURL(file),
    })
  }
  const formData = new FormData()
  formData.append('file', file)
  return apiClient.post<any, ApiResponse<string>>('/upload/image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
