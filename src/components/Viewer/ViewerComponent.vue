<template>
  <div class="relative h-full w-full">
    <div ref="viewerContainer" class="h-full w-full" />

    <div
      v-if="showFogMask"
      class="pointer-events-none absolute right-0 bottom-0 left-0 z-[990] h-[30%] bg-gradient-to-t from-[#07101b]/88 via-[#0b1a2d]/52 to-transparent"
    />
    <div
      v-if="showFogMask"
      class="pointer-events-none absolute top-0 right-0 left-0 z-[990] h-[20%] bg-gradient-to-b from-[#050a12]/82 via-[#0a1524]/40 to-transparent"
    />

    <div
      v-if="props.debugMode"
      class="absolute top-5 right-5 z-[1000] max-h-[70vh] w-[320px] overflow-auto rounded-md bg-black/80 p-4 text-white"
    >
      <div class="mb-2 text-sm font-bold">调试坐标</div>
      <div v-if="coordinateHistory.length === 0" class="text-xs text-white/70">
        点击全景任意区域可记录当前视角坐标
      </div>
      <div
        v-for="(coord, index) in coordinateHistory"
        :key="`${coord.timestamp}-${index}`"
        class="mb-2 rounded bg-white/10 p-2 text-xs"
      >
        <div class="font-medium">点击 {{ index + 1 }} ({{ coord.timestamp }})</div>
        <div class="text-[11px] text-white/70">
          yaw: {{ toDegrees(coord.yaw) }}°, pitch: {{ toDegrees(coord.pitch) }}°
        </div>
        <div class="mt-1 rounded bg-white/10 p-1 font-mono text-[11px]">
          position: { yaw: {{ coord.yaw }}, pitch: {{ coord.pitch }} }
        </div>
        <button
          class="mt-2 w-full cursor-pointer rounded bg-[#27ae60] px-2 py-1 text-[11px] text-white hover:bg-[#219a52]"
          @click="copyCoordinate(coord.yaw, coord.pitch)"
        >
          复制位置代码
        </button>
      </div>
      <button
        class="mt-1 w-full cursor-pointer rounded bg-[#e67e22] px-2 py-1 text-xs text-white hover:bg-[#d35400]"
        @click="clearCoordinates"
      >
        清空坐标
      </button>
    </div>

    <div
      v-if="activeImageModal"
      class="absolute inset-0 z-[9999] flex items-center justify-center bg-[radial-gradient(circle_at_18%_10%,rgba(42,70,108,0.38),rgba(4,10,18,0.94))] p-2 sm:p-4"
      @click.self="closeArtifactModal"
    >
      <div
        class="relative flex h-[96vh] w-full max-w-[1660px] flex-col overflow-hidden rounded-[24px] border border-[#d8b986]/22 bg-[linear-gradient(158deg,rgba(8,20,36,0.96),rgba(6,14,25,0.96))] text-white shadow-[0_24px_95px_rgba(0,0,0,0.62)] backdrop-blur-[8px] sm:h-[94vh]"
      >
        <div
          class="pointer-events-none absolute inset-x-0 top-0 h-20 bg-[linear-gradient(to_bottom,rgba(246,208,138,0.08),rgba(246,208,138,0))]"
        />
        <button
          class="absolute top-4 right-4 z-20 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/16 bg-black/45 text-[22px] text-white/80 transition hover:border-white/36 hover:bg-black/65 hover:text-white"
          aria-label="关闭资料图"
          @click="closeArtifactModal"
        >
          ×
        </button>

        <div
          class="relative flex items-start justify-between gap-4 border-b border-[#d8b986]/16 px-5 py-4 pr-20 sm:px-6 sm:py-5"
        >
          <div class="min-w-0">
            <div
              class="inline-flex items-center rounded-full border border-[#d8b986]/28 bg-[#d8b986]/9 px-3 py-[3px] text-[11px] tracking-[0.14em] text-[#e4cfab]"
            >
              展厅资料
            </div>
            <div
              class="mt-2 truncate font-['Noto_Serif_SC',serif] text-[25px] leading-none font-semibold tracking-[0.08em] text-[#f6e6c9] sm:text-[28px]"
            >
              {{ activeImageModal.title }}
            </div>
            <div class="mt-2 text-sm text-white/66">
              {{
                activeHotspots.length > 0
                  ? '点击图中瓷器查看完整介绍，移动端可直接使用下方列表。'
                  : '当前资料图仅支持查看大图。'
              }}
            </div>
          </div>
          <div
            v-if="activeHotspots.length > 0"
            class="hidden shrink-0 rounded-full border border-[#d8b986]/32 bg-[#d8b986]/10 px-4 py-[5px] text-xs tracking-[0.12em] text-[#f1ddb9] sm:block"
          >
            热点 {{ activeHotspots.length }}
          </div>
        </div>

        <div
          class="grid min-h-0 flex-1"
          :class="activeHotspots.length > 0 ? 'lg:grid-cols-[minmax(0,1fr)_350px]' : ''"
        >
          <div class="relative min-h-0 overflow-auto bg-[#050f1c] p-3 sm:p-5">
            <div
              class="relative mx-auto w-fit max-w-full rounded-[18px] border border-[#d8b986]/20 bg-[#0a1626] p-2 shadow-[0_18px_48px_rgba(0,0,0,0.45)] sm:p-3"
            >
              <img
                :src="activeImageModal.imageUrl"
                :alt="activeImageModal.title"
                class="block max-h-[74vh] max-w-full rounded-xl object-contain"
              />

              <button
                v-for="(hotspot, index) in activeHotspots"
                :key="hotspot.id"
                :style="getHotspotStyle(hotspot)"
                class="hotspot-hit-area group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ffe9b5] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1b2a]"
                :class="{ 'is-active': activeHotspotId === hotspot.id }"
                :aria-label="`查看 ${hotspot.artifact.title}`"
                :title="hotspot.artifact.title"
                @click.stop="selectArtifactHotspot(hotspot.id)"
              >
                <span class="hotspot-hit-area__frame" />
                <span class="hotspot-hit-area__pin">
                  {{ index + 1 }}
                </span>
                <span class="hotspot-hit-area__label">
                  {{ hotspot.artifact.title }}
                </span>
              </button>
            </div>

            <div
              v-if="activeHotspots.length > 0"
              class="pointer-events-none absolute right-5 bottom-4 rounded-full border border-[#d8b986]/28 bg-[#081524]/78 px-3 py-1 text-[11px] tracking-[0.08em] text-[#e4cfaa]"
            >
              轻触编号查看详情
            </div>
          </div>

          <div
            v-if="activeHotspots.length > 0"
            class="flex min-h-0 flex-col border-t border-[#d8b986]/14 bg-[#0b1b2d]/94 backdrop-blur-sm lg:border-t-0 lg:border-l"
          >
            <div class="border-b border-[#d8b986]/14 px-5 py-4 text-sm text-[#e9dcc2]">
              <div class="text-[11px] tracking-[0.14em] text-[#ccb38f]">
                {{ activeArtifactDescription ? '当前藏品' : '藏品导览' }}
              </div>
              <div class="mt-2 text-base font-semibold tracking-[0.06em] text-[#f6e8d0]">
                {{ activeArtifactDescription ? activeArtifactDescription.title : '请选择一个瓷器' }}
              </div>
              <button
                v-if="activeArtifactDescription"
                class="mt-3 cursor-pointer rounded-full border border-[#ccb38f]/35 px-3 py-1 text-xs text-[#f1e2c7] transition hover:border-[#f1d6a4]/65 hover:bg-[#d8b986]/10 hover:text-[#ffe9bf]"
                @click="clearSelectedArtifact"
              >
                取消选中
              </button>
            </div>

            <div class="min-h-0 flex-1 overflow-y-auto px-5 py-5">
              <div
                v-if="activeArtifactDescription"
                class="text-[14px] leading-7 whitespace-pre-line text-[#f5f1e8] sm:text-[15px]"
              >
                {{ activeArtifactDescription.content }}
              </div>
              <div
                v-else
                class="rounded-2xl border border-[#d8b986]/18 bg-[#091726]/72 p-4 text-[13px] leading-6 text-white/68"
              >
                点击左侧图片里的编号热点，或在下方列表选择一个器物，这里会显示完整介绍。
              </div>
            </div>

            <div class="border-t border-[#d8b986]/14 px-4 py-3">
              <div class="mb-2 px-1 text-xs tracking-[0.1em] text-[#c6af8d]">器物列表</div>
              <div class="max-h-[30vh] space-y-2 overflow-y-auto pr-1">
                <button
                  v-for="(hotspot, index) in activeHotspots"
                  :key="`list-${hotspot.id}`"
                  class="flex w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition-colors"
                  :class="
                    activeHotspotId === hotspot.id
                      ? 'border-[#e6c995]/70 bg-[#cda76d]/15 text-[#f7e4be]'
                      : 'border-[#d8b986]/16 bg-[#11283f]/44 text-white/76 hover:border-[#d8b986]/40 hover:bg-[#15334f]/62'
                  "
                  @click="selectArtifactHotspot(hotspot.id)"
                >
                  <span
                    class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold"
                    :class="
                      activeHotspotId === hotspot.id
                        ? 'bg-[#f2d7a8] text-[#513a1e]'
                        : 'bg-[#e2c28d]/16 text-[#f2d9ad]'
                    "
                  >
                    {{ index + 1 }}
                  </span>
                  <span class="truncate">{{ hotspot.artifact.title }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Viewer } from '@photo-sphere-viewer/core'
