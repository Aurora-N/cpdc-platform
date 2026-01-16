import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@/views/Home/HomeView.vue'
import AboutView from '@/views/About/AboutView.vue'
import ExhibitionView from '@/views/Exhibition/ExhibitionView.vue'
import CollectionsView from '@/views/Collections/CollectionsView.vue'
import CollectionDetailView from '@/views/Collections/CollectionDetailView.vue'
import ViewerView from '@/views/Exhibition/ViewerView.vue'
import LoginView from '@/views/Auth/LoginView.vue'
import RegisterView from '@/views/Auth/RegisterView.vue'
import ProfileView from '@/views/Auth/ProfileView.vue'
import { useUserStore } from '@/stores/userStore'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    {
      path: '/collections',
      name: 'collections',
      component: CollectionsView,
    },
    {
      path: '/collections/:id',
      name: 'collection-detail',
      component: CollectionDetailView,
    },
    {
      path: '/exhibition_hall',
      name: 'exhibition_hall',
      component: ExhibitionView,
    },
    {
      path: '/exhibition_hall/:id',
      component: ViewerView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { requiresGuest: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: { requiresAuth: true },
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 需要登录的页面
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({
      path: '/login',
      query: { redirect: to.fullPath },
    })
    return
  }

  // 已登录用户访问登录/注册页面，重定向到首页
  if (to.meta.requiresGuest && userStore.isLoggedIn) {
    next('/')
    return
  }

  next()
})

export default router
