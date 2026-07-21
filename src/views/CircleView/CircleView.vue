<template src="./template.html"></template>
<style src="./style.css"></style>
<script>
    import { markRaw } from 'vue'

    export default {
        name: 'CircleView',
  
        data() {
            return {
                сircle: null,
                loading: true,
                error: null
            }
        },
  
        mounted() {
            this.loadCircle()
        },
  
        watch: {
            '$route.params.slug'() {
                this.loadCircle();
            }
        },
  
        methods: {
            async loadCircle() {
                try {
                    this.loading = true;
                    this.error = null;
        
                    let slug = this.$route.params.slug;
                    slug = slug.replace(/\s+/g, '-');
                    console.log('slug', slug);
        
                    if (!slug) {
                        throw new Error('Не указана статья');
                    }
        
                    // Пробуем импортировать напрямую
                    try {
                        const module = await import(`@/content/circles/${slug}.md`);
                        console.log('module', module);
                        this.сircle = markRaw(module.default);
                    } catch (directError) {
                        // Если не нашло, ищем через glob
                        const modules = import.meta.glob('@/content/circles/*.md', {
                            eager: false
                        });
                        console.log('modules', modules);
          
                        let found = false;
                        for (const [path, importFn] of Object.entries(modules)) {
                            const fileName = path.split('/').pop().replace(/\.md$/, '');
                            const cleanFileName = fileName.replace(/\s+/g, '-');
            
                            if (cleanFileName === slug || fileName === slug) {
                                const module = await importFn();
                                this.сircle = markRaw(module.default);
                                found = true;
                                break;
                            }
                        }
          
                        if (!found) {
                            throw new Error(`Статья "${slug}" не найдена`);
                        }
                    }
        
                } catch (err) {
                    console.error('Ошибка загрузки статьи:', err);
                    this.error = 'Статья не найдена';
                    this.сircle = null;
                } finally {
                    this.loading = false;
                }
            }
    }
}
</script>

