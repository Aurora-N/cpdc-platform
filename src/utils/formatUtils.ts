/**
 * 解析后端返回的图片字段
 * 兼容各种奇怪的格式，如 JSON 字符串、逗号分隔、带反引号等
 */
export const parseImages = (images: string | string[] | null | undefined): string[] => {
  if (!images) return []

  // 如果已经是数组，直接返回（但也需要清洗里面的字符串）
  if (Array.isArray(images)) {
    return images.map(cleanUrl).filter(Boolean)
  }

  // 如果是字符串
  if (typeof images === 'string') {
    // 1. 尝试 JSON 解析
    try {
      const parsed = JSON.parse(images)
      if (Array.isArray(parsed)) {
        return parsed.map(cleanUrl).filter(Boolean)
      }
    } catch (e) {
      // JSON 解析失败，继续后续处理
    }

    // 2. 如果 JSON 解析失败，或者解析出来不是数组
    // 使用正则提取所有可能的 URL
    // 匹配 http 或 https 开头的，直到遇到引号、空格、逗号、括号等结束符
    const urlRegex = /(https?:\/\/[^\s"',`\]\[]+)/g
    const matches = images.match(urlRegex)
    if (matches) {
      return matches.map(cleanUrl).filter(Boolean)
    }

    // 3. 如果正则也没匹配到，尝试逗号分隔
    return images.split(',').map(cleanUrl).filter(Boolean)
  }

  return []
}

/**
 * 清洗 URL 字符串
 * 去除首尾的空格、引号、反引号等
 */
const cleanUrl = (url: any): string => {
  if (typeof url !== 'string') return ''
  // 去除首尾的空格、引号(' " `)、转义符
  return url.replace(/^[\s"'`\\]+|[\s"'`\\]+$/g, '').trim()
}

/**
 * 格式化日期
 * 兼容后端返回的数组格式 [yyyy, MM, dd, HH, mm, ss] 和标准 ISO 字符串
 */
export const formatDate = (dateString: string | number[] | null | undefined): string => {
  if (!dateString) return ''

  let date: Date
  if (Array.isArray(dateString)) {
    // 处理数组格式 [2026, 2, 2, 18, 33, 50]
    // 后端返回的是 UTC 时间的数组，需要使用 Date.UTC 将其转换为本地时间对象
    const [year, month, day, hour, minute, second] = dateString as unknown as number[]
    // 月份从 0 开始
    date = new Date(Date.UTC(year, month - 1, day, hour, minute, second))
  } else {
    date = new Date(dateString as string)
  }

  // 检查日期是否有效
  if (isNaN(date.getTime())) return ''

  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) {
    return '刚刚'
  } else if (minutes < 60) {
    return `${minutes}分钟前`
  } else if (hours < 24) {
    return `${hours}小时前`
  } else if (days < 7) {
    return `${days}天前`
  } else {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
}
