import { createApp } from 'vue';
import App from './App.vue';
import BootstrapVue3 from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import 'bootstrap/dist/css/bootstrap.css';
import router from './router/index.js';
import './styles/markdown.css'

const APP = createApp(App);

APP.use(router);
APP.use(BootstrapVue3);
APP.mount('#app');
