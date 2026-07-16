import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('../views/HomeView/HomeView.vue')
    },
    {
        path: '/about',
        name: 'about',
        component: () => import('../views/AboutView/AboutView.vue')
    },
    {
        path: '/blogs/:slug',
        name: 'Blog',
        component: () => import('@/views/BlogView/BlogView.vue'),
        props: true
    },
    {
        path: '/articles/:slug', // :slug - это динамическая часть
        name: 'Article',
        component: () => import('@/views/ArticleView/ArticleView.vue'),
        // Пропс, чтобы не дергать useRoute внутри компонента (опционально)
        props: true 
    },
    {
        path: '/articles',
        name: 'ArticlesList',
        component: () => import('@/views/ArticlesList/ArticlesList.vue')
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router