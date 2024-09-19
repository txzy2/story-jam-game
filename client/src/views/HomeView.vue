<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {RouterLink} from 'vue-router';
import {useColorMode} from '@vueuse/core';
import {Motion} from '@oku-ui/motion';
import Cookies from 'js-cookie';
import {useRouter} from 'vue-router';

import {Reg, GameMenu} from '@/components/';

import {useUserStore} from '@/stores/storage';
import {Typer} from '@/components/ui/typer/';
import {Button} from '@/components/ui/button';

const userStore = useUserStore();
const colorMode = useColorMode();
const router = useRouter();

const showSecondText = ref<boolean>(false);
const gameLoaded = ref<boolean>(false);
const room = ref<any>({});

onMounted(async () => {
  const savedRoom = Cookies.get('room');
  const parsedRoom = savedRoom ? JSON.parse(savedRoom) : null;

  console.log(parsedRoom);

  if (parsedRoom) {
    userStore.setRoom(parsedRoom);
    console.log(userStore.getRoom);
    room.value = userStore.getRoom;
    gameLoaded.value = true;
  }
});
</script>

<template>
  <div class="h-[80vh] flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div class="w-full text-center text-2xl font-medium">
        <Typer
          :strings="['Добро пожаловать в StoryJam']"
          :typeSpeed="50"
          :onComplete="
            () => {
              showSecondText = true;
            }
          "
        />

        <Motion
          v-if="showSecondText"
          :initial="{opacity: 0, scale: 0}"
          :animate="{opacity: 1, scale: 1}"
          :exit="{opacity: 0, scale: 0.3}"
        >
          <Typer
            :strings="['Создай уникальную историю вместе с друзьями!']"
            :typeSpeed="20"
          />
        </Motion>
      </div>

      <Reg v-if="!userStore.getUser.username" />

      <GameMenu
        v-else-if="!gameLoaded"
        class="flex flex-col items-center gap-1"
      />

      <Button
        v-else-if="gameLoaded && room && room.code"
        @click="() => router.push('/room/' + room.code)"
      >
        Прошлая игра
      </Button>
    </div>
  </div>
</template>
