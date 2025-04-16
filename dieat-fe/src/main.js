import { createApp } from 'vue'
import App from './App.vue'
import router from './router';
import '@/assets/main.css'

import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import { createPinia } from 'pinia'

const pinia = createPinia();

const app = createApp(App);
app.use(router);
app.use(pinia);
app.use(VCalendar, {});
app.mount('#app');