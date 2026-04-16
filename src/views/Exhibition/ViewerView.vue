<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ViewerComponent from '@/components/Viewer/ViewerComponent.vue'
import { getHallSceneConfig } from '@/data/exhibitionScenes'

const route = useRoute()
const id = computed(() => Number(route.params.id))

const caption = computed(() => {
  const sceneConfig = getHallSceneConfig(id.value)
  if (sceneConfig) return sceneConfig.caption
  return '展厅'
})
</script>

<template>
  <div class="relative h-[calc(100vh-5rem)] w-full">
    <ViewerComponent :id="id" :caption="caption" />
  </div>
</template>

<style scoped></style>
