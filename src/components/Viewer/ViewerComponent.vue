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
      class="absolute inset-0 z-[9999] flex items-center justify-center bg-[rgba(246,240,232,0.18)] p-3 backdrop-blur-[2px] sm:p-6"
      @click.self="closeArtifactModal"
    >
      <div class="relative flex max-h-[94vh] max-w-[96vw] flex-col items-center">
        <button
          class="absolute top-3 right-3 z-30 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/55 bg-white/68 text-[22px] text-[#5d4b35] shadow-[0_8px_24px_rgba(0,0,0,0.14)] backdrop-blur-md transition hover:bg-white/88"
          aria-label="关闭资料图"
          @click="closeArtifactModal"
        >
          ×
        </button>

        <div
          ref="interactiveImageFrame"
          class="artifact-interactive-surface relative w-fit max-w-full overflow-visible rounded-[28px] border border-white/42 bg-[rgba(255,250,244,0.34)] p-4 shadow-[0_18px_44px_rgba(0,0,0,0.18)] backdrop-blur-md sm:p-5"
          @click="clearSelectedArtifact"
        >
          <img
            ref="interactiveImageElement"
            :src="activeImageModal.imageUrl"
            :alt="activeImageModal.title"
            class="artifact-interactive-surface__image block max-h-[82vh] max-w-[92vw] rounded-[18px] object-contain select-none"
            @load="handleInteractiveImageLoad"
          />

          <button
            v-for="(hotspot, index) in activeHotspots"
            :key="hotspot.id"
            :style="getHotspotStyle(hotspot)"
            class="hotspot-hit-area group absolute cursor-pointer border-none bg-transparent p-0 appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a46a]/45"
            :class="{ 'is-active': activeHotspotId === hotspot.id }"
            :aria-label="`查看 ${hotspot.artifact.title}`"
            :title="hotspot.artifact.title"
            @click.stop="selectArtifactHotspot(hotspot.id)"
          >
            <span class="hotspot-hit-area__pin">
              {{ index + 1 }}
            </span>
            <span class="hotspot-hit-area__label">
              {{ hotspot.artifact.title }}
            </span>
          </button>

          <div
            v-if="activeArtifactDescription"
            ref="artifactCardElement"
            class="artifact-floating-card absolute w-[min(360px,calc(100%-24px))] max-w-[calc(100%-24px)] overflow-visible rounded-[20px] border border-white/62 bg-[rgba(255,251,246,0.9)] text-[#342a1d] shadow-[0_16px_36px_rgba(0,0,0,0.16)] backdrop-blur-xl"
            :class="`artifact-floating-card--${activeArtifactCardPlacement}`"
            :style="activeArtifactCardStyle"
            @click.stop
          >
            <span
              class="artifact-floating-card__arrow"
              :class="`artifact-floating-card__arrow--${activeArtifactCardPlacement}`"
              :style="activeArtifactCardArrowStyle"
            />
            <div class="flex items-start gap-3 px-4 pt-4 pb-3 sm:px-5">
              <div class="min-w-0 flex-1">
                <div class="font-['Noto_Serif_SC',serif] text-base font-semibold text-[#4c3921] sm:text-lg">
                  {{ activeArtifactDescription.title }}
                </div>
                <div
                  class="mt-3 max-h-[220px] overflow-y-auto pr-1 text-[13px] leading-6 whitespace-pre-line text-[#4a4036] sm:text-[14px] sm:leading-7"
                >
                  {{ activeArtifactDescription.content }}
                </div>
              </div>
              <button
                class="shrink-0 cursor-pointer rounded-full bg-[#f2e5d2] px-3 py-1 text-xs text-[#6b5438] transition hover:bg-[#ead4b0]"
                @click="clearSelectedArtifact"
              >
                关闭
              </button>
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
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
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
const interactiveImageFrame = ref<HTMLElement | null>(null)
const interactiveImageElement = ref<HTMLImageElement | null>(null)
const artifactCardElement = ref<HTMLElement | null>(null)
const coordinateHistory = ref<CoordinateEntry[]>([])
const currentSceneConfig = ref<HallSceneConfig | null>(null)
const currentNodeId = ref('')
const isSwitching = ref(false)
const artifactMarkers = ref<MarkerConfig[]>([])
const activeImageModal = ref<ArtifactImageModalState | null>(null)
const activeHotspotId = ref<string | null>(null)
const activeArtifactCardStyle = ref<Record<string, string>>({})
const activeArtifactCardArrowStyle = ref<Record<string, string>>({})
const activeArtifactCardPlacement = ref<'top' | 'bottom'>('top')

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
const activeHotspot = computed(() => {
  if (!activeHotspotId.value) return null
  return activeHotspots.value.find((hotspot) => hotspot.id === activeHotspotId.value) ?? null
})
const activeArtifactDescription = computed(() => {
  return activeHotspot.value?.artifact ?? null
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
  }
}

