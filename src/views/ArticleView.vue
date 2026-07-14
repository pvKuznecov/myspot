<template>
  <div class="article-page">
    <div v-if="loading" class="loading">
      <div class="spinner">⏳</div>
      <p>Загрузка статьи...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <p>❌ {{ error }}</p>
      <router-link to="/articles" class="back-link">← Вернуться к списку</router-link>
    </div>
    
    <div v-else-if="article" class="article-content">
      <component :is="article" />
    </div>
  </div>
</template>

<script>
import { markRaw } from 'vue'

export default {
  name: 'ArticleView',
  
  data() {
    return {
      article: null,
      loading: true,
      error: null
    }
  },
  
  mounted() {
    this.loadArticle()
  },
  
  watch: {
    '$route.params.slug'() {
      this.loadArticle()
    }
  },
  
  methods: {
    async loadArticle() {
      try {
        this.loading = true
        this.error = null
        
        let slug = this.$route.params.slug
        slug = slug.replace(/\s+/g, '-')
        
        if (!slug) {
          throw new Error('Не указана статья')
        }
        
        // Пробуем импортировать напрямую
        try {
          const module = await import(`@/content/articles/${slug}.md`)
          this.article = markRaw(module.default)
        } catch (directError) {
          // Если не нашло, ищем через glob
          const modules = import.meta.glob('@/content/articles/*.md', {
            eager: false
          })
          
          let found = false
          for (const [path, importFn] of Object.entries(modules)) {
            const fileName = path.split('/').pop().replace(/\.md$/, '')
            const cleanFileName = fileName.replace(/\s+/g, '-')
            
            if (cleanFileName === slug || fileName === slug) {
              const module = await importFn()
              this.article = markRaw(module.default)
              found = true
              break
            }
          }
          
          if (!found) {
            throw new Error(`Статья "${slug}" не найдена`)
          }
        }
        
      } catch (err) {
        console.error('Ошибка загрузки статьи:', err)
        this.error = 'Статья не найдена'
        this.article = null
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.article-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 60px 20px;
  background: #1a1a1a;
  border-radius: 12px;
  margin: 40px 0;
}

.loading {
  color: #8ab4f8;
}

.spinner {
  font-size: 48px;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error {
  color: #ff6b6b;
}

.back-link {
  display: inline-block;
  margin-top: 15px;
  color: #8ab4f8;
  text-decoration: none;
  padding: 8px 20px;
  border: 1px solid #8ab4f8;
  border-radius: 6px;
  transition: all 0.3s;
}

.back-link:hover {
  background: #8ab4f8;
  color: #1a1a1a;
}

.article-content {
  /* background: #1a1a1a; */
  background-color: rgba(0, 0, 0, 0.3);
  padding: 40px;
  border-radius: 12px;
}

.article-content :deep(h1) {
  font-size: 2.2em;
  border-bottom: 2px solid #333;
  padding-bottom: 15px;
  margin-bottom: 30px;
}

.article-content :deep(h2) {
  font-size: 1.8em;
  margin-top: 1.5em;
  color: #8ab4f8;
}

.article-content :deep(h3) {
  font-size: 1.4em;
  margin-top: 1.2em;
  color: #a0c4ff;
}

.article-content :deep(p) {
  line-height: 1.8;
  color: #d0d0d0;
  margin: 16px 0;
}

.article-content :deep(pre) {
  background: #0d0d0d;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
}

.article-content :deep(code) {
  background: #2d2d2d;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
}

.article-content :deep(pre code) {
  background: transparent;
  padding: 0;
}

.article-content :deep(blockquote) {
  border-left: 4px solid #8ab4f8;
  padding-left: 20px;
  margin: 20px 0;
  color: #aaa;
  font-style: italic;
}

.article-content :deep(img) {
  max-width: 100%;
  border-radius: 8px;
  margin: 20px 0;
}

.article-content :deep(ul), 
.article-content :deep(ol) {
  padding-left: 25px;
  color: #d0d0d0;
}

.article-content :deep(li) {
  margin: 8px 0;
}

.article-content :deep(a) {
  color: #8ab4f8;
  text-decoration: none;
}

.article-content :deep(a:hover) {
  text-decoration: underline;
}

@media (max-width: 600px) {
  .article-content {
    padding: 20px;
  }
}
</style>