import { MarkersPlugin, type MarkerConfig } from '@photo-sphere-viewer/markers-plugin'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import {
  getExhibition1InteractiveImageConfig,
  type ArtifactHotspot,
  type Exhibition1InteractiveImageKey,
  type InteractiveImageConfig,
} from '@/data/exhibition1InteractiveImages'
import {
  getHallSceneConfig,
  getNodeConfig,
  type AngleValue,
  type HallSceneConfig,
  type PanoramaNodeConfig,
} from '@/data/exhibitionScenes'

interface CoordinateEntry {
  yaw: number
  pitch: number
  timestamp: string
}

interface NavigationMarkerData {
  kind: 'navigation'
  targetNodeId: string
}

interface ArtifactMarkerData {
  kind: 'artifact'
  title: string
  body?: string
  imageUrl?: string
  interactiveImageKey?: Exhibition1InteractiveImageKey
}

type MarkerPayload = NavigationMarkerData | ArtifactMarkerData

interface ManualArtifactSpot {
  id: string
  nodeId: string
  title: string
  imagePath: string
  interactiveImageKey?: Exhibition1InteractiveImageKey
  position: {
    yaw: AngleValue
    pitch: AngleValue
  }
}

interface ArtifactImageModalState {
  title: string
  imageUrl: string
  interactiveImage: InteractiveImageConfig | null
}

