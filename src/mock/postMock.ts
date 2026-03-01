// 模拟数据 - 用于前端展示效果
import type { Post, Reply, PageResult } from '@/types/post'

// 模拟帖子数据
export const mockPosts: Post[] = [
  {
    id: 1,
    title: '帖子1',
    content: '我喜欢花朵纹样的广彩瓷!花朵在莹白的瓷盘中绽放多漂亮呀......',
    authorId: 1,
    authorName: '用户1',
    images: [
      '/cpdc-platform/exhibition/1.png',
      '/cpdc-platform/exhibition/2.png',
    ],
    watchTimes: 128,
    likedTimes: 45,
    replyCount: 12,
    createdTime: '2025-10-21 10:30:00',
    updateTime: '2025-10-21 10:30:00',
    isLiked: false,
  },
  {
    id: 2,
    title: '帖子2',
    content: '今天慕名前往广东欣赏了广彩瓷,瓷质清亮,花纹生动瑰丽,非常喜欢。拍了很多照片留着自己欣赏。',
    authorId: 2,
    authorName: '用户2',
    images: [
      '/cpdc-platform/exhibition/1.png',
      '/cpdc-platform/exhibition/2.png',
      '/cpdc-platform/exhibition/3.png',
      '/cpdc-platform/exhibition/4.png',
      '/cpdc-platform/exhibition/5.png',
      '/cpdc-platform/exhibition/6.png',
    ],
    watchTimes: 256,
    likedTimes: 89,
    replyCount: 23,
    createdTime: '2025-10-20 15:20:00',
    updateTime: '2025-10-20 15:20:00',
    isLiked: true,
  },
  {
    id: 3,
    title: '帖子3',
    content: '特地去参观了广彩瓷展厅,三个展厅布置得很漂亮舒适,广彩瓷的历史讲述让人一目了然。学习到了很多,诸如广彩瓷工艺、历史和未来发展。很开心,下次还会再来,希望还能有新收获。',
    authorId: 3,
    authorName: '用户3',
    images: [],
    watchTimes: 189,
    likedTimes: 67,
    replyCount: 8,
    createdTime: '2025-10-19 09:15:00',
    updateTime: '2025-10-19 09:15:00',
    isLiked: false,
  },
  {
    id: 4,
    title: '帖子4',
    content: '中国山水在瓷器上的呈现,实物美得震撼。广彩瓷值得来看!',
    authorId: 4,
    authorName: '用户4',
    images: [
      '/cpdc-platform/exhibition/3.png',
      '/cpdc-platform/exhibition/4.png',
    ],
    watchTimes: 312,
    likedTimes: 134,
    replyCount: 45,
    createdTime: '2025-10-18 14:45:00',
    updateTime: '2025-10-18 14:45:00',
    isLiked: true,
  },
  {
    id: 5,
    title: '帖子5',
    content: '这次在展厅的体验感很棒广彩瓷玲琅满目的都看不过来了哈哈哈!每一个作品都很漂亮,能够看到很浓郁的岭南工匠精神和岭南风骨,敬佩。下次还来!',
    authorId: 5,
    authorName: '用户5',
    images: [],
    watchTimes: 445,
    likedTimes: 201,
    replyCount: 67,
    createdTime: '2025-10-17 11:30:00',
    updateTime: '2025-10-17 11:30:00',
    isLiked: false,
  },
  {
    id: 6,
    title: '帖子6',
    content: '不多说,看图。',
    authorId: 6,
    authorName: '用户6',
    images: [
      '/cpdc-platform/exhibition/1.png',
      '/cpdc-platform/exhibition/2.png',
      '/cpdc-platform/exhibition/3.png',
    ],
    watchTimes: 567,
    likedTimes: 278,
    replyCount: 89,
    createdTime: '2025-10-16 16:20:00',
    updateTime: '2025-10-16 16:20:00',
    isLiked: true,
  },
  {
    id: 7,
    title: '帖子7',
    content: '拍了最喜欢的两个广彩瓷想分享一下,这种淡雅的中式美学太棒了!',
    authorId: 7,
    authorName: '用户7',
    images: [
      '/cpdc-platform/exhibition/4.png',
      '/cpdc-platform/exhibition/5.png',
    ],
    watchTimes: 234,
    likedTimes: 112,
    replyCount: 34,
    createdTime: '2025-10-15 13:10:00',
    updateTime: '2025-10-15 13:10:00',
    isLiked: false,
  },
  {
    id: 8,
    title: '广彩瓷的工艺之美',
    content: '广彩瓷的七十二道工序，每一道都凝聚着匠人的心血。从白胎到彩绘，从烧制到成品，每一个环节都体现了传统工艺的精湛。',
    authorId: 1,
    authorName: '用户1',
    images: [
      '/cpdc-platform/exhibition/6.png',
    ],
    watchTimes: 678,
    likedTimes: 345,
    replyCount: 56,
    createdTime: '2025-10-14 10:00:00',
    updateTime: '2025-10-14 10:00:00',
    isLiked: true,
  },
  {
    id: 9,
    title: '岭南文化的传承',
    content: '广彩瓷不仅是艺术品，更是岭南文化的载体。它承载着三百年的历史，见证了时代的变迁。',
    authorId: 2,
    authorName: '用户2',
    images: [
      '/cpdc-platform/exhibition/1.png',
      '/cpdc-platform/exhibition/2.png',
      '/cpdc-platform/exhibition/3.png',
      '/cpdc-platform/exhibition/4.png',
    ],
    watchTimes: 789,
    likedTimes: 456,
    replyCount: 78,
    createdTime: '2025-10-13 09:30:00',
    updateTime: '2025-10-13 09:30:00',
    isLiked: false,
  },
  {
    id: 10,
    title: '数字化的广彩文化',
    content: '通过数字技术，我们可以更好地保护和传承广彩文化。这个平台让更多人能够了解和欣赏广彩瓷的魅力。',
    authorId: 3,
    authorName: '用户3',
    images: [],
    watchTimes: 345,
    likedTimes: 167,
    replyCount: 23,
    createdTime: '2025-10-12 15:45:00',
    updateTime: '2025-10-12 15:45:00',
    isLiked: true,
  },
]

