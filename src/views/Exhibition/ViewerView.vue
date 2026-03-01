<script setup lang="ts">
import ViewerComponent from '@/components/Viewer/ViewerComponent.vue'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const id = computed(() => Number(route.params.id))

const caption = computed(() => {
  switch (id.value) {
    case 1:
      return '工坊主题展厅'
    case 2:
      return '发展脉络展厅'
    case 3:
      return '华彩新章展厅'
    default:
      return '展厅'
  }
})
</script>

<template>
  <div class="relative h-[calc(100vh-5rem)] w-full">
    <ViewerComponent
      :id="id"
      :caption="caption"
    />
  </div>
</template>

<style scoped></style>