const props = defineProps({
  id: {
    type: Number,
    default: 1,
  },
  panoramaUrl: {
    type: String,
    default: '',
  },
  caption: {
    type: String,
    default: '展厅',
  },
  debugMode: {
    type: Boolean,
    default: false,
  },
})

const viewerContainer = ref<HTMLElement | null>(null)
const coordinateHistory = ref<CoordinateEntry[]>([])
const currentSceneConfig = ref<HallSceneConfig | null>(null)
const currentNodeId = ref('')
const isSwitching = ref(false)
const artifactMarkers = ref<MarkerConfig[]>([])
const activeImageModal = ref<ArtifactImageModalState | null>(null)
const activeHotspotId = ref<string | null>(null)

const manualArtifactSpotMap = new Map<number, ManualArtifactSpot[]>([
  [
    2,
    [
      {
        id: 'n1-ex1-1',
        nodeId: 'n1',
        title: '图文资料 1',
        imagePath: 'exhibition/exhibition1/1.png',
        interactiveImageKey: 'exhibition1-1',
        position: { yaw: 3.667188263456417, pitch: 0.3337821738533089 },
      },
      {
        id: 'n1-ex1-2',
        nodeId: 'n1',
        title: '图文资料 2',
        imagePath: 'exhibition/exhibition1/2.png',
        interactiveImageKey: 'exhibition1-2',
        position: { yaw: 6.004076366918024, pitch: 0.29184301075112984 },
      },
      {
        id: 'n1-ex1-3',
        nodeId: 'n1',
        title: '图文资料 3',
        imagePath: 'exhibition/exhibition1/3.png',
        interactiveImageKey: 'exhibition1-3',
        position: { yaw: 1.5223379745108323, pitch: 0.3584058394379823 },
      },
      {
        id: 'n2-ex1-4',
        nodeId: 'n2',
        title: '图文资料 4',
        imagePath: 'exhibition/exhibition1/4.png',
        interactiveImageKey: 'exhibition1-4',
        position: { yaw: 3.708887628190194, pitch: 0.21392179469566952 },
      },
      {
        id: 'n2-ex1-5',
        nodeId: 'n2',
        title: '图文资料 5',
        imagePath: 'exhibition/exhibition1/5.png',
        interactiveImageKey: 'exhibition1-5',
        position: { yaw: 4.860968247333351, pitch: 0.14831474918549126 },
      },
      {
        id: 'n2-ex1-6',
        nodeId: 'n2',
        title: '图文资料 6',
        imagePath: 'exhibition/exhibition1/6.png',
        interactiveImageKey: 'exhibition1-6',
        position: { yaw: 0.32882555325018153, pitch: 0.317510702691139 },
      },
    ],
  ],
  [
    3,
    [
      {
        id: 'main-ex2-1',
        nodeId: 'main',
        title: '图文资料 1',
        imagePath: 'exhibition/exhibition2/1.jpg',
        position: { yaw: 1.1307016599338002, pitch: 0.14357341807960156 },
      },
      {
        id: 'main-ex2-2',
        nodeId: 'main',
        title: '图文资料 2',
        imagePath: 'exhibition/exhibition2/2.jpg',
        position: { yaw: 1.419795303717428, pitch: 0.15054129406525418 },
      },
      {
        id: 'main-ex2-3',
        nodeId: 'main',
        title: '图文资料 3',
        imagePath: 'exhibition/exhibition2/3.jpg',
        position: { yaw: 1.7678585932181141, pitch: 0.1213400802235225 },
      },
      {
        id: 'main-ex2-4',
        nodeId: 'main',
        title: '图文资料 4',
        imagePath: 'exhibition/exhibition2/4.jpg',
        position: { yaw: 2.052851250080195, pitch: 0.10534457477345716 },
      },
      {
        id: 'main-ex2-5',
        nodeId: 'main',
        title: '图文资料 5',
        imagePath: 'exhibition/exhibition2/5.jpg',
        position: { yaw: 2.3213817015066427, pitch: 0.0969647139251344 },
      },
      {
        id: 'main-ex2-6',
        nodeId: 'main',
        title: '图文资料 6',
        imagePath: 'exhibition/exhibition2/6.jpg',
        position: { yaw: 2.4749212706368855, pitch: 0.0981226191400566 },
      },
      {
        id: 'main-ex2-7',
        nodeId: 'main',
        title: '图文资料 7',
        imagePath: 'exhibition/exhibition2/7.jpg',
        position: { yaw: 2.598697648073065, pitch: 0.09434216729778644 },
      },
    ],
  ],
  [
    1,
    [
      {
        id: 'main-ex3-1',
        nodeId: 'main',
        title: '图文资料 1',
        imagePath: 'exhibition/exhibition3/1.png',
        position: { yaw: 1.0718435115362304, pitch: 0.15519464001033034 },
      },
      {
        id: 'main-ex3-2',
        nodeId: 'main',
        title: '图文资料 2',
        imagePath: 'exhibition/exhibition3/2.png',
        position: { yaw: 1.4704584068388542, pitch: 0.2101822026318465 },
      },
      {
        id: 'main-ex3-3',
        nodeId: 'main',
        title: '图文资料 3',
        imagePath: 'exhibition/exhibition3/3.png',
        position: { yaw: 1.8848122077054872, pitch: 0.19148851972190473 },
      },
      {
        id: 'main-ex3-4',
        nodeId: 'main',
        title: '图文资料 4',
        imagePath: 'exhibition/exhibition3/4.png',
        position: { yaw: 2.1994398222365685, pitch: 0.09861668631014409 },
      },
      {
        id: 'main-ex3-5',
        nodeId: 'main',
        title: '图文资料 5',
        imagePath: 'exhibition/exhibition3/5.png',
        position: { yaw: 2.3837302438967884, pitch: 0.14912498620458425 },
      },
      {
        id: 'main-ex3-6',
        nodeId: 'main',
        title: '图文资料 6',
        imagePath: 'exhibition/exhibition3/6.png',
        position: { yaw: 2.6926819678035523, pitch: 0.1679555961488517 },
      },
      {
        id: 'main-ex3-7',
        nodeId: 'main',
        title: '图文资料 7',
        imagePath: 'exhibition/exhibition3/7.png',
        position: { yaw: 3.0486880789516855, pitch: 0.1665677704429409 },
      },
      {
        id: 'main-ex3-8',
        nodeId: 'main',
        title: '图文资料 8',
        imagePath: 'exhibition/exhibition3/8.png',
        position: { yaw: 3.334161210816938, pitch: 0.23082969252925767 },
      },
    ],
  ],
])

