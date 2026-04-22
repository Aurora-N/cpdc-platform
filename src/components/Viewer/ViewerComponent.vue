<template>
  <div class="relative h-full w-full">
    <div ref="viewerContainer" class="h-full w-full" />

    <div
      v-if="activeHallVideoUrl"
      class="absolute inset-0 z-[995]"
      :class="
        isFullscreenVideo
          ? 'bg-black'
          : 'flex items-center justify-center bg-[rgba(0,0,0,0.72)] p-4 sm:p-6'
      "
      @click.self="closeHallVideo"
    >
      <button
        class="absolute top-4 right-4 z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/50 bg-black/35 text-xl text-white transition hover:bg-black/55"
        aria-label="关闭视频"
        @click="closeHallVideo"
      >
        ×
      </button>
      <video
        ref="hallVideoElement"
        class="bg-black"
        :class="
          isFullscreenVideo
            ? 'h-full w-full object-cover'
            : 'max-h-[88vh] w-full max-w-[1100px] rounded-lg object-contain shadow-[0_14px_40px_rgba(0,0,0,0.45)]'
        "
        :src="activeHallVideoUrl"
        controls
        autoplay
        playsinline
        @ended="closeHallVideo"
      />
    </div>

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
        >
          <img
            ref="interactiveImageElement"
            :src="activeImageModal.imageUrl"
            :alt="activeImageModal.title"
            class="artifact-interactive-surface__image block max-h-[82vh] max-w-[92vw] rounded-[18px] object-contain select-none"
            @load="handleInteractiveImageLoad"
          />

          <div
            v-if="interactiveImageViewportReady"
            class="interactive-image-overlay absolute z-10"
            :style="interactiveImageViewportStyle"
            @click="clearSelectedArtifact"
          >
            <div
              class="hotspot-number-rail absolute z-30 rounded-full border border-white/75 bg-[rgba(255,250,244,0.82)] shadow-[0_8px_20px_rgba(0,0,0,0.14)] backdrop-blur-md"
              :style="hotspotRailStyle"
              @click.stop
            >
              <button
                v-for="(hotspot, index) in activeHotspots"
                :key="hotspot.id"
                class="hotspot-number-button cursor-pointer border-none bg-transparent p-0 appearance-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a46a]/45"
                :class="{ 'is-active': activeHotspotId === hotspot.id }"
                :aria-label="`查看 ${hotspot.artifact.title}`"
                :title="hotspot.artifact.title"
                @click.stop="selectArtifactHotspot(hotspot.id)"
              >
                <span class="hotspot-number-button__dot" />
              </button>
            </div>

            <Transition name="artifact-modal">
              <div
                v-if="activeArtifactDescription"
                class="artifact-description-mask absolute inset-0 z-20 flex items-center justify-center rounded-[18px]"
                @click.stop="clearSelectedArtifact"
              >
                <div
                  class="artifact-description-modal w-[min(560px,calc(100%-24px))] max-h-[calc(100%-24px)] rounded-[20px] border border-white/62 bg-[rgba(255,251,246,0.95)] text-[#342a1d] shadow-[0_24px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl"
                  role="dialog"
                  aria-modal="true"
                  @click.stop
                  @wheel.stop
                  @touchmove.stop
                >
                  <div class="px-4 pt-4 pb-3 sm:px-5">
                    <div class="font-['Noto_Serif_SC',serif] text-base font-semibold text-[#4c3921] sm:text-lg">
                      {{ activeArtifactDescription.title }}
                    </div>
                    <div
                      class="mt-3 max-h-[min(52vh,360px)] overflow-y-auto overscroll-contain pr-1 text-[13px] leading-6 whitespace-pre-line text-[#4a4036] sm:text-[14px] sm:leading-7"
                      @wheel.stop
                      @touchmove.stop
                    >
                      <img
                        v-if="activeArtifactMediaUrl"
                        :src="activeArtifactMediaUrl"
                        :alt="activeArtifactDescription.title"
                        class="mb-3 h-auto w-full rounded-[12px] border border-[#d8c6ad]/55 bg-white object-contain"
                        loading="lazy"
                      />
                      {{ activeArtifactDescription.content }}
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isQaGameModalOpen"
      class="absolute inset-0 z-[9998] flex items-center justify-center bg-black/52 p-3 backdrop-blur-[2px] sm:p-6"
      @click.self="closeQaGameModal"
    >
      <div
        class="relative w-[min(920px,96vw)] max-h-[92vh] overflow-hidden rounded-[22px] border border-white/62 bg-[rgba(255,251,246,0.96)] text-[#342a1d] shadow-[0_24px_44px_rgba(0,0,0,0.24)] backdrop-blur-xl"
        @click.stop
        @wheel.stop
        @touchmove.stop
      >
        <button
          class="absolute top-3 right-3 z-30 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#8e7758]/45 bg-white/72 text-[20px] text-[#5d4b35] transition hover:bg-white/90"
          aria-label="关闭互动问答"
          @click="closeQaGameModal"
        >
          ×
        </button>
        <div class="px-5 pt-5 pb-4 sm:px-6">
          <div class="font-['Noto_Serif_SC',serif] text-lg font-semibold text-[#4c3921] sm:text-xl">
            彩瓷密码互动问答
          </div>
          <div class="mt-2 text-sm text-[#7a6244]">
            当前得分：{{ qaScore }} / {{ qaQuestions.length }}
          </div>
          <div class="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#eadfce]">
            <div class="h-full bg-[#c59a62] transition-all" :style="{ width: `${qaProgressPercent}%` }" />
          </div>
          <div
            class="mt-4 max-h-[calc(92vh-160px)] overflow-y-auto overscroll-contain pr-1 text-[14px] leading-7 text-[#4a4036]"
            @wheel.stop
            @touchmove.stop
          >
            <template v-if="!qaIsFinished && qaCurrentQuestion">
              <div class="rounded-xl border border-[#e3d3bc] bg-[#fffaf2] px-4 py-3">
                <div class="text-xs text-[#8b6f4e]">
                  第 {{ qaCurrentIndex + 1 }} 题 / 共 {{ qaQuestions.length }} 题
                </div>
                <div class="mt-2 text-[16px] font-medium text-[#3f3121]">
                  {{ qaCurrentQuestion.question }}
                </div>
                <div class="mt-3 grid gap-2">
                  <button
                    v-for="(option, optionIndex) in qaCurrentQuestion.options"
                    :key="`${qaCurrentQuestion.id}-${optionIndex}`"
                    class="cursor-pointer rounded-lg border px-3 py-2 text-left transition"
                    :class="qaOptionClass(optionIndex)"
                    :disabled="qaAnswered"
                    @click="answerQaQuestion(optionIndex)"
                  >
                    <span class="mr-2 text-[#8a6a44]">{{ String.fromCharCode(65 + optionIndex) }}.</span>
                    {{ option }}
                  </button>
                </div>
                <div v-if="qaAnswered" class="mt-3 rounded-lg bg-white/70 px-3 py-2 text-[13px] leading-6">
                  <div class="font-medium" :class="qaAnswerCorrect ? 'text-[#2d7b4b]' : 'text-[#b1493d]'">
                    {{ qaAnswerCorrect ? '回答正确' : '回答错误' }}
                  </div>
                  <div class="mt-1 text-[#5a4b3b]">
                    {{ qaCurrentQuestion.explanation }}
                  </div>
                  <button
                    class="mt-3 cursor-pointer rounded-md bg-[#9f7747] px-3 py-1.5 text-white transition hover:bg-[#8d6739]"
                    @click="nextQaQuestion"
                  >
                    {{ qaCurrentIndex + 1 === qaQuestions.length ? '查看结果' : '下一题' }}
                  </button>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="rounded-xl border border-[#e3d3bc] bg-[#fffaf2] px-4 py-4">
                <div class="text-[18px] font-semibold text-[#4a3923]">闯关完成</div>
                <div class="mt-2 text-[15px] text-[#5c4b39]">
                  你总共答对 {{ qaScore }} / {{ qaQuestions.length }} 题。
                </div>
                <div class="mt-2 text-[14px] text-[#7a6244]">
                  {{ qaScore >= 5 ? '太厉害了，已解锁“广彩密码高手”称号。' : '不错，再来一轮把拼图碎片集齐。' }}
                </div>
                <div class="mt-4 flex gap-2">
                  <button
                    class="cursor-pointer rounded-md bg-[#9f7747] px-3 py-1.5 text-white transition hover:bg-[#8d6739]"
                    @click="restartQaGame"
                  >
                    再玩一次
                  </button>
                  <button
                    class="cursor-pointer rounded-md border border-[#c9b49a] px-3 py-1.5 text-[#6e563a] transition hover:bg-[#f6ecdf]"
                    @click="closeQaGameModal"
                  >
                    关闭
                  </button>
                </div>
              </div>
            </template>
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
  exhibition1InteractiveImageKeys,
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
  videoUrl?: string
  interactiveImageKey?: Exhibition1InteractiveImageKey
}

