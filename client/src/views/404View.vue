<script setup lang="ts">
import {ServerCrash} from 'lucide-vue-next';
import {RouterLink} from 'vue-router';

import {Button} from '@/components/ui/button';
</script>

<template>
  <div class="h-[80vh] flex flex-col items-center justify-center gap-2">
    <div class="flex items-center justify-center gap-1">
      <ServerCrash :size="20" /> 404 :(
    </div>

    <Button variant="secondary" class="h-[30px]">
      <RouterLink to="/">На главную</RouterLink>
    </Button>
  </div>
</template>
