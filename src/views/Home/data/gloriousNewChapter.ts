export interface ChapterData {
  id: number
  title: string
  subtitle: string
  contentZh: string
  contentEn: string
  imageUrls: string[]
}

export const chapterDataList: ChapterData[] = [
  {
    id: 0,
    title: '华彩新章',
    subtitle: '广彩非遗传承人档案',
    contentZh:
      '以笔为骨，以釉为魂。聆听传承人讲述六十载描金岁月，揭秘百年广彩的师徒密码与守艺人生。',
    contentEn:
      'Brush as bone, glaze as soul. A national master, sixty years at their fingertips, shares the secrets of Guangcai and what it means to keep the flame alive.',
    imageUrls: [
      '/cpdc-platform/gloriousNewChapter/0-1.jpg',
      '/cpdc-platform/gloriousNewChapter/0-2.jpg',
      '/cpdc-platform/gloriousNewChapter/0-3.jpg',
    ],
  },
  {
    id: 1,
    title: '广彩调研计划',
    subtitle: '当遇见三百年非遗',
    contentZh: '学子深入作坊，用田野笔记、影像纪录片与AI纹样分析，重新定义传统技艺的未来。',
    contentEn:
      'Encountering 300 years of intangible cultural heritage: students go deep into the workshops, using field notes, documentaries and AI pattern analysis to redefine the future of traditional craftsmanship.',
    imageUrls: [
      '/cpdc-platform/gloriousNewChapter/1-1.png',
      '/cpdc-platform/gloriousNewChapter/1-2.png',
      '/cpdc-platform/gloriousNewChapter/1-3.png',
    ],
  },
  {
    id: 2,
    title: '当代广彩精品典藏',
    subtitle: '',
    contentZh:
      '从复刻清代外销瓷到创新元宇宙纹样，展出近百件突破性作品。可360°旋转鉴赏釉色，透视匠心层叠的笔触与时代印记。',
    contentEn:
      'From replicating Qing Dynasty export porcelain to innovating metaverse patterns, nearly 100 groundbreaking works are on display. Enjoy 360° rotating views to appreciate the glaze colors, and peer into the layered brushstrokes and timeless marks of craftsmanship.',
    imageUrls: [
      '/cpdc-platform/gloriousNewChapter/2-1.png',
      '/cpdc-platform/gloriousNewChapter/2-2.png',
      '/cpdc-platform/gloriousNewChapter/2-3.png',
    ],
  },
  {
    id: 3,
    title: '广彩文创设计工作室',
    subtitle: '广彩纹样闯入日常生活',
    contentZh: '联名耳机、星巴克杯、数字藏品...看设计师如何将“岭南金彩”解构为现代美学符号。',
    contentEn:
      'Cantonese Guangcai Patterns Invade Daily Life: Headphone Collaborations, Starbucks Cups, Digital Collectibles... See How Designers Deconstruct "Lingnan Golden Splendor" into Modern Aesthetic Symbols.',
    imageUrls: [
      '/cpdc-platform/gloriousNewChapter/3-1.png',
      '/cpdc-platform/gloriousNewChapter/3-2.png',
      '/cpdc-platform/gloriousNewChapter/3-3.png',
    ],
  },
]
