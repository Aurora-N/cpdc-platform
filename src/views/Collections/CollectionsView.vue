<template>
  <div class="flex flex-col items-center">
    <!-- 顶部占位区 -->
    <HeroComponent
      :title="heroTitle"
      :sub-title="heroSubTitle"
      background-url="/cpdc-platform/exhibition/2.png"
      title-color="primary"
    />
    <!-- 藏品展示区 -->
    <main class="max-w-[1600px] pb-8 px-8 md:px-16 w-full">
      <!-- 索引条 -->
      <div class="flex justify-between py-8">
        <div class="flex gap-6">
          <FilterButton name="时代" />
          <FilterButton name="分类" />
        </div>
        <SearchButton />
      </div>

      <!-- 瓷器展示 -->
      <div class="flex flex-wrap gap-4">
        <div
          class="w-full md:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-2rem)/3)] mb-4 border-1 border-white hover:border-primary duration-200"
          v-for="(collection, index) of collectionsList"
          :key="index"
        >
          <div class="w-full h-90 overflow-hidden flex justify-center items-center">
            <img
              class="object-cover w-full h-full"
              :src="collection.img.src"
              :alt="collection.img.alt"
            />
          </div>
          <div class="p-4">
            <h2 class="text-primary text-2xl font-bold">{{ collection.name }}</h2>
            <div>{{ collection.attribute }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import type { CollectionDataType } from '@/types/collection_data'
import { ref } from 'vue'
import HeroComponent from '@/components/Hero/HeroComponent.vue'
import FilterButton from './components/FilterButton.vue'
import SearchButton from './components/SearchButton.vue'

const heroTitle = ref<string>('广彩瓷藏品库')
const heroSubTitle = ref<string>('发现广彩之美')

const collectionsList: CollectionDataType[] = [
  {
    name: '广彩纹章花卉纹大盘',
    attribute: '高5.4厘米 口径37.8厘米 足径22厘米',
    description: `敞口，浅壁圆弧腹，圈足，器型硕大工整。外层边饰绘折枝花卉纹，中部围绕定购者的个人纹章图案绘四
组折枝花卉，彩绘线条干练流畅，融合五彩技法，体现出较为鲜明的康熙时期特点。早期广彩使用的颜料，是
明代三彩、五彩的传统颜料与外国珐琅彩料融合创造而来。五彩瓷产品的外销时间不长，大约从1730年开始逐
步消失，逐渐被粉彩、广彩取代。
此盘为英国沃恩（Vaughan）家族约1710年定制，属英国东印度公司高层人士在中国定制的早期广彩产品
代表。值得注意的是，盘中部绘制的纹章盾牌上方的盔饰图案（指纹章中头盔上方的装饰物，此处为半身狮
像）方向绘成了反向。由此推断，此器极有可能是根据定购者提供的私人纹章印模绘制，印模中展现的纹章图
案均为反向，中国瓷匠并不知情，按样板绘制成反向纹章图案。`,
    during: '清康熙',
    img: {
      src: '/cpdc-platform/collections/0.png',
      alt: '广彩纹章花卉纹大盘',
    },
  },
  {
    name: '广彩纹章花卉纹大盘',
    attribute: '高6.4厘米 口径38.5厘米 足径23.6厘米',
    description: `敞口，浅壁圆弧腹，圈足。内弧壁绘四组折枝花卉纹，里层边饰为铁红彩描金卷草纹锦地四开窗纹，开窗
内绘杂宝纹，盘心绘定购者纹章。盘背面边沿绘铁红如意垂云头纹一周，弧壁处绘四组铁红折枝花卉。此盘约
在1720年定制，定购者是伦敦富商、英国东印度公司董事丹尼斯•迪特里（Dennis Dutry）爵士。18世纪30年代
的纹章瓷产品中有不少都是为伦敦富商定制的，17世纪90年代法国胡格诺派工匠和商人为寻求宗教庇护来到英
国，为伦敦地区积累了大量的社会财富，他们中有许多人曾在广州定制纹章瓷。此盘的定购者迪特里的妻子是
波尔多一位胡格诺派酒商的女儿。
此盘盘心的纹章图案中，在小盾牌的上方还绘有一只红色的手擎，在英国纹章学中红色手掌是准男爵的
标识，此盘的定购者1716年获封准男爵，1728年逝世，此盘仍以康熙晚期采用的具有透明质感的彩料即五彩绘
制，而不是后来出现的不透明料，结合定购者的信息及彩料的时代特点，可判断其烧制年代约在1720年。`,
    during: '清康熙',
    img: {
      src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/firstStage/image1.png',
      alt: '广彩纹章花卉纹大盘',
    },
  },
  {
    name: '广彩描金纹章花卉纹盘',
    attribute: '高2.5厘米 口径22厘米 足径12厘米',
    description: `板沿，浅腹，卧足。盘沿绘制四组折枝牡丹、菊花纹，间设四个小开窗，开窗内绘定购者纹章的冠冕和盔
饰图案，盘中心绘完整的纹章图案，纹章绘制醒目工整，占据较大区域，体现了18世纪初期个性化定制纹章瓷
的时代特点。
此盘为英国的托马斯•比特（Thomas Pitt）男爵定制。托马斯1717年结婚，盘中绘制的正是婚后男女双方
联姻的纹章。纹章盾牌之上绘制的是英国男爵冠冤，托马斯1719年受封为伦敦德里男爵，由此推断该器的烧制
年份应该不早于1720年。托马斯所在的比特家族历史悠久，名人辈出，曾有族人获封伯爵、出任英国首相，一
度成为英国最具政治影响力的家族。
此处纹章中冠冕的绘制色调值得注意，应是中国瓷匠利用矾红加上黑色调成，并非定购者所期望的体现冠
冕中天鹅绒质感的粉红或紫红色调。在如此重要的订单中无法按客户要求绘制色彩的原因，极有可能是当时的
技术尚无法实现，当时的中国釉上彩瓷绘制技法仍以呈现透明质感的“硬彩”即五彩为主，较难呈现具有过波
效果的色调。`,
    during: '清康熙',
    img: {
      src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/firstStage/image2.png',
      alt: '广彩描金纹章花卉纹盘',
    },
  },
  {
    name: '广彩描金纹章纹大盘',
    attribute: '高5.8厘米 口径39.3厘米 足径21.7厘米',
    description: `折沿，弧腹略深，卧足。盘边沿外层绘折枝花卉杂宝纹，折沿处绘八方锦地四开窗纹，盘心绘定购者纹
章。这件深腹大盘是英国约榆•兰伯特（John Lambert）爵士约1722年定制的纹章瓷餐具中的一件。此盘的内外
多层边饰仍主要采用铁红彩加描金的技法绘制，但盘中心的纹章图案却出现了新型的胭脂红彩，尤其是纹章后
牌外围厚重的披幔已经绘成不透明的紫红色，更接近于天鹅绒披幔的质感和色调。这说明胭脂红彩在1722年前
后已经在外销瓷产品中应用。
此类18世纪早期出现的体量较大盘盆，尤其是折沿深盘的功用尚未确定。一般认为用作玫瑰水盘，在进餐
期间承接玫瑰花瓣水，供进餐者洗手。`,
    during: '清康熙',
    img: {
      src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/firstStage/image3.png',
      alt: '广彩纹章花卉纹大盘',
    },
  },
  {
    name: '青花广彩纹章龙纹盘',
    attribute: '高2.5厘米 口径22.5厘米 足径11.4厘米',
    description: `板沿，浅弧腹，圈足，整器采用釉下青花、釉上彩绘加描金的形式，盘的口沿外层和折沿处以铁红描金绘制卷草纹、
锦地四开窗等多层边饰，板沿处以釉下青花绘制龙风纹。盘中心绘制的是英国乔蒙德利（Cholmondeley）家族与另一家族
联姻的纹章。
该盘采用釉下青花绘制的龙凤纹结合铁红描金卷草纹作为边饰，体现了18世纪30年代外销瓷的典型边饰特征，尤其是
青花龙风纹边饰，目前仅发现不超过10套纹章瓷采用，且均为1720年前后定制的产品。这些个性化定制的瓷器所展现的时
代风格为同时期外销瓷的断代提供了难得的依据。`,
    during: '清康熙',
    img: {
      src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/firstStage/image4.png',
      alt: '青花广彩纹章龙纹盘',
    },
  },
  {
    name: '广彩描金纹章纹盘',
    attribute: '高2.4厘米 口径22厘米 足径12厘米',
    description: `板沿，浅腹，卧足。盘的折沿处仅以内外两道描金边条作装饰，盘心设一正圆形开窗图案，开窗内以蓝彩为地，上绘
描金花体字母“S.W."，器沿正上方绘英国温德尔（Winder）家族纹章，其用彩及整体品质与1720年前后的伊万里风格的
外销瓷有相似之处。此类仅绘制定购者纹草或姓名缩写字母而无其他装饰纹样的产品，应是根据定购者的特要求专门烧制的。`,
    during: '清康熙',
    img: {
      src: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/firstStage/image5.png',
      alt: '广彩描金纹章纹盘',
    },
  },
]
</script>
