<script setup lang="ts">
import {ref} from 'vue';
import {RouterLink} from 'vue-router';
import {useColorMode} from '@vueuse/core';
import {Motion} from '@oku-ui/motion';

import {useUserStore} from '@/stores/storage';
import {Typer} from '@/components/ui/typer/';
import {Reg, GameMenu} from '@/components/';

const userStore = useUserStore();
const colorMode = useColorMode();

const showSecondText = ref<boolean>(false);
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

      <GameMenu v-else class="flex flex-col items-center gap-1" />
    </div>
  </div>
</template>
