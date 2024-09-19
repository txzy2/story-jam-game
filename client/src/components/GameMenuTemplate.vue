<script setup lang="ts">
import {ref, watch, computed, inject} from 'vue';
import confetti from 'canvas-confetti';
import {useColorMode} from '@vueuse/core';
import {v4 as uuidv4} from 'uuid';

import {
  SquarePlus,
  DoorOpen,
  Cable,
  Loader,
  SendHorizonal
} from 'lucide-vue-next';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {Input} from '@/components/ui/input';
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput
} from '@/components/ui/number-field';
import {Progress} from '@/components/ui/progress';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {ToastAction} from '@/components/ui/toast';

import {useUserStore} from '@/stores/storage';
import {useRouter} from 'vue-router';
import axios from 'axios';
import {Socket} from 'socket.io-client';
import {useToast} from './ui/toast';

const userStorage = useUserStore();
const colorMode = useColorMode();

const progress = ref<number>(0);
const connect = ref<string>('');
const activeButton = ref('create');
const userCount = ref<number>(3);

const roomName = ref<string>('');
const roundTime = ref<string>('');

const maxLength: number = 15;
const remainingCharacters = computed(() => roomName.value.length);

const router = useRouter();
const socket = inject('socket') as Socket;
const {toast} = useToast();

const updateProgress = () => {
  let filledFields = 0;
  const totalFields = 2;

  if (roomName.value) filledFields++;
  if (roundTime.value) filledFields++;

  progress.value = (filledFields / totalFields) * 100;
};

const sound = new Audio('/notification.wav');

const submitForm = async (e: any) => {
  e.preventDefault();
  confetti({
    particleCount: 80,
    spread: 90,
    origin: {y: 0.8}
  });

  const request = await axios.post('http://localhost:4200/api/room/create', {
    id: uuidv4(),
    title: roomName.value,
    maxPlayers: userCount.value,
    roundTime: Number(roundTime.value),
    owner: {
      id: userStorage.getUser.id,
      username: userStorage.getUser.username,
      avatar: userStorage.getUser.avatar
    }
  });

  if (request.status === 200) {
    sound.play();

    socket.emit('joinRoom', request.data.code);

    userStorage.setRoom(request.data);
    router.push(`/room/${request.data.code}`);
  }
};

const submitFormJoin = async (e: any) => {
  e.preventDefault();

  if (connect.value) {
    try {
      const request = await axios.post('http://localhost:4200/api/room/join', {
        code: connect.value,
        player: {
          id: userStorage.getUser.id,
          username: userStorage.getUser.username,
          avatar: userStorage.getUser.avatar
        }
      });

      socket.emit('joinRoom', connect.value);

      userStorage.setRoom(request.data);
      router.push('/room/' + connect.value);
    } catch (error: any) {
      if (error.response && error.response.status === 400) {
        toast({
          title: 'Комната уже заполнена',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Произошла ошибка при подключении к комнате',
          variant: 'destructive',
          action: h(
            ToastAction,
            {
              altText: 'Try again'
            },
            {
              default: () => 'Try again'
            }
          )
        });
      }
    }
  }
};

const toggleBtn = (type: string) => {
  if (activeButton.value === type) {
    activeButton.value = '';
  } else {
    activeButton.value = type;
  }
};

watch([roomName, roundTime], updateProgress);
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button
        :class="{
          'anim_gradient--dark': colorMode === 'dark',
          'anim_gradient--light': colorMode === 'light'
        }"
      >
        Начать играть</Button
      >
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle class="flex items-center justify-center gap-1">
          <DoorOpen :size="20" /> Настройка комнаты
        </DialogTitle>
      </DialogHeader>

      <div class="w-full flex items-center justify-center gap-3">
        <Button
          class="w-full flex items-center gap-1"
          :variant="activeButton === 'create' ? 'default' : 'secondary'"
          :active="activeButton === 'create'"
          @click="toggleBtn('create')"
        >
          <SquarePlus :size="20" /> Создать комнату
        </Button>

        <Button
          class="w-full flex items-center gap-1"
          :variant="activeButton === 'join' ? 'default' : 'secondary'"
          :active="activeButton === 'join'"
          @click="toggleBtn('join')"
        >
          <Cable :size="20" /> Присоединиться
        </Button>
      </div>

      <form
        class="flex flex-col justify-center gap-3"
        v-if="activeButton === 'create'"
        @submit="submitForm"
      >
        <div>
          <Label class="mb-1" for="roomName">Название комнаты</Label>
          <Input
            id="roomName"
            placeholder="Комната"
            v-model="roomName"
            :maxLength="maxLength"
          />

          <p class="text-[13px] mt-auto text-right">
            {{ remainingCharacters }}/15
          </p>
        </div>

        <Label for="time_and_players">Время / кол-во игроков</Label>
        <div class="w-full flex items-center gap-2" id="time_and_players">
          <div class="w-[60%]">
            <Select v-model="roundTime">
              <SelectTrigger>
                <SelectValue placeholder="Время на раунд" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Время на раунд</SelectLabel>
                  <SelectItem value="30"> 30 секунд </SelectItem>
                  <SelectItem value="45"> 45 секунд </SelectItem>
                  <SelectItem value="60"> 1 минута </SelectItem>
                  <SelectItem value="120"> 2 минуты </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div class="w-[40%]" title="Максимальное количество игроков">
            <NumberField
              id="maxPlayers"
              :min="2"
              :max="8"
              :default-value="2"
              v-model="userCount"
            >
              <NumberFieldContent>
                <NumberFieldDecrement />
                <NumberFieldInput />
                <NumberFieldIncrement />
              </NumberFieldContent>
            </NumberField>
          </div>
        </div>

        <Progress v-model="progress" class="my-2 h-[15px]" />

        <Button
          class="w-[30%] ml-auto"
          :disabled="progress !== 100"
          type="submit"
        >
          <Loader v-if="progress !== 100" class="animate-spin" />
          <SendHorizonal v-else :size="20" />
        </Button>
      </form>

      <form
        v-if="activeButton === 'join'"
        class="flex flex-col justify-center gap-3"
        @submit="submitFormJoin"
      >
        <Label class="font-bold" for="connect">Ссылка на комнату</Label>
        <Input
          id="connect"
          v-model="connect"
          placeholder="F3k42$wjs"
          :maxLength="maxLength"
        />

        <Button
          class="w-[30%] ml-auto"
          :disabled="connect.length === 0"
          type="submit"
        >
          <Loader v-if="connect.length === 0" class="animate-spin" />
          <SendHorizonal v-else :size="20" />
        </Button>
      </form>

      <DialogFooter>
        <DialogDescription>
          <span
            class="font-bold cursor-pointer underline"
            @click="toggleBtn('create')"
            >Создай комнату</span
          >
          &nbsp;или&nbsp;
          <span
            class="font-bold cursor-pointer underline"
            @click="toggleBtn('join')"
            >присоединяйся</span
          >&nbsp;к существующей.
        </DialogDescription>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
