import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import VuejsDialog from 'vuejs-dialog';
import 'vuetify/styles';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'vuejs-dialog/dist/vuejs-dialog.min.css'; // Don't forget the CSS for vuejs-dialog
import '@fortawesome/fontawesome-free/css/all.min.css'
import ElementPlus from 'element-plus';

// Initialize the app first
const app = createApp(App);

// Initialize plugins
const vuetify = createVuetify();
const pinia = createPinia();

// Apply plugins to the app
app.use(vuetify);
app.use(pinia);
app.use(VuejsDialog);
app.use(router);
app.use(ElementPlus);

// Mount the app
app.mount('#app');