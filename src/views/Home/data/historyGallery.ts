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
        name: '清乾隆广彩开光人物故事纹狮钮盖瓶',
        attribute: '',
        description: '色彩艳丽、工艺精湛，是乾隆时期外销瓷精品。',
        during: '',
        offsetY: '-2rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/7d5549789985362d9487fbb3b1b48f74508e7c23.png',
          alt: '广彩瓷1',
        },
      },
      {
        name: '清乾隆广彩西洋人物纹大碗',
        attribute: '高11.5厘米，口径26.8厘米，足径11.5厘米',
        description: '此碗以丰富色彩描绘西洋人物等图案，工艺精湛，是清乾隆广彩瓷器的代表之作。',
        during: '',
        offsetY: '1rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/9e6b648a7db3484b423e4b2e7fdee554405548d5.png',
          alt: '广彩瓷2',
        },
      },
      {
        name: '广彩纹章花卉纹大盘',
        attribute: '高5.4厘米，口径37.8厘米，足径22厘米',
        description: '彩绘线条干练流畅，融合五彩技法，体现出较为鲜明的康熙时期特点。',
        during: '',
        offsetY: '3rem',
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
    collections: [
      {
        name: '广彩描金纹章花卉小碟',
        attribute: '高3厘米，口径15.7厘米，足径10.3厘米',
        description:
          '敞口，浅壁圆弧腹，圈足。碟沿绘矾红描金法螺、卷轴、垂柳、花卉及鲤鱼龙门等吉祥图案。',
        during: '',
        offsetY: '2rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/third/52928452b181cbf7aba4bc9d5879b1b775d4910c.png',
          alt: '广彩瓷1',
        },
      },
      {
        name: '广彩开光人物纹瓶',
        attribute: '高36.6厘米 ，口径17厘米，底径14厘米',
        description: '金彩甚少，只在又沿锦 带中绘五瓣金花，具有初期广彩瓷画的特征。',
        during: '',
        offsetY: '3.5rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/third/f08ef84ec538a0b75836589bdf3c226c1cb6df6a.png',
          alt: '广彩瓷2',
        },
      },
      {
        name: '广彩描金纹章折枝花卉纹盘',
        attribute: '高3厘米，口径22.5厘米，足径12.5厘米',
        description: '效果极为突出，色泽浓艳，盘的背面保留了18世纪早期的铁红彩折枝花卉纹。',
        during: '',
        offsetY: '0rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/third/8085c2f36bfd673585e4cbd6da0e170e86092d66.png',
          alt: '广彩瓷3',
        },
      },
    ],
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
    collections: [
      {
        name: '广彩花鸟纹茶盘',
        attribute: '高2.5厘米，口径21厘米，底径12厘米',
        description: '题纹饰为牡丹、菊花、蝴蝶、雉鸟，绘画精工流畅，颇具地方特色。',
        during: '',
        offsetY: '-1rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/first/2f2a14d97d34fb94767bb57de319f7796d5d6bf2.png',
          alt: '广彩瓷1',
        },
      },
      {
        name: '广彩花卉纹碗',
        attribute: '高11.3厘米，口径22.7厘米，底径14厘米',
        description: '口沿与圈足各绘红彩卷草纹一周，腹部绘山、石、花卉，纹饰粗犷活泼。',
        during: '',
        offsetY: '4rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/first/1957f4098e6994c0bfe1843d0537171fbc42067c.png',
          alt: '广彩瓷2',
        },
      },
      {
        name: '广彩花卉纹六棱扁瓶',
        attribute: '高29厘米，口径5厘米，底径8.5厘米',
        description: '瓶两面开光内绘折枝花卉，其余各面点缀小折枝花。',
        during: '',
        offsetY: '1rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/first/c808ef3ebfbb64718ecdcbb30fcb782c6f6e9b43.png',
          alt: '广彩瓷3',
        },
      },
    ],
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
    collections: [
      {
        name: '广彩干大红花卉纹盘',
        attribute: '高2.9厘米，口径20.7厘米，足径13.5厘米',
        description: '折沿，浅弧壁，卧足。全器以干大红菲茨休纹样装饰。',
        during: '',
        offsetY: '-1rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/second/4bbf692c91b02d65da279216e413fc34ccf5c21a.png',
          alt: '广彩瓷1',
        },
      },
      {
        name: '广彩纹章人物纹汤窝、托碟',
        attribute:
          '窝通高27厘米:口径27厘米x20.5厘米，足径20.6厘米x15.6厘米，托碟高4.6厘米，口径36.5厘米x29.5厘米，底径26.2厘米x19.3厘米',
        description:
          '这件汤窝是英国考尔菲尔德(Caulfeild)家族约1825年定制套装餐具中的一件，绘制精美、保存完好。',
        during: '',
        offsetY: '-3rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/second/61135e5117e4043b168b9a5394bd4fb514985180.png',
          alt: '广彩瓷2',
        },
      },
      {
        name: '广彩描金开窗纹章山水纹盘',
        attribute: '高4.3厘米，口径24.8厘米，足径13厘米',
        description:
          '此器绘制的纹章图案由其使用者本人设计，极为罕见，以一对坐在云端的小天使作为纹章的护像，小天使伸手将冠冕托在盾牌之上。',
        during: '',
        offsetY: '2rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/second/679bb59f76538df2ae6e44f9a5712505f5edf9e2.png',
          alt: '广彩瓷3',
        },
      },
    ],
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
    collections: [
      {
        name: '广彩花鸟纹盘',
        attribute: '高2.3厘米，口径20.1厘米，底径 14厘米',
        description:
          '盘内壁饰锦带纹⼀周，内底绘山石、牡丹 、竹子、孔雀 、蝴蝶。纹饰华丽，是咸丰时期的代表作。',
        during: '',
        offsetY: '-2rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/forth/515c3e0158d9a7faa786024eb996605c01c02099.png',
          alt: '广彩瓷1',
        },
      },
      {
        name: '广彩八方形双耳花插',
        attribute: '高25 .5厘米， 口径17.9厘米，底径16 .5厘米',
        description:
          '足、盖部绘花带形开光，与主题纹饰相呼应。整体构思巧妙，纹饰鲜艳夺目，为广彩成熟期的代表作。',
        during: '',
        offsetY: '2rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/forth/77a5918264f8070cf5063cd17b4e9bcbc7756dd9.png',
          alt: '广彩瓷2',
        },
      },
      {
        name: '广彩人物纹暖盆',
        attribute: '高18厘米，口径29 .4厘米，底径25 .7厘米',
        description: '盖面开光绘人物故事、山水风景。盆内心绘人物爱情故事，外壁绘杂 锦花。',
        during: '',
        offsetY: '-1rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/forth/819f78cb351c039dab4841b7d70aa89ca58100ce.png',
          alt: '广彩瓷3',
        },
      },
    ],
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
    collections: [
      {
        name: '广彩花鸟雄鸡纹盘',
        attribute: '高7.5厘米，口径40.6厘米',
        description: '图案精美，色彩绚丽，为当代广彩艺人司徒宁先生的杰作。',
        during: '',
        offsetY: '0rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/fifth/340159f49c88e0c8b86920d472a961bfb1fa63d2.png',
          alt: '广彩瓷1',
        },
      },
      {
        name: '广彩大观园双狮耳瓣口瓶',
        attribute: '高61.厘米，口径21厘米，底径18厘米',
        description:
          '腹部主题纹饰为《红楼梦》大观园人物故事。整体纹饰布局严谨,画工精细，是广彩工艺大师赵国垣的精心之作。',
        during: '',
        offsetY: '2rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/fifth/f3565ec5f1f9ee8692e0b0d0af5cea486a6b67c9.png',
          alt: '广彩瓷2',
        },
      },
      {
        name: '广彩满园丽影图瓶',
        attribute: '高42厘米，口径15.7厘米，底径16.5 厘米',
        description:
          '造型似一个亭亭玉立的少女。瓶身满饰花卉为地,腹部主题纹饰为人物故事。此瓶是广彩艺人赵桂贞女士的代表作。',
        during: '',
        offsetY: '-1.5rem',
        img: {
          src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/home/lishichanglang/fifth/197d0337c8ab58599bcd6ae19947f095f1ce669b.png',
          alt: '广彩瓷3',
        },
      },
    ],
  },
]
