import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap/dist/css/bootstrap.css';
import router from './router/index.js';

const APP = createApp(App);

APP.use(router);
APP.mount('#app');
