<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {RouterLink} from 'vue-router';
import {useColorMode} from '@vueuse/core';
import {Motion} from '@oku-ui/motion';
import Cookies from 'js-cookie';
import {useRouter} from 'vue-router';
import {Undo2} from 'lucide-vue-next';

import {Reg, GameMenu} from '@/components/';

import {useUserStore} from '@/stores/storage';
import {Typer} from '@/components/ui/typer/';
import {Button} from '@/components/ui/button';
import {useToast} from '@/components/ui/toast';

const userStore = useUserStore();
const colorMode = useColorMode();
const router = useRouter();
const {toast} = useToast();

const showSecondText = ref<boolean>(false);
const gameLoaded = ref<boolean>(false);
const room = ref<any>({});
const roomExpired = ref<boolean>(false);

const isVisited = ref<boolean>(Cookies.get('isVisited') === 'false');

onMounted(async () => {
  const savedRoom = Cookies.get('room');
  const parsedRoom = savedRoom ? JSON.parse(savedRoom) : null;

  if (!savedRoom) {
    gameLoaded.value = false;
  }

  isVisited.value = Cookies.get('isVisited') === 'true';

  if (!isVisited.value) {
    Cookies.set('isVisited', 'true', {expires: 1});
  }

  console.log(parsedRoom);

  if (parsedRoom) {
    const roomExpirationDate = new Date(Cookies.get('room'));

    if (roomExpirationDate < new Date() && savedRoom) {
      roomExpired.value = true;

      toast({
        title: 'Эта комната истекла'
      });

      Cookies.remove('room');
    } else {
      userStore.setRoom(parsedRoom);
      room.value = userStore.getRoom;
      gameLoaded.value = true;
    }
  }
});
</script>

<template>
  <div class="h-[80vh] flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div v-if="!isVisited" class="w-full text-center text-2xl font-medium">
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

      <div
        v-else
        class="w-full flex flex-col items-center text-center text-2xl font-medium"
      >
        <div class="">Добро пожаловать в StoryJam</div>

        <div class="">Создай уникальную историю вместе с друзьями!</div>
      </div>

      <Reg v-if="!userStore.getUser.username" />

      <div class="flex items-center gap-1" v-else>
        <GameMenu class="flex flex-col items-center gap-1" />

        <Button
          v-if="!roomExpired && gameLoaded"
          class="flex items-center gap-1"
          @click="() => router.push('/room/' + room.code)"
        >
          <Undo2 :size="20" /> Прошлая игра
        </Button>
      </div>
    </div>
  </div>
</template>