// 模拟评论数据 - 按帖子ID组织
const mockRepliesByPost: Record<number, Reply[]> = {
  1: [
    {
      id: 1,
      postId: 1,
      answerId: 0,
      userId: 2,
      userName: '用户2',
      content: '我也很喜欢广彩瓷的花纹设计，特别是那些细腻的笔触。',
      images: [],
      createdTime: '2025-10-21 11:00:00',
      updateTime: '2025-10-21 11:00:00',
      children: [
        {
          id: 2,
          postId: 1,
          answerId: 1,
          userId: 3,
          userName: '用户3',
          content: '是的，每一笔都很有讲究。',
          targetUserId: 2,
          targetUserName: '用户2',
          images: [],
          createdTime: '2025-10-21 11:30:00',
          updateTime: '2025-10-21 11:30:00',
        },
      ],
    },
    {
      id: 3,
      postId: 1,
      answerId: 0,
      userId: 4,
      userName: '用户4',
      content: '广彩瓷的历史真的很悠久，值得我们去了解和学习。',
      images: [],
      createdTime: '2025-10-21 12:00:00',
      updateTime: '2025-10-21 12:00:00',
    },
  ],
  2: [
    {
      id: 4,
      postId: 2,
      answerId: 0,
      userId: 5,
      userName: '用户5',
      content: '照片拍得真不错！我也想去看看。',
      images: [],
      createdTime: '2025-10-20 16:00:00',
      updateTime: '2025-10-20 16:00:00',
    },
    {
      id: 5,
      postId: 2,
      answerId: 0,
      userId: 6,
      userName: '用户6',
      content: '广彩瓷的工艺确实很精湛，每一件都是艺术品。',
      images: [],
      createdTime: '2025-10-20 17:00:00',
      updateTime: '2025-10-20 17:00:00',
      children: [
        {
          id: 6,
          postId: 2,
          answerId: 5,
          userId: 2,
          userName: '用户2',
          content: '同意！',
          targetUserId: 6,
          targetUserName: '用户6',
          images: [],
          createdTime: '2025-10-20 17:30:00',
          updateTime: '2025-10-20 17:30:00',
        },
      ],
    },
  ],
  3: [
    {
      id: 7,
      postId: 3,
      answerId: 0,
      userId: 1,
      userName: '用户1',
      content: '展厅的布置确实很用心，我也学到了很多。',
      images: [],
      createdTime: '2025-10-19 10:00:00',
      updateTime: '2025-10-19 10:00:00',
    },
  ],
  4: [
    {
      id: 8,
      postId: 4,
      answerId: 0,
      userId: 7,
      userName: '用户7',
      content: '中国山水画在瓷器上的表现真的很震撼！',
      images: [],
      createdTime: '2025-10-18 15:00:00',
      updateTime: '2025-10-18 15:00:00',
    },
    {
      id: 9,
      postId: 4,
      answerId: 0,
      userId: 1,
      userName: '用户1',
      content: '这种传统与现代的结合很棒。',
      images: [],
      createdTime: '2025-10-18 16:00:00',
      updateTime: '2025-10-18 16:00:00',
    },
  ],
}

// 模拟分页数据
export const getMockPostList = (page: number = 1, size: number = 5, keyword?: string): PageResult<Post> => {
  let filteredPosts = [...mockPosts]

  // 搜索过滤
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase()
    filteredPosts = filteredPosts.filter(
      (post) =>
        post.title.toLowerCase().includes(lowerKeyword) ||
        post.content.toLowerCase().includes(lowerKeyword)
    )
  }

  // 分页
  const start = (page - 1) * size
  const end = start + size
  const records = filteredPosts.slice(start, end)

  return {
    records,
    total: filteredPosts.length,
    pages: Math.ceil(filteredPosts.length / size),
    current: page,
    size,
  }
}

// 模拟获取帖子详情
export const getMockPostDetail = (id: number): Post | null => {
  const post = mockPosts.find((p) => p.id === id)
  if (post) {
    // 增加浏览数
    post.watchTimes += 1
    return { ...post }
  }
  return null
}

// 模拟获取评论列表
export const getMockReplyList = (postId: number, page: number = 1, size: number = 10): PageResult<Reply> => {
  const postReplies = mockRepliesByPost[postId] || []
  const start = (page - 1) * size
  const end = start + size
  const records = postReplies.slice(start, end)

  return {
    records,
    total: postReplies.length,
    pages: Math.ceil(postReplies.length / size),
    current: page,
    size,
  }
}

// 模拟点赞
export const mockToggleLike = (postId: number, currentLiked: boolean): { liked: boolean; likedTimes: number } => {
  const post = mockPosts.find((p) => p.id === postId)
  if (post) {
    post.isLiked = !currentLiked
    if (post.isLiked) {
      post.likedTimes += 1
    } else {
      post.likedTimes = Math.max(0, post.likedTimes - 1)
    }
    return {
      liked: post.isLiked,
      likedTimes: post.likedTimes,
    }
  }
  return {
    liked: false,
    likedTimes: 0,
  }
}