interface QaGameMarkerData {
  kind: 'qa-game'
}

type MarkerPayload = NavigationMarkerData | ArtifactMarkerData | QaGameMarkerData

interface QaQuestionItem {
  id: string
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

interface ManualArtifactSpot {
  id: string
  nodeId: string
  title: string
  imagePath?: string
  videoPath?: string
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
    default:false,
  },
})

const viewerContainer = ref<HTMLElement | null>(null)
const interactiveImageFrame = ref<HTMLElement | null>(null)
const interactiveImageElement = ref<HTMLImageElement | null>(null)
const hallVideoElement = ref<HTMLVideoElement | null>(null)
const coordinateHistory = ref<CoordinateEntry[]>([])
const currentSceneConfig = ref<HallSceneConfig | null>(null)
const currentNodeId = ref('')
const isSwitching = ref(false)
const artifactMarkers = ref<MarkerConfig[]>([])
const activeImageModal = ref<ArtifactImageModalState | null>(null)
const activeHallVideoUrl = ref('')
const isFullscreenVideo = ref(true)
const activeHotspotId = ref<string | null>(null)
const interactiveImageViewportStyle = ref<Record<string, string>>({})
const exhibitionDescriptionText = ref<string>('')
const exhibitionDescriptionVersion = ref(0)
const isQaGameModalOpen = ref(false)
const qaCurrentIndex = ref(0)
const qaScore = ref(0)
const qaSelectedIndex = ref<number | null>(null)
const qaAnswered = ref(false)
const qaAnswerCorrect = ref(false)

