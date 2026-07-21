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
        component: () => import('@/views/ArticlesListView/ArticlesListView.vue')
    },
    {
        path: '/authors',
        name: 'Authors',
        component: () => import('@/views/AuthorsView/AuthorsView.vue')
    },
    {
        path: '/circles',
        name: 'Circles',
        component: () => import('@/views/CirclesListView/CirclesListView.vue')
    },
    {
        path: '/circles/:slug', // :slug - это динамическая часть
        name: 'Circle',
        component: () => import('@/views/CircleView/CircleView.vue'),
        // Пропс, чтобы не дергать useRoute внутри компонента (опционально)
        props: true
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router