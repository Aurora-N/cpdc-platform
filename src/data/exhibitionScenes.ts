export type AngleValue = number | `${number}deg` | `${number}rad`

export interface NavigationSpotConfig {
  id: string
  label: string
  targetNodeId: string
  position: {
    yaw: AngleValue
    pitch: AngleValue
  }
  rotation: number
}

export interface PanoramaNodeConfig {
  nodeId: string
  panoramaUrl: string
  defaultView: {
    yaw: AngleValue
    pitch: AngleValue
    zoom?: number
  }
  navigationSpots: NavigationSpotConfig[]
}

export interface BlackHoleMitigationConfig {
  enabled: boolean
  pitchClamp: {
    min: AngleValue
    max: AngleValue
  }
  maskStyle: 'fog-gradient'
}

export interface HallSceneConfig {
  hallId: number
  caption: string
  entryNodeId: string
  enableArtifactHotspots: boolean
  blackHoleMitigation?: BlackHoleMitigationConfig
  nodes: PanoramaNodeConfig[]
}

export const hallSceneConfigs: HallSceneConfig[] = [
  {
    hallId: 1,
    caption: '工坊主题展厅',
    entryNodeId: 'main',
    enableArtifactHotspots: false,
    nodes: [
      {
        nodeId: 'main',
        panoramaUrl: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/exhibition/3.jpg',
        defaultView: {
          yaw: 0,
          pitch: 0,
          zoom: 50,
        },
        navigationSpots: [],
      },
    ],
  },
  {
    hallId: 2,
    caption: '发展脉络展厅',
    entryNodeId: 'n1',
    enableArtifactHotspots: false,
    blackHoleMitigation: {
      enabled: true,
      pitchClamp: {
        min: '-8deg',
        max: '14deg',
      },
      maskStyle: 'fog-gradient',
    },
    nodes: [
      {
        nodeId: 'n1',
        panoramaUrl:
          'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/exhibition/%E5%B1%95%E5%8E%851.1%E6%94%B9%E7%89%88.jpg',
        defaultView: {
          yaw: 0,
          pitch: 0,
          zoom: 50,
        },
        navigationSpots: [
          {
            id: 'n1-to-n2',
            label: '前往内厅',
            targetNodeId: 'n2',
            position: {
              yaw: 2.419427728294724,
              pitch: 0.06681094875379578,
            },
            rotation: -30,
          },
        ],
      },
      {
        nodeId: 'n2',
        panoramaUrl:
          'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/exhibition/%E5%B1%95%E5%8E%851.2%E6%94%B9%E7%89%88.jpg',
        defaultView: {
          yaw: 0,
          pitch: 0,
          zoom: 50,
        },
        navigationSpots: [
          {
            id: 'n2-to-n1',
            label: '返回入口',
            targetNodeId: 'n1',
            position: {
              yaw: 2.496342548412912,
              pitch: 0.07603252228653612,
            },
            rotation: -26,
          },
        ],
      },
    ],
  },
  {
    hallId: 3,
    caption: '华彩新章展厅',
    entryNodeId: 'main',
    enableArtifactHotspots: false,
    nodes: [
      {
        nodeId: 'main',
        panoramaUrl: 'https://goldseed.oss-cn-guangzhou.aliyuncs.com/goldSeed/exhibition/2.jpg',
        defaultView: {
          yaw: 0,
          pitch: 0,
          zoom: 50,
        },
        navigationSpots: [],
      },
    ],
  },
]

export function getHallSceneConfig(hallId: number): HallSceneConfig | undefined {
  return hallSceneConfigs.find((config) => config.hallId === hallId)
}

export function getNodeConfig(sceneConfig: HallSceneConfig, nodeId: string): PanoramaNodeConfig | undefined {
  return sceneConfig.nodes.find((node) => node.nodeId === nodeId)
}
