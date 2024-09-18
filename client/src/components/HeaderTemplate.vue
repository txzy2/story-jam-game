<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from 'vue';
import {useColorMode} from '@vueuse/core';
import {RouterLink} from 'vue-router';
import {CirclePause, CirclePlay, Loader} from 'lucide-vue-next';

import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import {Switch} from '@/components/';
import {path} from '@/utils/imgs';

import {useUserStore} from '@/stores/storage';

const userStorage = useUserStore();
const username = ref<string>(userStorage.getUser.username);
const mode = useColorMode();

const selectedValue = ref<string>(userStorage.getUser.avatar);

const isPopOpen = ref<boolean>(false);
const isMusicPlaying = ref<boolean>(false);

const maxLength: number = 15;
const remainingCharacters = computed(() => username.value.length);

let backgroundMusic: HTMLAudioElement;

onMounted(() => {
  backgroundMusic = new Audio('/background.mp3');
  backgroundMusic.loop = true;
});

const changeName = async (event: Event) => {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);

  const values: {[key: string]: string} = {};
  formData.forEach((value, key) => {
    values[key] = value.toString();
  });

  userStorage.setUser(values.username);

  console.log(values.username);

  isPopOpen.value = false;
};

const toggleMusic = () => {
  if (isMusicPlaying.value) {
    backgroundMusic.pause();
  } else {
    backgroundMusic.play().catch(error => {
      console.error('Не удалось воспроизвести музыку:', error);
    });
  }
  isMusicPlaying.value = !isMusicPlaying.value;
};

onBeforeUnmount(() => {
  if (backgroundMusic) {
    backgroundMusic.pause();
  }
});
</script>

<template>
  <div class="header flex items-center justify-between m-auto">
    <RouterLink class="flex items-center gap-1 hover:scale-105" to="/">
      <img v-if="mode === 'dark'" src="/logo5.png" width="130" height="130" />

      <img v-else src="/logo6.png" width="130" height="130" />
    </RouterLink>

    <div class="flex items-center gap-2">
      <div class="flex items-center">
        <Button
          variant="ghost"
          class="p-2"
          title="Включить/выключить музыку"
          @click="toggleMusic"
        >
          <component
            :is="isMusicPlaying ? CirclePause : CirclePlay"
            :size="23"
          />
        </Button>

        <Switch />
      </div>

      <Popover v-if="userStorage.getUser.id">
        <PopoverTrigger>
          <div
            title="Профиль"
            class="flex items-center gap-1"
            @click="isPopOpen = true"
          >
            <img
              :src="userStorage.getUser.avatar"
              height="40"
              width="40"
              class="rounded-full object-cover"
            />
            <span
              class="font-medium underline hover:text-blue-500 transition-colors duration-200 ease-in-out"
            >
              {{ userStorage.getUser.username }}
            </span>
          </div>
        </PopoverTrigger>

        <PopoverContent
          v-if="isPopOpen"
          class="w-[400px] flex flex-col gap-2 mt-3 me-3"
        >
          <Label>
            <span class="text-[16px]">Редактировать профиль</span> <br />
            ID: {{ userStorage.getUser.id }}
          </Label>

          <form
            @submit="changeName"
            id="editForm"
            class="flex items-center gap-2"
          >
            <div class="w-[35%]">
              <Select v-model="selectedValue">
                <SelectTrigger class="h-[100px]">
                  <img :src="userStorage.getUser.avatar" height="70" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-if="selectedValue !== path.man1"
                      :value="path.man1"
                    >
                      <img :src="path.man1" height="70" width="70" />
                    </SelectItem>
                    <SelectItem
                      v-if="selectedValue !== path.man2"
                      :value="path.man2"
                    >
                      <img :src="path.man2" height="70" width="70" />
                    </SelectItem>
                    <SelectItem
                      v-if="selectedValue !== path.women1"
                      :value="path.women1"
                    >
                      <img :src="path.women1" height="70" width="70" />
                    </SelectItem>
                    <SelectItem
                      v-if="selectedValue !== path.women2"
                      :value="path.women2"
                    >
                      <img :src="path.women2" height="70" width="70" />
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div class="w-[65%] flex items-center gap-1">
              <Input
                class="w-full h-9 font-bold"
                name="username"
                placeholder="Новый никнейм"
                v-model="username"
                :maxLength="maxLength"
              />

              <p class="text-[13px] mt-auto text-right">
                {{ remainingCharacters }}/15
              </p>
            </div>
          </form>

          <Button
            class="w-[30%] ml-auto"
            type="submit"
            form="editForm"
            :disabled="!username"
          >
            <Loader v-if="!username" class="animate-spin" />
            <span v-else>Применить</span>
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  </div>
</template>

<style scoped>
.header {
  width: 95vw;
  height: 10vh;
}
</style>