const qaQuestions: QaQuestionItem[] = [
  {
    id: 'qa-1',
    question: '广彩瓷纹饰密集华丽，常用“（ ）彩（ ）纷”形容其色彩丰富，应填哪两个字？',
    options: ['五、缤', '万、千', '青、红', '金、玉'],
    answerIndex: 0,
    explanation: '答案是“五、缤”，成语为“五彩缤纷”。',
  },
  {
    id: 'qa-2',
    question: '广彩中的“茄色”比景德镇茄皮紫更明艳，它由哪两种颜料配合而成？',
    options: ['水青 + 干大红', '西红 + 水青', '麻色 + 金色', '水绿 + 二绿'],
    answerIndex: 1,
    explanation: '答案是“西红 + 水青”，碰撞后形成鲜亮茄色。',
  },
  {
    id: 'qa-3',
    question: '老匠人说“织金填绿前，先给图案打腮红”，这里的“打腮红”是哪道工序？',
    options: ['印稿', '挞花', '烧制', '装饰'],
    answerIndex: 1,
    explanation: '“挞花”用于点出花瓣明暗层次，类似“打腮红”。',
  },
  {
    id: 'qa-4',
    question: '“车线要稳，全靠手拐子撑”中的“手拐子”对应哪个工具？',
    options: ['擂色碗', '枕箱', '令圈笔', '封边笔'],
    answerIndex: 1,
    explanation: '枕箱是弧形木枕，能托住手腕让线条更稳。',
  },
  {
    id: 'qa-5',
    question: '用于“令圈”工序、可快速画出圆形线圈的工具是哪个？',
    options: ['擂色捶', '令圈笔', '封边笔', '墨计'],
    answerIndex: 1,
    explanation: '令圈笔由多支笔杆组成，适合稳定画圆。',
  },
  {
    id: 'qa-6',
    question: '“广彩瓷的织金工艺只用纯金粉末，不用化学材料。”这个说法正确吗？',
    options: ['正确', '错误'],
    answerIndex: 1,
    explanation: '错误。清末开始已使用化学金水，降低成本并便于保存。',
  },
]

