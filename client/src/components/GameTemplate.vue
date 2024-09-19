<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {useColorMode} from '@vueuse/core';
import {SendHorizontal} from 'lucide-vue-next';

import {useUserStore} from '@/stores/storage';

import {Badge} from '@/components/ui/badge';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';

const userStorage = useUserStore();
const colorMode = useColorMode();

const room = ref<any>(userStorage.getRoom);

console.log(userStorage.getRoom);

const timer = ref(room.value.roundTime);
const text = ref<string>('');

const startTimer = () => {
  if (timer.value > 0) {
    setTimeout(() => {
      timer.value--;
      startTimer();
    }, 1000);
  }
};

onMounted(() => {
  startTimer();
});
</script>

<template>
  <div class="h-[80vh] flex items-center justify-center gap-2">
    <div class="h-[50%] w-[15%] flex flex-col items-center">
      <Badge class="h-[25px] rounded-sm">Игроки</Badge>

      <ul class="flex flex-col items-start gap-2 mt-5">
        <li
          v-for="player in room.players"
          :key="player.userId"
          class="flex items-center gap-2"
        >
          <img
            :src="player.avatar"
            :alt="'Player' + player.avatar"
            class="w-8 h-8 rounded-full"
          />
          <div class="flex flex-col items-center leading-none">
            <pre>{{ player.username }}</pre>
            <p
              v-if="player.userId === room.ownerId"
              class="text-[12px] font-bold"
            >
              (Создатель)
            </p>
          </div>
        </li>
      </ul>
    </div>

    <div class="relative h-[90%] w-[80%] flex flex-col items-center">
      <div class="w-[90%] h-[90%] relative">
        <div
          class="w-[90%] h-[10%] flex items-center justify-between border-b border-[#808080]"
        >
          <h2 class="text-xl">{{ room.title }}</h2>

          <Badge
            class="flex items-center gap-1 px-2 rounded-sm"
            :class="{'text-[#800000]': timer <= 10}"
          >
            Осталось времени: {{ timer }}
          </Badge>
        </div>

        <div class="cloud-text">
          {{ text }}
        </div>
      </div>

      <div class="w-[90%] absolute bottom-2 flex items-center gap-2">
        <Input
          type="text"
          v-model="text"
          placeholder="Напиши предложение"
          class="w-[95%] rounded-xl"
          :class="{
            'shadow-md shadow-[0_4px_10px_0_rgba(255,255,255,0.5)] bg-[#1c1c1c]':
              colorMode === 'dark',
            'shadow-md shadow-[0_4px_10px_0_rgba(0,0,0,0.5)]':
              colorMode === 'light'
          }"
        />

        <Button variant="ghost">
          <SendHorizontal />
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cloud-text {
  position: absolute;
  bottom: 2px;
  padding-left: 8px;
  padding-right: 8px;
  padding-top: 4px;
  padding-bottom: 4px;
  background-color: white;
  /* Цвет облака */
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-size: 16px;
  color: black;
}
</style>

<!-- :class="{ -->
<!--   'border-white': colorMode === 'dark', -->
<!--   'border-black': colorMode === 'light' -->
<!-- }" -->
