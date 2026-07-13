<template>
  <div class="article-page">
    <div v-if="loading" class="loading">
      ⏳ Загрузка статьи...
    </div>
    
    <div v-else-if="error" class="error">
      ❌ {{ error }}
      <br>
      <router-link to="/articles">Вернуться к списку</router-link>
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
        
        const slug = this.$route.params.slug
        
        // Ищем файл через glob
        const modules = import.meta.glob('@/content/articles/*.md', {
          eager: false,
          query: '?raw',
          import: 'default'
        })
        
        let foundPath = null
        for (const path of Object.keys(modules)) {
          const fileName = path.split('/').pop().replace('.md', '')
          if (fileName === slug) {
            foundPath = path
            break
          }
        }
        
        if (!foundPath) {
          throw new Error(`Статья "${slug}" не найдена`)
        }
        
        // Импортируем как Vue-компонент
        const articleModule = await import(`@/content/articles/${slug}.md`)
        
        // Используем markRaw, чтобы Vue не делал компонент реактивным
        this.article = markRaw(articleModule.default)
        
      } catch (err) {
        console.error('Статья не найдена:', err)
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
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  background: #1a1a1a;
  border-radius: 12px;
  margin: 20px 0;
}

.error {
  color: #ff6b6b;
}

.article-content {
  background: #1a1a1a;
  padding: 40px;
  border-radius: 12px;
}

.article-content :deep(h1) {
  font-size: 2.2em;
  border-bottom: 2px solid #333;
  padding-bottom: 15px;
}

.article-content :deep(h2) {
  font-size: 1.8em;
  margin-top: 1.5em;
  color: #8ab4f8;
}

.article-content :deep(pre) {
  background: #0d0d0d;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
}

.article-content :deep(code) {
  background: #2d2d2d;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
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

.article-content :deep(p) {
  line-height: 1.8;
  color: #d0d0d0;
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
</style>