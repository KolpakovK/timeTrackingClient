import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"

import "kolpakov_components/dist/style.css"
import vueComponents from 'kolpakov_components';

createApp(App).use(vueComponents).use(router).mount('#app');