const hallId = computed(() => Number(props.id || 1))
const currentNode = computed(() => {
  if (!currentSceneConfig.value || !currentNodeId.value) return null
  return getNodeConfig(currentSceneConfig.value, currentNodeId.value) ?? null
})
const activeHotspots = computed(() => activeImageModal.value?.interactiveImage?.hotspots ?? [])
const activeArtifactDescription = computed(() => {
  if (!activeHotspotId.value) return null
  return (
    activeHotspots.value.find((hotspot) => hotspot.id === activeHotspotId.value)?.artifact ?? null
  )
})

const showFogMask = computed(() => {
  return Boolean(currentSceneConfig.value?.blackHoleMitigation?.enabled)
})

let viewer: Viewer | null = null
let markersPlugin: MarkersPlugin | null = null
let isClampingPitch = false

function resolveSceneConfig(): HallSceneConfig {
  const config = getHallSceneConfig(hallId.value)
  if (config) return config
  return (
    getHallSceneConfig(1) ?? {
      hallId: 1,
      caption: '展厅',
      entryNodeId: 'default',
      enableArtifactHotspots: false,
      nodes: [
        {
          nodeId: 'default',
          panoramaUrl: props.panoramaUrl,
          defaultView: { yaw: 0, pitch: 0, zoom: 50 },
          navigationSpots: [],
        },
      ],
    }
  )
}

