import type { CollectionDataType } from '@/types/collection_data'

export interface HistoryGallerySection {
  title: string
  themeColor: string
  secondaryThemeColor: string
  description: string
  descriptionEn: string
  backgroundImage: string
  collections: CollectionDataType[]
}

export const themeColors = [
  '#45695d', // 深绿色
  '#846244', // 棕色
  '#93443f', // 深红色
  '#ad9445', // 金黄色
  '#483e51', // 深紫色
  '#4e6070', // 蓝灰色
]

export const secondaryThemeColors = [
  '#839991', // 浅绿色
  '#a99177', // 浅棕色
  '#998683', // 浅红色
  '#ada98d', // 浅黄色
  '#7a77a9', // 浅紫色
  '#779da9', // 浅蓝色
]

export const historyGalleryData: HistoryGallerySection[] = [
  {
    title: '清代康熙末年 (1662-1722年) ',
    themeColor: themeColors[0],
    secondaryThemeColor: secondaryThemeColors[0],
    description:
      '广彩始于此时，借鉴西洋珐琅彩与景德镇彩瓷技艺。为适应外销，初具绚丽金彩、构图饱满的特色。',
    descriptionEn:
      'The 1950s were an important period in Chinese history, and the beginning of the Chinese industrial revolution.',
    backgroundImage: '/historyGallery/history-gallery-bg-1.png',
    collections: [
      {
        name: '广彩瓷1',
        attribute: '尺寸：120mm x 80mm',
        description: '这是一种广彩瓷，尺寸为120mm x 80mm。',
        during: '1662-1722年',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/7d5549789985362d9487fbb3b1b48f74508e7c23.png',
          alt: '广彩瓷1',
        },
      },
      {
        name: '广彩瓷2',
        attribute: '尺寸：120mm x 80mm',
        description: '这是一种广彩瓷，尺寸为120mm x 80mm。',
        during: '1662-1722年',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/9e6b648a7db3484b423e4b2e7fdee554405548d5.png',
          alt: '广彩瓷2',
        },
      },
      {
        name: '广彩瓷3',
        attribute: '尺寸：120mm x 80mm',
        description: '这是一种广彩瓷，尺寸为120mm x 80mm。',
        during: '1662-1722年',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/31246f7b908ec9e7c892805c459c314b179ff47a.png',
          alt: '广彩瓷3',
        },
      },
    ],
  },
  {
    title: '清代雍正年间 (1723-1735年) ',
    themeColor: themeColors[1],
    secondaryThemeColor: secondaryThemeColors[1],
    description:
      '风格承袭明末清初的雅致，纹样多中式传统花鸟人物，釉色清新，笔法精细，为鼎盛期奠定基础。',
    descriptionEn:
      'The 1950s were an important period in Chinese history, and the beginning of the Chinese industrial revolution.',
    backgroundImage: '/historyGallery/history-gallery-bg-2.png',
    collections: [],
  },
  {
    title: '清代乾隆年间 (1736-1795年) ',
    themeColor: themeColors[2],
    secondaryThemeColor: secondaryThemeColors[2],
    description:
      '广彩的黄金时代。盛行“织金地”与“开窗”人物故事纹，大量绘制欧洲家族徽章，形成中西合璧的独特风格。',
    descriptionEn:
      'The 1950s were an important period in Chinese history, and the beginning of the Chinese industrial revolution.',
    backgroundImage: '/historyGallery/history-gallery-bg-3.png',
    collections: [],
  },
  {
    title: '嘉庆道光年间 (1796-1850年) ',
    themeColor: themeColors[3],
    secondaryThemeColor: secondaryThemeColors[3],
    description:
      '式多奇巧、岁无定样”的鼎盛期。构图更繁密，金彩更奢华，广彩独有的绚烂华丽风格至此完全成熟。',
    descriptionEn:
      'The 1950s were an important period in Chinese history, and the beginning of the Chinese industrial revolution.',
    backgroundImage: '/historyGallery/history-gallery-bg-4.png',
    collections: [],
  },
  {
    title: '清末民国 (1851-1949年) ',
    themeColor: themeColors[4],
    secondaryThemeColor: secondaryThemeColors[4],
    description:
      '受时局动荡影响，外销市场萎缩，风格趋于程式化。虽技艺仍在，但创新不足，为传承中的低潮期。',
    descriptionEn:
      'The 1950s were an important period in Chinese history, and the beginning of the Chinese industrial revolution.',
    backgroundImage: '/historyGallery/history-gallery-bg-5.png',
    collections: [],
  },
  {
    title: '当代 (1950年至今) ',
    themeColor: themeColors[5],
    secondaryThemeColor: secondaryThemeColors[5],
    description:
      '广彩被列入非物质文化遗产。在政府扶持下，成立彩瓷厂和研究室，技艺得以抢救、恢复并走向创新发展的新道路。',
    descriptionEn:
      'The 1950s were an important period in Chinese history, and the beginning of the Chinese industrial revolution.',
    backgroundImage: '/historyGallery/history-gallery-bg-6.png',
    collections: [],
  },
]
