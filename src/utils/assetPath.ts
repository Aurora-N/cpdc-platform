/**
 * 静态资源路径工具函数
 * 用于处理静态资源的完整路径，包含 base 前缀
 */

/**
 * 获取静态资源的完整路径
 * @param path 相对路径，例如 '/assets/images/logo.png'
 * @returns 包含 base 前缀的完整路径
 */
export function getAssetPath(path: string): string {
  // 确保路径以 / 开头
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  // 在开发环境中，base 通常是 '/'，在生产环境中是实际的 base 路径
  const basePath = __BASE_PATH__ || '/'

  // 如果 basePath 是 '/'，直接返回路径
  if (basePath === '/') {
    return normalizedPath
  }

  // 移除 basePath 末尾的 '/' 以避免双斜杠
  const cleanBasePath = basePath.endsWith('/') ? basePath.slice(0, -1) : basePath

  return `${cleanBasePath}${normalizedPath}`
}

/**
 * 获取 assets 目录下资源的完整路径
 * @param path assets 目录下的相对路径，例如 'images/logo.png'
 * @returns 包含 base 前缀的完整路径
 */
export function getAssetsPath(path: string): string {
  // 确保路径不以 / 开头（因为我们要添加 /assets/ 前缀）
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path
  return getAssetPath(`/assets/${normalizedPath}`)
}

/**
 * 获取当前的 base 路径
 * @returns base 路径
 */
export function getBasePath(): string {
  return __BASE_PATH__ || '/'
}
