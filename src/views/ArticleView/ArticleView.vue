<template src="./template.html"></template>
<style src="./style.css"></style>
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
        
                    let slug = this.$route.params.slug;
                    slug = slug.replace(/\s+/g, '-');
        
                    if (!slug) {
                        throw new Error('Не указана статья');
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

