import '@/assets/css/global.css';

import {createApp} from 'vue';
import {createPinia} from 'pinia';

import io from 'socket.io-client';
import App from './App.vue';
import router from './router';

const socket = io('http://localhost:4200');

const app = createApp(App);

app.provide('socket', socket);

app.use(createPinia());
app.use(router);

app.mount('#app');
