<template src="./template.html"></template>
<style src="./style.css"></style>
<script>
import fm from 'front-matter'

export default {
  name: 'ArticlesList',
  
  data() {
    return {
      articles: [],
      loading: true,
      error: null,
      baseUrl: import.meta.env.BASE_URL || '/'
    }
  },
  
  mounted() {
    this.loadArticles()
  },
  
  methods: {
    handleImageError(event) {
      // Если картинка не загрузилась, показываем заглушку
      event.target.style.display = 'none'
      // Ищем родительский контейнер и добавляем плейсхолдер
      const container = event.target.closest('.article-image')
      if (container) {
        const placeholder = document.createElement('span')
        placeholder.textContent = '🖼️'
        placeholder.style.cssText = `
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          font-size: 3em;
          background: #2d2d2d;
          color: #666;
        `
        container.appendChild(placeholder)
      }
    },
    
    async loadArticles() {
      try {
        this.loading = true
        this.error = null
        
        const modules = import.meta.glob('@/content/articles/*.md', {
          eager: false,
          query: '?raw',
          import: 'default'
        })
        
        const paths = Object.keys(modules)
        
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
            
            // Обработка картинки
            let image = parsed.attributes.image || ''
            
            if (image) {
              // Если путь начинается с http или https - оставляем как есть
              if (image.startsWith('http://') || image.startsWith('https://')) {
                // Внешняя картинка
              } 
              // Если путь начинается с / - добавляем baseUrl
              else if (image.startsWith('/')) {
                // Убираем лишние слеши
                const cleanPath = image.replace(/^\//, '')
                image = `${this.baseUrl}${cleanPath}`
              }
              // Относительный путь - пробуем разные варианты
              else {
                // Пробуем с baseUrl и без
                image = `${this.baseUrl}images/${image}`
              }
            }
            
            loadedArticles.push({
              slug: slug,
              title: parsed.attributes.title || 'Без названия',
              date: parsed.attributes.date || '1970-01-01',
              description: parsed.attributes.description || '',
              tags: Array.isArray(parsed.attributes.tags) ? parsed.attributes.tags : [],
              image: image,
              content: parsed.body || ''
            })
            
          } catch (err) {
            console.error(`Ошибка загрузки ${path}:`, err)
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