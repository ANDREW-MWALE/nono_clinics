// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import your router
import '@fortawesome/fontawesome-free/css/all.css';

createApp(App)
  .use(router) // Register the router
  .mount('#app');