function normalizeAngle(angle: AngleValue): number {
  if (typeof angle === 'number') return angle

  const value = angle.trim()
  if (value.endsWith('deg')) {
    return (Number.parseFloat(value.slice(0, -3)) * Math.PI) / 180
  }
  if (value.endsWith('rad')) {
    return Number.parseFloat(value.slice(0, -3))
  }
  return Number.parseFloat(value)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function createNavigationMarkerHtml(label: string, rotation: number): string {
  const safeLabel = escapeHtml(label)

  return `
    <div class="psv-nav-marker" style="--nav-rotation:${rotation}deg" aria-label="${safeLabel}">
      <span class="psv-nav-marker__halo"></span>
      <span class="psv-nav-marker__beam"></span>
      <span class="psv-nav-marker__chevrons">
        <span class="psv-nav-marker__chevron psv-nav-marker__chevron--one"></span>
        <span class="psv-nav-marker__chevron psv-nav-marker__chevron--two"></span>
      </span>
      <span class="psv-nav-marker__core"></span>
    </div>
  `
}

function createArtifactMarkerHtml(): string {
  return `
    <div class="psv-artifact-marker">
      <span class="psv-artifact-marker__ring"></span>
      <span class="psv-artifact-marker__dot"></span>
    </div>
  `
}

function resolvePublicAssetUrl(assetPath: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return `${normalizedBase}${assetPath}`
}

function getHotspotStyle(hotspot: ArtifactHotspot) {
  return {
    left: `${hotspot.x}%`,
    top: `${hotspot.y}%`,
    width: `${hotspot.width}%`,
    height: `${hotspot.height}%`,
  }
}

function buildNavigationMarkers(node: PanoramaNodeConfig): MarkerConfig[] {
  return node.navigationSpots.map((spot) => ({
    id: `nav-${node.nodeId}-${spot.id}`,
    position: {
      yaw: normalizeAngle(spot.position.yaw),
      pitch: normalizeAngle(spot.position.pitch),
    },
    anchor: 'center center',
    html: createNavigationMarkerHtml(spot.label, spot.rotation),
    tooltip: spot.label,
    data: {
      kind: 'navigation',
      targetNodeId: spot.targetNodeId,
    } satisfies NavigationMarkerData,
  }))
}

function buildCurrentMarkers(): MarkerConfig[] {
  if (!currentNode.value) return []
  return [...buildNavigationMarkers(currentNode.value), ...artifactMarkers.value]
}

async function rebuildMarkers() {
  if (!markersPlugin) return

  markersPlugin.clearMarkers()
  const markers = buildCurrentMarkers()
  markers.forEach((marker) => markersPlugin?.addMarker(marker))
}

function applyNodeView(node: PanoramaNodeConfig) {
  if (!viewer) return

  viewer.rotate({
    yaw: normalizeAngle(node.defaultView.yaw),
    pitch: normalizeAngle(node.defaultView.pitch),
  })

  if (typeof node.defaultView.zoom === 'number') {
    viewer.zoom(node.defaultView.zoom)
  }
}

function bindPitchClamp() {
  viewer?.addEventListener('position-updated', (event: any) => {
    if (!viewer || isClampingPitch) return
    const mitigation = currentSceneConfig.value?.blackHoleMitigation
    if (!mitigation?.enabled) return

    const minPitch = normalizeAngle(mitigation.pitchClamp.min)
    const maxPitch = normalizeAngle(mitigation.pitchClamp.max)
    const nextPitch = clamp(event.position.pitch, minPitch, maxPitch)

    if (Math.abs(nextPitch - event.position.pitch) < 0.0001) return

    isClampingPitch = true
    viewer.rotate({ yaw: event.position.yaw, pitch: nextPitch })
    requestAnimationFrame(() => {
      isClampingPitch = false
    })
  })
}

function bindDebugTracker() {
  if (!props.debugMode) return

  viewer?.addEventListener('click', (event: any) => {
    if (event.rightClick || !viewer) return

    const position = viewer.getPosition()
    coordinateHistory.value.unshift({
      yaw: Number(position.yaw.toFixed(12)),
      pitch: Number(position.pitch.toFixed(12)),
      timestamp: new Date().toLocaleTimeString(),
    })

    if (coordinateHistory.value.length > 10) {
      coordinateHistory.value = coordinateHistory.value.slice(0, 10)
    }
  })
}

async function loadArtifactMarkers() {
  if (!currentSceneConfig.value) {
    artifactMarkers.value = []
    return
  }

  const hallSpots = manualArtifactSpotMap.get(currentSceneConfig.value.hallId) ?? []
  const nodeSpots = hallSpots.filter((spot) => spot.nodeId === currentNodeId.value)

  artifactMarkers.value = nodeSpots.map((spot) => ({
    id: `artifact-${currentSceneConfig.value!.hallId}-${spot.id}`,
    position: {
      yaw: normalizeAngle(spot.position.yaw),
      pitch: normalizeAngle(spot.position.pitch),
    },
    anchor: 'center center',
    html: createArtifactMarkerHtml(),
    size: {
      width: 38,
      height: 38,
    },
    tooltip: `点击查看${spot.title}`,
    data: {
      kind: 'artifact',
      title: spot.title,
      imageUrl: resolvePublicAssetUrl(spot.imagePath),
      interactiveImageKey: spot.interactiveImageKey,
    } satisfies ArtifactMarkerData,
  }))
}

async function moveInsideScene(targetNodeId: string) {
  if (!viewer || !currentSceneConfig.value || !currentNode.value || isSwitching.value) return

  const targetNode = getNodeConfig(currentSceneConfig.value, targetNodeId)
  if (!targetNode) return

  isSwitching.value = true

  try {
    const isSamePanorama = currentNode.value.panoramaUrl === targetNode.panoramaUrl

    if (isSamePanorama) {
      await viewer.animate({
        yaw: normalizeAngle(targetNode.defaultView.yaw),
        pitch: normalizeAngle(targetNode.defaultView.pitch),
        zoom: targetNode.defaultView.zoom ?? 50,
        speed: '18rpm',
      })
    } else {
      await viewer.setPanorama(targetNode.panoramaUrl, {
        transition: {
          effect: 'fade',
          rotation: false,
          speed: '18rpm',
        },
      })
      applyNodeView(targetNode)
    }

    currentNodeId.value = targetNode.nodeId
    await loadArtifactMarkers()
    await rebuildMarkers()
  } catch (error) {
    console.error('场景切换失败:', error)
  } finally {
    isSwitching.value = false
  }
}

function showArtifactModal(data: ArtifactMarkerData) {
  const interactiveImage = getExhibition1InteractiveImageConfig(data.interactiveImageKey ?? null)
  const imageUrl =
    data.imageUrl || (interactiveImage ? resolvePublicAssetUrl(interactiveImage.imagePath) : '')
  if (!imageUrl) return

  activeImageModal.value = {
    title: interactiveImage?.title ?? data.title,
    imageUrl,
    interactiveImage,
  }
  activeHotspotId.value = null
}

function closeArtifactModal() {
  activeHotspotId.value = null
  activeImageModal.value = null
}

function selectArtifactHotspot(hotspotId: string) {
  activeHotspotId.value = hotspotId
}

function clearSelectedArtifact() {
  activeHotspotId.value = null
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return

  if (activeHotspotId.value) {
    clearSelectedArtifact()
    return
  }

  if (activeImageModal.value) {
    closeArtifactModal()
  }
}

function bindMarkerEvents() {
  markersPlugin?.addEventListener('select-marker', async (event: any) => {
    const data = event.marker?.data as MarkerPayload | undefined
    if (!data) return

    if (data.kind === 'navigation') {
      await moveInsideScene(data.targetNodeId)
      return
    }

    showArtifactModal(data)
  })
}

function bindViewerErrors() {
  viewer?.addEventListener('panorama-error', (event: any) => {
    console.error('全景图加载失败:', event?.error ?? event)
  })
}

async function initViewer() {
  if (!viewerContainer.value) return

  const sceneConfig = resolveSceneConfig()
  currentSceneConfig.value = sceneConfig

  const entryNode = getNodeConfig(sceneConfig, sceneConfig.entryNodeId) ??
    sceneConfig.nodes[0] ?? {
      nodeId: 'default',
      panoramaUrl: props.panoramaUrl,
      defaultView: { yaw: 0, pitch: 0, zoom: 50 },
      navigationSpots: [],
    }

  currentNodeId.value = entryNode.nodeId

  viewer = new Viewer({
    container: viewerContainer.value,
    panorama: entryNode.panoramaUrl,
    caption: props.caption || sceneConfig.caption,
    navbar: ['zoom', 'move', 'fullscreen'],
    plugins: [[MarkersPlugin, {}]],
    defaultZoomLvl: entryNode.defaultView.zoom ?? 50,
    minFov: 30,
    maxFov: 90,
    mousewheel: true,
    mousewheelCtrlKey: false,
    touchmoveTwoFingers: true,
  })

  markersPlugin = viewer.getPlugin(MarkersPlugin) as MarkersPlugin

  bindPitchClamp()
  bindDebugTracker()
  bindMarkerEvents()
  bindViewerErrors()

  viewer.addEventListener('ready', async () => {
    if (!currentNode.value) return

    applyNodeView(currentNode.value)
    await loadArtifactMarkers()
    await rebuildMarkers()
  })
}

function destroyViewer() {
  closeArtifactModal()
  if (viewer) {
    viewer.destroy()
    viewer = null
  }
  markersPlugin = null
  isSwitching.value = false
  isClampingPitch = false
}

function toDegrees(value: number): string {
  return ((value * 180) / Math.PI).toFixed(1)
}

async function copyCoordinate(yaw: number, pitch: number) {
  const text = `position: { yaw: ${yaw}, pitch: ${pitch} }`

  try {
    await navigator.clipboard.writeText(text)
  } catch {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

function clearCoordinates() {
  coordinateHistory.value = []
}

watch(
  () => props.id,
  async () => {
    closeArtifactModal()
    destroyViewer()
    await initViewer()
  },
)

onMounted(async () => {
  document.addEventListener('keydown', handleGlobalKeydown)
  await initViewer()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
  destroyViewer()
})
</script>

<style>
.psv-nav-marker {
  position: relative;
  width: 76px;
  height: 76px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(var(--nav-rotation, 0deg));
  pointer-events: auto;
  cursor: pointer;
}

.psv-nav-marker__halo {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  background: radial-gradient(
    circle,
    rgba(91, 255, 255, 0.35) 0%,
    rgba(22, 111, 255, 0.1) 45%,
    rgba(5, 15, 40, 0) 75%
  );
  filter: blur(0.6px);
  animation: nav-halo-pulse 2.2s ease-in-out infinite;
}

.psv-nav-marker__beam {
  position: absolute;
  width: 58px;
  height: 58px;
  border-radius: 9999px;
  border: 2px solid rgba(73, 247, 255, 0.45);
  box-shadow:
    0 0 12px rgba(73, 247, 255, 0.52),
    inset 0 0 10px rgba(81, 161, 255, 0.42);
}

.psv-nav-marker__chevrons {
  position: absolute;
  top: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
}

.psv-nav-marker__chevron {
  width: 0;
  height: 0;
  border-left: 11px solid transparent;
  border-right: 11px solid transparent;
  border-bottom: 15px solid rgba(116, 255, 248, 0.95);
  filter: drop-shadow(0 0 8px rgba(86, 255, 243, 0.72));
}

.psv-nav-marker__chevron--two {
  transform: translateY(-1px) scale(0.86);
  opacity: 0.9;
}

.psv-nav-marker__core {
  position: absolute;
  bottom: 11px;
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  background: radial-gradient(
    circle,
    rgba(183, 255, 255, 1) 0%,
    rgba(55, 198, 255, 0.95) 45%,
    rgba(38, 121, 255, 0.78) 100%
  );
  box-shadow:
    0 0 13px rgba(99, 244, 255, 0.92),
    0 0 22px rgba(75, 140, 255, 0.66);
}

.psv-nav-marker:hover {
  transform: rotate(var(--nav-rotation, 0deg)) translateY(-2px) scale(1.05);
}

.psv-nav-marker:hover .psv-nav-marker__halo {
  background: radial-gradient(
    circle,
    rgba(91, 255, 255, 0.45) 0%,
    rgba(22, 111, 255, 0.15) 45%,
    rgba(5, 15, 40, 0) 75%
  );
}

.psv-artifact-marker {
  position: relative;
  width: 38px;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
}

.psv-artifact-marker__ring {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 2px solid rgba(255, 227, 155, 0.95);
  background: radial-gradient(
    circle,
    rgba(255, 225, 138, 0.4) 0%,
    rgba(255, 160, 66, 0.32) 50%,
    rgba(255, 126, 70, 0.08) 100%
  );
  box-shadow:
    0 0 14px rgba(255, 182, 85, 0.76),
    inset 0 0 10px rgba(255, 245, 225, 0.34);
  animation: artifact-pulse 1.5s ease-in-out infinite;
}

.psv-artifact-marker__dot {
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.98);
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.96);
}

@keyframes nav-halo-pulse {
  0% {
    transform: scale(0.96);
    opacity: 0.72;
  }
  50% {
    transform: scale(1.04);
    opacity: 1;
  }
  100% {
    transform: scale(0.96);
    opacity: 0.72;
  }
}

@keyframes artifact-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.92;
  }
  50% {
    transform: scale(1.18);
    opacity: 1;
  }
}

