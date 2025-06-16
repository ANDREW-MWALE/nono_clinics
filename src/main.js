import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import VuejsDialog from 'vuejs-dialog';
import axios from 'axios'; // You need to import axios
import 'vuetify/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'vuejs-dialog/dist/vuejs-dialog.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'; // Don't forget Element Plus CSS

// Initialize the app first
const app = createApp(App);

// Initialize plugins
const vuetify = createVuetify();
const pinia = createPinia();

// Configure axios
axios.defaults.baseURL = 'http://localhost:8085/api';
app.config.globalProperties.$http = axios;

// Apply plugins to the app
app.use(vuetify);
app.use(pinia);
app.use(VuejsDialog);
app.use(router);
app.use(ElementPlus);

// Mount the app
app.mount('#app');