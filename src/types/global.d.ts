declare module '@/*' {
  const value: unknown
  export default value
}

// 声明 Vite 环境变量
declare const __BASE_PATH__: string