@keyframes image-hotspot-breathe {
  0%,
  100% {
    opacity: 0.88;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.06);
  }
}

.hotspot-hit-area {
  min-width: 44px;
  min-height: 44px;
  border-radius: 18px;
  background: transparent;
}

.hotspot-hit-area::after {
  content: '';
  position: absolute;
  left: 50%;
  top: 50%;
  width: 34px;
  height: 34px;
  border-radius: 9999px;
  transform: translate(-50%, -50%);
  background: radial-gradient(
    circle,
    rgba(255, 214, 134, 0.28) 0%,
    rgba(255, 190, 96, 0.12) 48%,
    rgba(255, 190, 96, 0) 100%
  );
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.hotspot-hit-area__frame {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  border: 1px solid rgba(255, 218, 151, 0.45);
  background: rgba(255, 221, 158, 0.06);
  box-shadow: inset 0 0 0 1px rgba(255, 240, 205, 0.08);
  opacity: 0;
  transform: scale(0.94);
  transition:
    opacity 0.22s ease,
    transform 0.22s ease,
    border-color 0.22s ease;
}

.hotspot-hit-area__pin {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 235, 194, 0.88);
  background: radial-gradient(
    circle,
    rgba(253, 245, 224, 0.98) 0%,
    rgba(244, 201, 128, 0.9) 55%,
    rgba(168, 117, 50, 0.88) 100%
  );
  color: rgba(59, 34, 13, 0.92);
  font-size: 11px;
  font-weight: 700;
  box-shadow: 0 0 18px rgba(245, 199, 117, 0.42);
  animation: image-hotspot-breathe 2.3s ease-in-out infinite;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.hotspot-hit-area__label {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 3;
  max-width: 250px;
  transform: translate(-50%, calc(-50% - 31px));
  border: 1px solid rgba(247, 221, 175, 0.44);
  border-radius: 9999px;
  background: rgba(6, 18, 32, 0.92);
  color: #fae7c2;
  padding: 5px 11px;
  white-space: nowrap;
  font-size: 12px;
  line-height: 1.2;
  letter-spacing: 0.03em;
  opacity: 0;
  pointer-events: none;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.hotspot-hit-area:hover .hotspot-hit-area__frame,
.hotspot-hit-area.is-active .hotspot-hit-area__frame {
  opacity: 1;
  transform: scale(1);
}

.hotspot-hit-area:hover::after,
.hotspot-hit-area.is-active::after {
  opacity: 1;
}

.hotspot-hit-area:hover .hotspot-hit-area__label,
.hotspot-hit-area.is-active .hotspot-hit-area__label {
  opacity: 1;
  transform: translate(-50%, calc(-50% - 34px));
}

.hotspot-hit-area:hover .hotspot-hit-area__pin,
.hotspot-hit-area.is-active .hotspot-hit-area__pin {
  transform: translate(-50%, -50%) scale(1.12);
  box-shadow:
    0 0 0 7px rgba(245, 210, 145, 0.16),
    0 0 24px rgba(248, 208, 130, 0.64);
}

@media (max-width: 640px) {
  .hotspot-hit-area {
    min-width: 52px;
    min-height: 52px;
  }

  .hotspot-hit-area__pin {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .hotspot-hit-area__label {
    display: none;
  }
}
</style>
