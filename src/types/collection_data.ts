import type { ImageType } from './ui'

// 广彩瓷类型
export interface CollectionDataType {
  name: string
  attribute: string // 属性值：尺寸等
  description: string // 描述
  during: string // 产出年代
  img: ImageType
  offsetY?: string // Y轴垂直偏移量，例如 '-2rem', '10px'
}
