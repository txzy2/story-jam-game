<script setup lang="ts">
import {RouterLink} from 'vue-router';
import {useUserStore} from '@/stores/storage';
import {Button} from '@/components/ui/button';

const userStore = useUserStore();
</script>

<template>
  <div class="h-[80vh] flex items-center justify-center">
    <div
      class="h-[100%] flex flex-col gap-4 px-6 py-2 max-w-2xl mx-auto my-5 bg-white shadow-md rounded-lg"
    >
      <p class="text-lg font-semibold text-gray-800">Описание:</p>

      <p class="text-gray-700">
        <span class="font-semibold">StoryJam</span> — это онлайн-игра, в которой
        пользователи создают совместную историю, добавляя по одной фразе. Каждый
        игрок видит только последнюю фразу, добавленную предыдущим игроком, и на
        основе этого продолжает рассказ. В результате получается непредсказуемая
        и часто смешная история. Основные элементы игры:
      </p>

      <ul class="list-disc list-inside space-y-2 text-sm text-gray-700">
        <li>
          <a to="/about/create" class="font-bold underline"
            >Создание комнаты:</a
          >
          Пользователь создает новую игровую комнату, куда могут
          <a to="/about/create" class="font-bold underline">присоединяться</a>
          другие участники по ссылке.
        </li>

        <li>
          <span class="font-semibold">Добавление фразы:</span> Каждый игрок
          может добавить фразу к истории. Он видит только последнюю фразу,
          добавленную предыдущим игроком.
        </li>

        <li>
          <span class="font-semibold">Ограничение времени:</span> Для
          динамичности игры можно установить ограничение по времени на
          добавление фразы (например, 30 секунд). Если игрок не успевает, ход
          передается следующему участнику.
        </li>

        <li>
          <span class="font-semibold">Показ истории:</span> После завершения
          игры (например, после добавления 10 фраз или когда все игроки
          завершили свои ходы), история показывается целиком. Это может быть
          очень забавно, потому что никто из игроков не видел всю историю
          целиком во время игры.
        </li>

        <li>
          <span class="font-semibold">Голосование:</span> После завершения игры
          участники могут проголосовать за самую забавную, странную или
          неожиданную фразу в истории.
        </li>

        <li>
          <span class="font-semibold">Истории дня:</span> Можно сделать раздел
          "Лучшие истории дня", где будут публиковаться самые популярные или
          самые смешные истории, созданные пользователями.
        </li>
      </ul>

      <p class="font-semibold text-gray-800">Хорошей игры!</p>

      <div class="mt-auto text-center">
        <RouterLink to="/">
          <Button
            :class="[
              'w-full ',
              {'hover:text-[#1c1c1c]': userStore.getTheme === 'dark'}
            ]"
            :variant="userStore.getTheme === 'light' ? 'default' : 'secondary'"
            >На главную</Button
          >
        </RouterLink>
      </div>
    </div>
  </div>
</template>
