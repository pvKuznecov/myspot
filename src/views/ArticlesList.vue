<template>
  <div>
    <h1>Все статьи</h1>
    
    <div v-if="loading" class="loading">
      <p>⏳ Загрузка статей...</p>
    </div>

    <div v-else-if="error" class="error">
      <p>❌ Ошибка: {{ error }}</p>
    </div>

    <div v-else-if="articles.length === 0" class="empty">
      <p>📝 Статей пока нет</p>
      <p>Создайте файл в <code>src/content/articles/</code></p>
    </div>

    <article v-for="art in articles" :key="art.slug" class="article-item">
      <router-link :to="`/articles/${art.slug}`" class="article-link">
        <div v-if="art.image" class="article-image">
          <img 
            :src="art.image" 
            :alt="art.title" 
            loading="lazy"
            @error="handleImageError"
          />
        </div>
        <div v-else class="article-image-placeholder">
          <span>📄</span>
        </div>
        
        <div class="article-content">
          <h2>{{ art.title }}</h2>
          <div class="meta">
            <time>{{ formatDate(art.date) }}</time>
            <div class="tags">
              <span v-for="tag in art.tags" :key="tag" class="tag">
                #{{ tag }}
              </span>
            </div>
          </div>
          <p v-if="art.description" class="description">{{ art.description }}</p>
        </div>
      </router-link>
    </article>
  </div>
</template>

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

            console.log('Raw image path:', parsed.attributes.image)
            console.log('Processed image path:', image)
            
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

<style scoped>
.loading, .error, .empty {
  text-align: center;
  padding: 40px 20px;
  background: #1a1a1a;
  border-radius: 12px;
  margin: 20px 0;
  color: #888;
}

.error {
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
}

.article-item {
  margin: 30px 0;
  padding: 20px;
  background: #1a1a1a;
  border-radius: 12px;
  transition: transform 0.2s;
  overflow: hidden;
}

.article-item:hover {
  transform: translateY(-2px);
  background: #222;
}

.article-link {
  display: flex;
  gap: 20px;
  text-decoration: none;
  color: inherit;
}

.article-image {
  flex-shrink: 0;
  width: 200px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  background: #2d2d2d;
  position: relative;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.article-item:hover .article-image img {
  transform: scale(1.05);
}

.article-image-placeholder {
  flex-shrink: 0;
  width: 200px;
  height: 120px;
  border-radius: 8px;
  background: #2d2d2d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3em;
  color: #666;
}

.article-content {
  flex: 1;
}

.article-link h2 {
  color: #e0e0e0;
  margin: 0 0 10px 0;
  font-size: 1.5em;
}

.article-link h2:hover {
  color: #8ab4f8;
}

.meta {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

time {
  color: #666;
  font-size: 0.9em;
}

.description {
  color: #aaa;
  margin: 10px 0 0 0;
  line-height: 1.5;
}

.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  background: #2d2d2d;
  padding: 2px 12px;
  border-radius: 12px;
  font-size: 0.8em;
  color: #8ab4f8;
}

code {
  background: #2d2d2d;
  padding: 2px 8px;
  border-radius: 4px;
  color: #8ab4f8;
  font-size: 0.9em;
}

@media (max-width: 600px) {
  .article-link {
    flex-direction: column;
  }
  
  .article-image,
  .article-image-placeholder {
    width: 100%;
    height: 200px;
  }
}
</style>