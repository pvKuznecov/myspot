import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView.vue')
    },
    {
      path: '/articles/:slug', // :slug - это динамическая часть
      name: 'Article',
      component: () => import('@/views/ArticleView.vue'),
      // Пропс, чтобы не дергать useRoute внутри компонента (опционально)
      props: true 
    },
    // Страница со списком всех статей (каталог)
    {
      path: '/articles',
      name: 'ArticlesList',
      component: () => import('@/views/ArticlesList.vue')
    }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router