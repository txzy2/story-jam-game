<script setup lang="ts">
import {ref, onMounted, inject, watch} from 'vue';
import {Copy, Pen, Loader} from 'lucide-vue-next';
import {Socket} from 'socket.io-client';
import {Motion} from '@oku-ui/motion';

import {useToast} from '@/components/ui/toast';
import {useUserStore} from '@/stores/storage';
import {Badge} from '@/components/ui/badge';
import {Button} from '@/components/ui/button';

const userStore = useUserStore();
const socket = inject('socket') as Socket;
const {toast} = useToast();
const sound = new Audio('/notification.wav');

const roomInfo = ref<{room: any; users: any[]} | null>(null);
const room = ref<any>(userStore.getRoom);
const previousPlayers = ref(
  userStore.room.players.map(player => player.username)
);

console.log(room.value);

const connected = ref<number>(userStore.room.players.length);

const copyToClipboard = (text: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast({
        title: 'Текст скопирован в буфер обмена'
      });
    })
    .catch(err => {
      console.error('Ошибка копирования: ', err);
    });
};

onMounted(() => {
  socket.on('updateRoomInfo', (data: {room: any; users: any[]}) => {
    roomInfo.value = data;
    userStore.setRoom(data.room);

    room.value = data.room;
  });

  const roomCode = userStore.getRoom.code;
  socket.emit('joinRoom', roomCode);
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

      sound.play().catch(err => {
        console.error('Ошибка воспроизведения звука: ', err);
      });
    }

    previousPlayers.value = newPlayerNicknames;
  }
};

watch(() => userStore.room.players.length, updateConnectedCount, {
  immediate: true
});
</script>

<template>
  <Motion :initial="{opacity: 0, scale: 0}" :animate="{opacity: 1, scale: 1}">
    <div class="h-[80vh] flex flex-col items-center justify-center gap-2">
      <div class="cursor-pointer flex items-center gap-1 font-bold rounded-sm">
        <h2 class="text-xl">{{ room.title }}</h2>

        <Badge
          title="Скопировать код комнаты"
          @click="copyToClipboard(room.code)"
          class="cursor-pointer flex items-center justify-center px-2 gap-2 text-[13px] rounded-sm"
        >
          {{ room.code }}
          <Copy :size="13" />
        </Badge>
      </div>

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
          </li>
        </ul>
      </div>

      <Badge
        v-if="connected !== room?.maxPlayers"
        class="flex items-center gap-1 px-2 rounded-sm"
      >
        <Loader :size="20" class="animate-spin" />
        <p>Ожидание игроков</p>
        <pre>{{ connected || 0 }}/{{ room?.maxPlayers || 0 }}</pre>
      </Badge>

      <Button
        v-else
        class="w-[30%] flex items-center gap-1 ml-auto"
        type="submit"
      >
        <Pen :size="20" />
        <p>Играть</p>
      </Button>
    </div>
  </Motion>
</template>
