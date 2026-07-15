<template src="./template.html"></template>
<style src="./style.css"></style>
<script>
    import fm from 'front-matter'

    export default {
        data() {
            return {
                articles: [],
                loading: false,
                error: null,
                baseUrl: import.meta.env.BASE_URL || '/'
            }
        },
        
        computed: {
            // Безопасный доступ к статьям
            safeArticles() {
                return this.articles.map(article => ({
                    ...article,
                    image: article.image || '',
                    title: article.title || 'Без названия',
                    description: article.description || '',
                    date: article.date || '1970-01-01',
                    tags: article.tags || []
                }))
            }
        },
        
        mounted() {
            this.loadArticles()
        },

        methods: {
            async loadArticles() {
                try {
                    this.loading = true
                    this.error = null
                    
                    const modules = import.meta.glob('@/content/articles/*.md', {
                        eager: false,
                        query: '?raw',
                        import: 'default'
                    });
                    
                    const paths = Object.keys(modules);
                    
                    if (paths.length === 0) {
                        this.articles = []
                        this.loading = false
                        return
                    }
                    
                    const loadedArticles = []
                    
                    for (const path of paths) {
                        try {
                            const importFn = modules[path]
                            const rawContent = await importFn()
                            
                            let content = rawContent
                            if (typeof content === 'object' && content !== null) {
                                content = content.default || content.toString?.() || JSON.stringify(content)
                            }
                            
                            if (typeof content !== 'string') {
                                console.error(`Файл ${path} не является строкой`)
                                continue
                            }
                            
                            const parsed = fm(content)
                            
                            let slug = path.split('/').pop().replace(/\.md$/, '')
                            slug = slug.replace(/\s+/g, '-')
                            
                            // Безопасная обработка картинки
                            let image = parsed.attributes.image || ''
                            
                            if (image) {
                                if (image.startsWith('http://') || image.startsWith('https://')) {
                                    // Внешняя картинка
                                } else if (image.startsWith('/')) {
                                    const cleanPath = image.replace(/^\//, '')
                                    image = `${this.baseUrl}${cleanPath}`
                                } else {
                                    image = `${this.baseUrl}images/${image}`
                                }
                            }
                            
                            loadedArticles.push({
                                slug: slug || 'unknown',
                                title: parsed.attributes.title || 'Без названия',
                                date: parsed.attributes.date || '1970-01-01',
                                description: parsed.attributes.description || '',
                                tags: Array.isArray(parsed.attributes.tags) ? parsed.attributes.tags : [],
                                image: image || '', // Всегда строка
                                content: parsed.body || ''
                            })
                            
                        } catch (err) {
                            console.error(`Ошибка загрузки ${path}:`, err)
                            this.error = err.message
                        }
                    }
                    
                    loadedArticles.sort((a, b) => {
                        const dateA = new Date(a.date)
                        const dateB = new Date(b.date)
                        return dateB - dateA
                    })
                    
                    this.articles = loadedArticles
                    
                } catch (err) {
                    console.error('Общая ошибка:', err)
                    this.error = err.message
                } finally {
                    this.loading = false
                }
            },
        
            formatDate(date) {
                if (!date || date === '1970-01-01') return 'Дата неизвестна'
                const d = new Date(date)
                if (isNaN(d.getTime())) return 'Некорректная дата'
                return d.toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })
            }
        }
    }
</script>