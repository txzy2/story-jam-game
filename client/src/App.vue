<script setup lang="ts">
import {onMounted, ref, inject} from 'vue';
import {useRoute, RouterLink} from 'vue-router'; // Импортируем RouterLink
import {Socket} from 'socket.io-client';

import {Loader} from '@/components/ui/loader';
import Toaster from '@/components/ui/toast/Toaster.vue';
import {Header} from '@/components/';

const socket = inject('socket') as Socket;
const route = useRoute();

const loader = ref<boolean>(true);
const error = ref<boolean>(false);

onMounted(() => {
  if (!socket) {
    console.error('Socket not found');
    error.value = true;
    return;
  }

  socket.on('connect', () => {
    console.log('Socket connected');

    const timeout = setTimeout(() => {
      loader.value = false;
    }, 2000);

    return () => clearTimeout(timeout);
  });

  return () => {
    socket.off('connect');
  };
});

if (socket) {
  socket.on('onNewUser', (data: {msg: string; content: string}) => {
    console.log(data);
  });
}
</script>

<template>
  <Header />

  <RouterView v-if="!loader" />

  <Loader
    v-else
    :title="{text: error ? 'Загрузка...' : '', need: error ? true : false}"
    :iconSize="30"
    :needSub="error ? false : true"
  />

  <footer class="h-[10vh] flex items-center justify-center gap-3">
    <div class="flex flex-col items-center gap-1">
      <RouterLink
        v-show="route.path !== '/'"
        to="/"
        class="text-sm underline transition ease-in-out hover:scale-110"
      >
        Главная страница
      </RouterLink>

      <RouterLink
        v-show="route.path !== '/about'"
        to="/about"
        class="text-sm underline transition ease-in-out hover:scale-110"
      >
        Правила игры
      </RouterLink>
    </div>

    <a
      class="px-3 py-1 font-medium text-sm border rounded-lg underline transition ease-in-out hover:scale-105"
      target="_blank"
      href="https://github.com/txzy2/nuxt-game"
      >GitHub</a
    >

    <p class="text-sm underline">©2024 StoryJam</p>
  </footer>

  <Toaster />
</template>
