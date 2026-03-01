<template>
  <div class="background flex flex-col items-center">
    <!-- 顶部占位区 -->
    <HeroComponent background-url="/cpdc-platform/collections/banner.png" title-color="primary" />
    <!-- 藏品展示区 -->
    <main class="back min-h-[80vh] w-full max-w-[1600px] px-4 pb-8 md:px-8 lg:px-16">
      <!-- 索引条 -->
      <div class="flex justify-between py-4 md:py-8">
        <div class="flex gap-3 md:gap-6">
          <FilterButton ref="duringFilterRef" name="时代" :items="duringLists" />
          <FilterButton ref="typeFilterRef" name="分类" :items="typeLists" />
        </div>
        <SearchBar ref="searchBarRef" @search-clicked="getCollectionsList" />
      </div>

      <!-- 瓷器展示 -->
      <div class="flex flex-wrap gap-4">
        <div
          class="w-full cursor-pointer md:w-[calc((100%-1rem)/2)] lg:w-[calc((100%-2rem)/3)]"
          v-for="(collection, index) of collectionsList"
          :key="index"
          @click="goToDetail(collection.id)"
        >
          <div
            class="bg-secondary flex h-70 w-full items-center justify-center overflow-hidden rounded-md"
          >
            <img class="h-full object-cover" :src="collection.image" :alt="collection.imageAlt" />
          </div>
          <div class="py-3">
            <h2 class="text-primary mb-1 text-xl font-bold">{{ collection.name }}</h2>
            <div class="text-secondary-600 text-md">{{ collection.title }}</div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <Pagination
        v-if="totalPages > 1"
        :current-page="pageCount"
        :total-pages="totalPages"
        :total="total"
        @page-change="handlePageChange"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import HeroComponent from '@/components/Hero/HeroComponent.vue'
import FilterButton from './components/FilterButton.vue'
import SearchBar from './components/SearchBar.vue'
import Pagination from '@/components/Pagination.vue'
import { getExhibitions } from '@/apis/exhibitionApi'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { ExhibitionsRecord } from '@/types/api.type'
import type { FilterItemType } from './components/FilterButton.vue'

const router = useRouter()

const duringLists: FilterItemType[] = [
  {
    name: '全部',
    value: undefined,
  },
  {
    name: '清代康熙末年（1662 — 1722年）——萌芽时期',
    value: 1,
  },
  {
    name: '清代雍正年间（1723 — 1735）——初具风貌',
    value: 2,
  },
  {
    name: '清代乾隆年间（1736 — 1796）——发展成熟',
    value: 3,
  },
  {
    name: '嘉庆道光年间（1796 — 1850年）——转型时期',
    value: 4,
  },
  {
    name: '清末民国（1851 — 1949年）——日渐式微',
    value: 5,
  },
  {
    name: '当代（1950至今）——恢复发展',
    value: 6,
  },
]

const typeLists: FilterItemType[] = [
  {
    name: '全部',
    value: undefined,
  },
  {
    name: '纹盘',
    value: 1,
  },
  {
    name: '纹盆',
    value: 2,
  },
  {
    name: '纹瓶',
    value: 3,
  },
  {
    name: '纹碗',
    value: 4,
  },
  {
    name: '纹蝶',
    value: 5,
  },
  {
    name: '其他',
    value: 6,
  }
]

const collectionsList = ref<ExhibitionsRecord[]>([])
const searchBarRef = ref<InstanceType<typeof SearchBar>>()
const duringFilterRef = ref<InstanceType<typeof FilterButton>>()
const typeFilterRef = ref<InstanceType<typeof FilterButton>>()

const pageCount = ref(1)
const totalPages = ref(0)
const total = ref(0)

const getCollectionsList = async () => {
  const keyword = searchBarRef.value ? searchBarRef.value.serachContent : undefined

  // 如果存在 keyword，重置筛选条件
  if (keyword) {
    typeFilterRef.value?.reset()
    duringFilterRef.value?.reset()
  }

  const type = typeFilterRef.value?.activeItemValue as number | undefined
  const during = duringFilterRef.value?.activeItemValue as number | undefined

  const res = await getExhibitions(
    keyword,
    pageCount.value,
    24, // 默认每页24个
    type,
    during,
  )

  collectionsList.value = res.data.records
  totalPages.value = res.data.pages
  total.value = res.data.total
}

const handlePageChange = (page: number) => {
  pageCount.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
  getCollectionsList()
}

const goToDetail = (id: number) => {
  router.push(`/collections/${id}`)
}

onMounted(() => getCollectionsList())

watch(
  [() => duringFilterRef.value?.activeItemValue, () => typeFilterRef.value?.activeItemValue],
  () => {
    getCollectionsList()
  },
)
</script>

<style scoped>
.background {
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)),
    url('/cpdc-platform/herobg.png');

  background-position: center;
  overflow: hidden;
}
</style>