function updateArtifactCardPosition() {
  if (!activeHotspot.value || !interactiveImageFrame.value || !artifactCardElement.value) {
    activeArtifactCardStyle.value = {}
    activeArtifactCardArrowStyle.value = {}
    return
  }

  const frameRect = interactiveImageFrame.value.getBoundingClientRect()
  const cardRect = artifactCardElement.value.getBoundingClientRect()

  if (!frameRect.width || !frameRect.height || !cardRect.width || !cardRect.height) return

  const hotspotX = (activeHotspot.value.x / 100) * frameRect.width
  const hotspotY = (activeHotspot.value.y / 100) * frameRect.height
  const safeMargin = 12
  const cardGap = 20
  let placement: 'top' | 'bottom' = 'top'
  let top = hotspotY - cardRect.height - cardGap

  if (top < safeMargin) {
    placement = 'bottom'
    top = hotspotY + cardGap
  }

  if (top + cardRect.height > frameRect.height - safeMargin) {
    placement = 'top'
    top = hotspotY - cardRect.height - cardGap
  }

  top = clamp(top, safeMargin, Math.max(safeMargin, frameRect.height - cardRect.height - safeMargin))

  let left = hotspotX - cardRect.width / 2
  left = clamp(left, safeMargin, Math.max(safeMargin, frameRect.width - cardRect.width - safeMargin))

  const arrowLeft = clamp(
    hotspotX - left,
    24,
    Math.max(24, cardRect.width - 24),
  )

  activeArtifactCardPlacement.value = placement
  activeArtifactCardStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
  }
  activeArtifactCardArrowStyle.value = {
    left: `${arrowLeft}px`,
  }
}

async function syncArtifactCardPosition() {
  await nextTick()
  updateArtifactCardPosition()
}

function handleInteractiveImageLoad() {
  void syncArtifactCardPosition()
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
  activeArtifactCardStyle.value = {}
  activeArtifactCardArrowStyle.value = {}
  activeImageModal.value = null
}

function selectArtifactHotspot(hotspotId: string) {
  activeHotspotId.value = activeHotspotId.value === hotspotId ? null : hotspotId
  void syncArtifactCardPosition()
}

function clearSelectedArtifact() {
  activeHotspotId.value = null
  activeArtifactCardStyle.value = {}
  activeArtifactCardArrowStyle.value = {}
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

watch(
  () => [activeHotspotId.value, activeImageModal.value?.imageUrl],
  () => {
    void syncArtifactCardPosition()
  },
)

onMounted(async () => {
  document.addEventListener('keydown', handleGlobalKeydown)
  window.addEventListener('resize', updateArtifactCardPosition)
  await initViewer()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
  window.removeEventListener('resize', updateArtifactCardPosition)
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
    opacity: 0.82;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.04);
  }
}

.hotspot-hit-area {
  appearance: none;
  -webkit-appearance: none;
  width: 40px;
  height: 40px;
  margin: 0;
  border: 0;
  padding: 0;
  transform: translate(-50%, -50%);
  background: transparent;
  line-height: 1;
}

.hotspot-hit-area__pin {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 9999px;
  transform: translate(-50%, -50%);
  border: 1px solid rgba(255, 255, 255, 0.95);
  background: radial-gradient(
    circle,
    rgba(255, 250, 243, 0.98) 0%,
    rgba(232, 201, 155, 0.94) 65%,
    rgba(194, 153, 99, 0.94) 100%
  );
  color: rgba(59, 34, 13, 0.92);
  font-size: 9px;
  font-weight: 700;
  box-shadow:
    0 3px 10px rgba(138, 108, 66, 0.22),
    0 0 0 4px rgba(236, 213, 181, 0.18);
  animation: image-hotspot-breathe 2.6s ease-in-out infinite;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    border-color 0.22s ease;
}

.hotspot-hit-area__label {
  position: absolute;
  left: 50%;
  top: -2px;
  z-index: 3;
  max-width: 250px;
  transform: translate(-50%, -100%);
  border: 1px solid rgba(214, 188, 151, 0.46);
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.9);
  color: #5f4a33;
  padding: 5px 10px;
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

.hotspot-hit-area:hover .hotspot-hit-area__label {
  opacity: 1;
  transform: translate(-50%, calc(-100% - 2px));
}

.hotspot-hit-area:hover .hotspot-hit-area__pin,
.hotspot-hit-area.is-active .hotspot-hit-area__pin {
  transform: translate(-50%, -50%) scale(1.14);
  box-shadow:
    0 6px 14px rgba(140, 108, 61, 0.26),
    0 0 0 6px rgba(231, 202, 161, 0.28);
}

.artifact-floating-card {
  pointer-events: auto;
}

.artifact-floating-card__arrow {
  position: absolute;
  width: 16px;
  height: 16px;
  background: rgba(255, 251, 246, 0.9);
  transform: translateX(-50%) rotate(45deg);
  backdrop-filter: blur(16px);
}

.artifact-floating-card__arrow--top {
  bottom: -8px;
  border-right: 1px solid rgba(255, 255, 255, 0.62);
  border-bottom: 1px solid rgba(255, 255, 255, 0.62);
}

.artifact-floating-card__arrow--bottom {
  top: -8px;
  border-left: 1px solid rgba(255, 255, 255, 0.62);
  border-top: 1px solid rgba(255, 255, 255, 0.62);
}

@media (max-width: 640px) {
  .hotspot-hit-area {
    width: 46px;
    height: 46px;
  }

  .hotspot-hit-area__pin {
    width: 22px;
    height: 22px;
    font-size: 10px;
  }

  .hotspot-hit-area__label {
    display: none;
  }
}
</style>
