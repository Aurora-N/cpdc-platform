import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/Home/HomeView.vue"
import AboutView from "@/views/About/AboutView.vue"
import ExhibitionView from "@/views/Exhibition/ExhibitionView.vue"
import CollectionsView from '@/views/Collections/CollectionsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
      path: '/exhibition_hall',
      name: 'exhibition_hall',
      component: ExhibitionView,
    },
  ],
})

export default router
