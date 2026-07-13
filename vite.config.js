import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Markdown from 'unplugin-vue-markdown/vite'
import Vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      // Говорим Vue, что он должен обрабатывать и .md файлы тоже
      include: [/\.vue$/, /\.md$/],
    }),
    vueDevTools(),
    Markdown({
      // Базовые настройки Markdown
      markdownItOptions: {
        html: true,        // Разрешаем HTML внутри Markdown
        linkify: true,     // Автоматические ссылки
        typographer: true, // Улучшенная типографика
      },
      // Обертка для каждой статьи (чтобы стили не конфликтовали)
      wrapperClasses: 'markdown-body',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/myspot/',
  // 👇 Добавляем блок build
  build: {
    outDir: 'docs', // Папка для сборки
  },
})