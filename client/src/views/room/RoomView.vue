<script setup lang="ts">
import {ref, onMounted, inject, watch} from 'vue';
import {useColorMode} from '@vueuse/core';
import {Copy, Pen, Loader, Play, X, Trash2} from 'lucide-vue-next';
import {Socket} from 'socket.io-client';
import {Motion} from '@oku-ui/motion';
import {useRouter} from 'vue-router';
import Coockies from 'js-cookie';

import {Game} from '@/components';

import {useToast} from '@/components/ui/toast';
import {useUserStore} from '@/stores/storage';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';

const userStore = useUserStore();
const socket = inject('socket') as Socket;
const {toast} = useToast();
const sound = new Audio('/notification.wav');
const colorMode = useColorMode();

const router = useRouter();

const roomInfo = ref<{room: any; users: any[]} | null>(null);
const room = ref<any>(userStore.getRoom);
const gameStarted = ref<boolean>(false);
const previousPlayers = ref(
  userStore.room.players.map(player => player.username)
);

const connected = ref<number>(userStore.room.players.length);

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast({
      title: 'Текст скопирован в буфер обмена'
    });
  });
};

onMounted(() => {
  socket.on('updateRoomInfo', (data: {room: any; users: any[]}) => {
    roomInfo.value = data;
    userStore.setRoom(data.room);

    console.log('Room state: ' + JSON.stringify(userStore.getRoom, null, 2));

    room.value = data.room;
  });

  socket.on('gameStarted', () => {
    gameStarted.value = true;
    toast({
      title: 'Игра началась!'
    });

    gameStarted.value = true;
  });

  const roomCode = userStore.getRoom.code;
  socket.emit('joinRoom', roomCode);

  socket.on('playerLeft', (data: {userID: string; updatedRoom: any}) => {
    toast({
      title: 'Игрок вышел из комнаты'
    });

    roomInfo.value = data.updatedRoom;
    userStore.setRoom(data.updatedRoom);
  });
});

const updateConnectedCount = () => {
  const newPlayers = userStore.room.players;
  const newCount = newPlayers.length;

  const newPlayerNicknames = newPlayers.map(player => player.username);
  const addedPlayers = newPlayerNicknames.filter(
    nickname => !previousPlayers.value.includes(nickname)
  );

  if (connected.value !== newCount) {
    connected.value = newCount;

    if (addedPlayers.length > 0) {
      toast({
        title: `Новое подключение: ${addedPlayers.join(', ')}`
      });

      sound.play();
    }

    previousPlayers.value = newPlayerNicknames;
  }
};

const startGame = () => {
  socket.emit('startGame', room.value.code);
};

const exitRoom = () => {
  socket.emit('exitRoom', room.value.code, userStore.getUser.id);

  Coockies.remove('room');
  router.push('/');
};

watch(
  () => userStore.room,
  newRoom => {
    room.value = newRoom;
    updateConnectedCount();
  },
  {immediate: true}
);
</script>

<template>
  <Motion :initial="{opacity: 0, scale: 0}" :animate="{opacity: 1, scale: 1}">
    <div
      class="h-[80vh] flex flex-col items-center justify-center gap-2"
      v-if="!gameStarted"
    >
      <div
        class="cursor-pointer flex flex-col items-center gap-1 font-bold rounded-sm"
      >
        <h2 class="flex items-center gap-2 text-xl">
          История
          <pre>{{ room.title.toLowerCase() }}</pre>

          <div v-if="userStore.getUser.id === room.ownerId">
            <Button
              class="h-[30px] cursor-pointer flex items-center justify-center px-2 gap-1 text-[13px] rounded-sm"
            >
              <Trash2 :size="20" />
              Удалить
            </Button>
          </div>
        </h2>

        <Badge
          title="Скопировать код комнаты"
          @click="copyToClipboard(room.code)"
          class="cursor-pointer flex items-center justify-center px-2 gap-2 text-[13px] rounded-sm"
        >
          {{ room.code }}
          <Copy :size="13" />
        </Badge>
      </div>

      <Motion
        :initial="{opacity: 0, scale: 0}"
        :animate="{opacity: 1, scale: 1}"
      >
        <div class="flex items-center gap-1">
          <ul>
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

              <Button
                v-if="
                  userStore.getUser.id === player.userId &&
                  userStore.getUser.id !== room.ownerId
                "
                class="p-0"
                title="Выйти из комнаты"
                variant="ghost"
                @click="exitRoom"
              >
                <X :size="20" />
              </Button>
            </li>
          </ul>
        </div>
      </Motion>

      <Badge
        v-if="connected !== room?.maxPlayers"
        class="flex items-center gap-1 px-2 rounded-sm"
      >
        <Loader :size="20" class="animate-spin" />
        <p>Ожидание игроков</p>
        <pre>{{ connected || 0 }}/{{ room?.maxPlayers || 0 }}</pre>
      </Badge>

      <Motion
        :initial="{opacity: 0, scale: 0}"
        :animate="{opacity: 1, scale: 1}"
      >
        <Button
          v-if="
            connected === room.maxPlayers &&
            userStore.getUser.id === room.ownerId
          "
          class="h-[30px] flex items-center gap-1"
          :class="{
            'anim_gradient--dark': colorMode === 'dark',
            'anim_gradient--light': colorMode === 'light'
          }"
          type="button"
          @click="startGame"
        >
          <Play :size="20" />
          <p>Начать игру</p>
        </Button>

        <Badge
          v-if="
            connected === room.maxPlayers &&
            userStore.getUser.id !== room.ownerId
          "
          class="flex items-center gap-1 px-2 rounded-sm"
        >
          <Loader :size="20" class="animate-spin" />
          <p>Ожидание создателя</p>
        </Badge>
      </Motion>
    </div>

    <Game v-if="gameStarted" />
  </Motion>
</template>
