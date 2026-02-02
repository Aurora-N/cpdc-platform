import axios from "axios";
import router from "@/router";

// axios实例
const apiClient = axios.create({
  baseURL: '/api',// TODO: 切换到环境变量
  // baseURL: 'http://127.0.0.1:4523/m1/6366500-6062694-default',
  timeout: 5000,
  headers: {
    "ngrok-skip-browser-warning": "true"
  }
});

// 拦截器
// axios请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      // 添加 token 到请求头
      config.headers['token'] = token
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// axios响应式拦截器
apiClient.interceptors.response.use(
  // 成功的回调
  (res) => {
    // 检查业务状态码
    const data = res.data
    // 如果返回体包含 code 且不为 200，视为业务错误，抛出异常
    if (data && typeof data.code !== 'undefined' && data.code !== 200) {
      const message = data.message || data.msg || '操作失败'
      return Promise.reject({
        message,
        response: { data }
      })
    }
    return data
  },
  // 失败的回调
  (e) => {
    let message = '发生未知错误';

    if (e.response) {
      // 根据不同的状态码进行处理
      switch (e.response.status) {
        case 400:
          // 优先使用后端返回的错误信息
          message = e.response.data.msg || '请求参数错误';
          break;
        case 401:
          message = '未授权，请重新登录';
          // 清除用户信息
          try {
            // 动态导入 userStore，避免循环依赖
            import('@/stores/userStore').then(({ useUserStore }) => {
              const userStore = useUserStore()
              userStore.clearUserInfo()
            })
          } catch (error) {
            // 如果导入失败，直接清除 localStorage
            console.error('清除用户状态失败:', error)
          }
          // 无论如何都清除 localStorage
          localStorage.removeItem('token')
          localStorage.removeItem('userId')
          localStorage.removeItem('userName')
          
          // 跳转到登录页，并保存当前路径
          const currentPath = router.currentRoute.value.fullPath
          // 避免在登录页重复跳转
          if (currentPath !== '/login') {
            router.replace({
              path: '/login',
              query: { redirect: currentPath }
            }).catch(err => {
              // 忽略导航重复错误
              if (err.name !== 'NavigationDuplicated') {
                console.error('导航错误:', err)
              }
            })
          }
          break;
        case 403:
          message = '禁止访问';
          break;
        case 404:
          message = '请求资源不存在';
          break;
        default:
          message = e.response.data.msg || `服务器错误 (${e.response.status})`;
      }
    } else if (e.request) {
      // 2. 请求已发出，但没有收到响应（例如网络问题或超时）
      if (e.message.includes('timeout')) {
        message = '请求超时，请检查网络连接';
      } else {
        message = '网络错误，无法连接到服务器';
      }
    }

    // 统一显示错误提示
    console.error('API Error:', message)

    // 继续抛出错误，以便业务代码中的 .catch() 能捕获到
    return Promise.reject(e);
  },
)

export default apiClient;