const qaCurrentQuestion = computed(() => qaQuestions[qaCurrentIndex.value] ?? null)
const qaIsFinished = computed(() => qaCurrentIndex.value >= qaQuestions.length)
const qaProgressPercent = computed(() => {
  if (!qaQuestions.length) return 0
  const doneCount = Math.min(qaCurrentIndex.value, qaQuestions.length)
  return (doneCount / qaQuestions.length) * 100
})

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
        id: 'n1-ex1-v1',
        nodeId: 'n1',
        title: '展厅讲解视频 1',
        videoPath: 'exhibition/exhibition1/v1.mp4',
        position: { yaw: 5.39, pitch: -0.009007742687 },
      },
      {
        id: 'n1-ex1-v2',
        nodeId: 'n1',
        title: '展厅讲解视频 2',
        videoPath: 'exhibition/exhibition1/v2.mp4',
        position: { yaw: 0.65, pitch: 0.03 },
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
  const hotspotArtifact = activeHotspot.value?.artifact
  if (!hotspotArtifact) return null

  // 依赖版本号，确保 description.txt 异步加载完成后触发重算
  exhibitionDescriptionVersion.value

  const fullContent = resolveArtifactDescriptionContent(
    activeImageModal.value?.interactiveImage?.title ?? '',
    hotspotArtifact.title,
    hotspotArtifact.content,
  )

  return {
    ...hotspotArtifact,
    content: fullContent,
  }
})
const activeArtifactMediaUrl = computed(() => {
  const interactiveImageKey = activeImageModal.value?.interactiveImage?.key
  const hotspotId = activeHotspotId.value
  if (!interactiveImageKey || !hotspotId) return ''

  let mediaIndexOffset = 0

  for (const key of exhibition1InteractiveImageKeys) {
    const config = getExhibition1InteractiveImageConfig(key)
    if (!config) continue

    if (key === interactiveImageKey) {
      const hotspotIndex = config.hotspots.findIndex((hotspot) => hotspot.id === hotspotId)
      if (hotspotIndex === -1) return ''
      return resolvePublicAssetUrl(`media/image${mediaIndexOffset + hotspotIndex + 1}.png`)
    }

    mediaIndexOffset += config.hotspots.length
  }

  return ''
})
const hotspotRailStyle = computed<Record<string, string>>(() => ({
  '--hotspot-count': String(Math.max(activeHotspots.value.length, 1)),
}))
const interactiveImageViewportReady = computed(() => {
  return Boolean(interactiveImageViewportStyle.value.width && interactiveImageViewportStyle.value.height)
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

function createQaGameMarkerHtml(): string {
  return `
    <div class="psv-qa-marker" aria-label="彩瓷密码互动问答">
      <span class="psv-qa-marker__pulse"></span>
      <span class="psv-qa-marker__core">问答</span>
    </div>
  `
}

function buildQaGameMarkers(node: PanoramaNodeConfig): MarkerConfig[] {
  if (hallId.value !== 3) return []

  const leftYaw = 3.079102512975
  const rightYaw = 3.079102512975
  const topPitch = -0.107872711536
  const bottomPitch = -0.107872711536
  const centerYaw = (leftYaw + rightYaw) / 2
  const centerPitch = (topPitch + bottomPitch) / 2

  return [
    {
      id: `qa-game-point-${node.nodeId}`,
      position: {
        yaw: centerYaw,
        pitch: centerPitch,
      },
      anchor: 'center center',
      html: createQaGameMarkerHtml(),
      size: {
        width: 84,
        height: 84,
      },
      tooltip: '点击参与“彩瓷密码”互动问答',
      data: {
        kind: 'qa-game',
      } satisfies QaGameMarkerData,
    },
    {
      id: `qa-game-zone-${node.nodeId}`,
      polygon: [
        [leftYaw, topPitch],
        [rightYaw, topPitch],
        [rightYaw, bottomPitch],
        [leftYaw, bottomPitch],
      ],
      svgStyle: {
        fill: 'rgba(222, 177, 96, 0.22)',
        stroke: 'rgba(229, 190, 118, 0.92)',
        strokeWidth: '2px',
      },
      tooltip: '点击参与“彩瓷密码”互动问答',
      data: {
        kind: 'qa-game',
      } satisfies QaGameMarkerData,
    },
  ]
}

function resolvePublicAssetUrl(assetPath: string): string {
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  return `${normalizedBase}${assetPath}`
}

function resetQaGameState() {
  qaCurrentIndex.value = 0
  qaScore.value = 0
  qaSelectedIndex.value = null
  qaAnswered.value = false
  qaAnswerCorrect.value = false
}

async function openQaGameModal() {
  resetQaGameState()
  isQaGameModalOpen.value = true
}

function closeQaGameModal() {
  isQaGameModalOpen.value = false
}

function answerQaQuestion(optionIndex: number) {
  if (qaAnswered.value || !qaCurrentQuestion.value) return

  qaSelectedIndex.value = optionIndex
  qaAnswered.value = true
  const isCorrect = optionIndex === qaCurrentQuestion.value.answerIndex
  qaAnswerCorrect.value = isCorrect
  if (isCorrect) qaScore.value += 1
}

function qaOptionClass(optionIndex: number): string {
  if (!qaAnswered.value || !qaCurrentQuestion.value) {
    return 'border-[#dccab3] bg-white/70 text-[#473729] hover:bg-[#f6ecdf]'
  }

  const isCorrectOption = optionIndex === qaCurrentQuestion.value.answerIndex
  const isSelected = qaSelectedIndex.value === optionIndex

  if (isCorrectOption) {
    return 'border-[#56a46f] bg-[#e9f8ee] text-[#1f6f3f]'
  }
  if (isSelected) {
    return 'border-[#d07968] bg-[#ffefec] text-[#9c3d30]'
  }
  return 'border-[#e3d3bc] bg-white/55 text-[#8c7a66]'
}

function nextQaQuestion() {
  if (!qaAnswered.value) return

  if (qaCurrentIndex.value < qaQuestions.length - 1) {
    qaCurrentIndex.value += 1
    qaSelectedIndex.value = null
    qaAnswered.value = false
    qaAnswerCorrect.value = false
    return
  }

  qaCurrentIndex.value = qaQuestions.length
}

function restartQaGame() {
  resetQaGameState()
}

function normalizeForCompare(text: string): string {
  return text.replace(/[\s\u3000]+/g, '').trim()
}

function escapeRegExp(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function ensureExhibitionDescriptionLoaded() {
  if (exhibitionDescriptionText.value) return

  try {
    const response = await fetch(resolvePublicAssetUrl('description.txt'))
    if (!response.ok) return
    exhibitionDescriptionText.value = await response.text()
    exhibitionDescriptionVersion.value += 1
  } catch {
    // 文本加载失败时回退到内置文案
  }
}

function resolveArtifactDescriptionContent(periodTitle: string, artifactTitle: string, fallback: string): string {
  const raw = exhibitionDescriptionText.value
  if (!raw) return fallback

  const lines = raw.split(/\r?\n/)
  const numberedTitlePattern = /^\s*\d+\.\s*(.+?)\s*$/
  const normalizedArtifactTitle = normalizeForCompare(artifactTitle)
  const periodAnchor = `——${periodTitle}`
  const periodHeaderPattern = /[（(]\d{4}[^）)]*[）)]\s*——/

  const isPeriodHeaderLine = (line: string): boolean => {
    return periodHeaderPattern.test(line.replace(/\s+/g, ''))
  }

  const findSectionInLines = (sourceLines: string[], stopAtPeriodHeader: boolean): string => {
    let startIndex = -1

    for (let i = 0; i < sourceLines.length; i += 1) {
      const line = sourceLines[i]
      const matched = line.match(numberedTitlePattern)
      if (!matched) continue
      const candidateTitle = normalizeForCompare(matched[1])
      if (candidateTitle === normalizedArtifactTitle) {
        startIndex = i
        break
      }
    }

    if (startIndex === -1) {
      const exactTitlePattern = new RegExp(`^\\s*${escapeRegExp(artifactTitle)}\\s*$`)
      startIndex = sourceLines.findIndex((line) => exactTitlePattern.test(line.trim()))
      if (startIndex === -1) return ''
    }

    let endIndex = sourceLines.length
    for (let i = startIndex + 1; i < sourceLines.length; i += 1) {
      const line = sourceLines[i]
      if (numberedTitlePattern.test(line) || (stopAtPeriodHeader && isPeriodHeaderLine(line))) {
        endIndex = i
        break
      }
    }

    return sourceLines.slice(startIndex, endIndex).join('\n').trim()
  }

  const periodStart = lines.findIndex((line) => line.includes(periodAnchor))
  let periodLines: string[] = []

  if (periodStart !== -1) {
    let periodEnd = lines.length
    for (let i = periodStart + 1; i < lines.length; i += 1) {
      if (isPeriodHeaderLine(lines[i])) {
        periodEnd = i
        break
      }
    }
    periodLines = lines.slice(periodStart, periodEnd)
    const sectionInPeriod = findSectionInLines(periodLines, false)
    if (sectionInPeriod) return sectionInPeriod
  }

  // 二次兜底：跨时期全局按标题检索，仍然返回 description.txt 原文，不走摘要
  const sectionInAll = findSectionInLines(lines, true)
  if (sectionInAll) return sectionInAll

  // 仍未命中时返回该时期的整段原文，确保不展示摘要版本
  if (periodLines.length > 0) {
    const wholePeriod = periodLines.join('\n').trim()
    if (wholePeriod) return wholePeriod
  }

  return raw.trim() || fallback
}

function resolveHallVideoPath(hall: number, nodeId: string): string {
  if (hall === 2) {
    return nodeId === 'n2' ? 'exhibition/video/1.2.mp4' : 'exhibition/video/1.1.mp4'
  }
  if (hall === 1) {
    return 'exhibition/video/2.mp4'
  }
  if (hall === 3) {
    return 'exhibition/video/3.mp4'
  }
  return ''
}

async function playHallVideoForNode(nodeId: string) {
  const hall = currentSceneConfig.value?.hallId
  if (!hall) return

  const videoPath = resolveHallVideoPath(hall, nodeId)
  if (!videoPath) return

  isFullscreenVideo.value = true
  activeHallVideoUrl.value = resolvePublicAssetUrl(videoPath)
  await nextTick()

  if (!hallVideoElement.value) return
  hallVideoElement.value.currentTime = 0
  try {
    await hallVideoElement.value.play()
  } catch {
    // 浏览器可能拦截自动播放，此时保留 controls 供用户手动播放
  }
}

async function openVideoOverlay(videoUrl: string) {
  isFullscreenVideo.value = false
  activeHallVideoUrl.value = videoUrl
  await nextTick()

  if (!hallVideoElement.value) return
  hallVideoElement.value.currentTime = 0
  try {
    await hallVideoElement.value.play()
  } catch {
    // 浏览器可能拦截自动播放，此时保留 controls 供用户手动播放
  }
}

function closeHallVideo() {
  if (hallVideoElement.value) {
    hallVideoElement.value.pause()
    hallVideoElement.value.currentTime = 0
  }
  isFullscreenVideo.value = true
  activeHallVideoUrl.value = ''
}

function updateInteractiveImageViewport() {
  if (!interactiveImageFrame.value || !interactiveImageElement.value) {
    interactiveImageViewportStyle.value = {}
    return
  }

  const frameRect = interactiveImageFrame.value.getBoundingClientRect()
  const imageRect = interactiveImageElement.value.getBoundingClientRect()

  if (!frameRect.width || !frameRect.height || !imageRect.width || !imageRect.height) {
    interactiveImageViewportStyle.value = {}
    return
  }

  const left = imageRect.left - frameRect.left
  const top = imageRect.top - frameRect.top

  interactiveImageViewportStyle.value = {
    left: `${left}px`,
    top: `${top}px`,
    width: `${imageRect.width}px`,
    height: `${imageRect.height}px`,
  }
}

async function syncInteractiveImageViewport() {
  await nextTick()
  updateInteractiveImageViewport()
}

function handleInteractiveImageLoad() {
  void syncInteractiveImageViewport()
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
  return [
    ...buildNavigationMarkers(currentNode.value),
    ...buildQaGameMarkers(currentNode.value),
    ...artifactMarkers.value,
  ]
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
    tooltip: spot.videoPath ? `点击播放${spot.title}` : `点击查看${spot.title}`,
    data: {
      kind: 'artifact',
      title: spot.title,
      imageUrl: spot.imagePath ? resolvePublicAssetUrl(spot.imagePath) : undefined,
      videoUrl: spot.videoPath ? resolvePublicAssetUrl(spot.videoPath) : undefined,
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
      viewer.rotate({
        yaw: normalizeAngle(targetNode.defaultView.yaw),
        pitch: normalizeAngle(targetNode.defaultView.pitch),
      })
      if (typeof targetNode.defaultView.zoom === 'number') {
        viewer.zoom(targetNode.defaultView.zoom)
      }
    } else {
      await viewer.setPanorama(targetNode.panoramaUrl)
      applyNodeView(targetNode)
    }

    currentNodeId.value = targetNode.nodeId
    await loadArtifactMarkers()
    await rebuildMarkers()
    await playHallVideoForNode(targetNode.nodeId)
  } catch (error) {
    console.error('场景切换失败:', error)
  } finally {
    isSwitching.value = false
  }
}

function showArtifactModal(data: ArtifactMarkerData) {
  if (data.videoUrl) {
    closeArtifactModal()
    void openVideoOverlay(data.videoUrl)
    return
  }

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
  void ensureExhibitionDescriptionLoaded()
}

function closeArtifactModal() {
  activeHotspotId.value = null
  interactiveImageViewportStyle.value = {}
  activeImageModal.value = null
}

function selectArtifactHotspot(hotspotId: string) {
  activeHotspotId.value = activeHotspotId.value === hotspotId ? null : hotspotId
}

function clearSelectedArtifact() {
  activeHotspotId.value = null
}

function handleGlobalKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return

  if (isQaGameModalOpen.value) {
    closeQaGameModal()
    return
  }

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

    if (data.kind === 'qa-game') {
      await openQaGameModal()
      return
    }

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
  await playHallVideoForNode(entryNode.nodeId)

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
  closeHallVideo()
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
    void syncInteractiveImageViewport()
  },
)

