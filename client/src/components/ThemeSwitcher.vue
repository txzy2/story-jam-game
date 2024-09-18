<script setup lang="ts">
import {Sun, Moon} from 'lucide-vue-next';
import {useColorMode} from '@vueuse/core';
import {Button} from '@/components/ui/button';

const mode = useColorMode();

const toggleTheme = () => {
  mode.value = mode.value === 'dark' ? 'light' : 'dark';
};
</script>

<template>
  <Button class="px-2" variant="ghost" @click="toggleTheme">
    <component :is="mode === 'dark' ? Moon : Sun" :size="20" />
  </Button>
</template>
