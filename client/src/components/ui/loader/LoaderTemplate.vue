<script setup lang="ts">
import {Loader} from 'lucide-vue-next';

const props = defineProps<{
  title: {
    need: boolean;
    text?: string;
    size?: number;
  };
  iconSize: number;
  needSub?: boolean;
  needLogo?: boolean;
}>();
</script>

<template>
  <div class="h-[80vh] flex items-center justify-center g-[10px]">
    <img v-show="props.needLogo" src="/logo.png" width="150" height="50" />

    <Loader :size="props.iconSize" class="animate-spin" />

    <div class="flex flex-col">
      <p
        v-show="props.title.need"
        class="flext items-center font-medium"
        :style="{fontSize: `${props.title.size}px`}"
      >
        {{ props.title.text }}
      </p>

      <div v-show="props.needSub" class="flex items-center ms-1 leading-none">
        <img src="/logo5.png" width="150" height="150" />

        <div class="flex items-center gap-1">
          created by
          <a
            class="px-3 py-1 font-medium border rounded-lg underline"
            target="_blank"
            href="https://github.com/txzy2/nuxt-game"
            >txzy2</a
          >
        </div>
      </div>
    </div>
  </div>
</template>