onMounted(async () => {
  document.addEventListener('keydown', handleGlobalKeydown)
  window.addEventListener('resize', updateInteractiveImageViewport)
  await initViewer()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
  window.removeEventListener('resize', updateInteractiveImageViewport)
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

.psv-qa-marker {
  position: relative;
  width: 84px;
  height: 84px;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: auto;
  cursor: pointer;
}

.psv-qa-marker__pulse {
  position: absolute;
  inset: 8px;
  border-radius: 9999px;
  border: 2px solid rgba(241, 208, 147, 0.95);
  box-shadow:
    0 0 16px rgba(244, 197, 108, 0.82),
    inset 0 0 12px rgba(255, 240, 211, 0.35);
  animation: qa-pulse 1.55s ease-in-out infinite;
}

.psv-qa-marker__core {
  position: relative;
  border-radius: 9999px;
  background: rgba(93, 55, 21, 0.84);
  color: rgba(255, 244, 225, 0.96);
  padding: 6px 11px;
  font-size: 12px;
  line-height: 1;
  letter-spacing: 0.02em;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.28);
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

@keyframes qa-pulse {
  0%,
  100% {
    transform: scale(0.96);
    opacity: 0.78;
  }
  50% {
    transform: scale(1.08);
    opacity: 1;
  }
}

.hotspot-number-button {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 16px;
  margin: 0;
  border: 0;
  padding: 0;
  background: transparent;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hotspot-number-button__dot {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 9999px;
  border: 1px solid rgba(171, 146, 112, 0.65);
  background: rgba(246, 235, 220, 0.95);
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.hotspot-number-button:hover .hotspot-number-button__dot,
.hotspot-number-button.is-active .hotspot-number-button__dot {
  transform: scale(1.2);
  border-color: rgba(194, 153, 99, 0.95);
  background: rgba(194, 153, 99, 0.92);
}

.hotspot-number-rail {
  bottom: clamp(10px, 2.4%, 24px);
  left: clamp(10px, 2.4%, 22px);
  right: clamp(10px, 2.4%, 22px);
  width: auto;
  padding: 8px clamp(10px, 2.6vw, 18px);
  display: grid;
  grid-template-columns: repeat(var(--hotspot-count, 1), minmax(0, 1fr));
  justify-items: center;
  align-items: center;
}

.artifact-description-mask {
  background: rgba(18, 16, 12, 0.32);
  backdrop-filter: blur(1px);
}

.artifact-description-modal {
  pointer-events: auto;
}

.artifact-modal-enter-active,
.artifact-modal-leave-active {
  transition: all 0.2s ease;
}

.artifact-modal-enter-from,
.artifact-modal-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

@media (max-width: 640px) {
  .hotspot-number-rail {
    left: 8px;
    right: 8px;
    padding: 6px 10px;
  }

  .hotspot-number-button {
    height: 14px;
  }

  .hotspot-number-button__dot {
    width: 9px;
    height: 9px;
  }

  .artifact-description-modal {
    width: calc(100% - 16px);
  }
}
</style>
