<script setup lang="ts">
import {type HTMLAttributes, computed} from 'vue';
import {
  ProgressIndicator,
  ProgressRoot,
  type ProgressRootProps
} from 'radix-vue';
import {cn} from '@/lib/utils';

const props = withDefaults(
  defineProps<ProgressRootProps & {class?: HTMLAttributes['class']}>(),
  {
    modelValue: 0
  }
);

const delegatedProps = computed(() => {
  const {class: _, ...delegated} = props;

  return delegated;
});

const progressIndicatorClass = computed(() => {
  return cn(
    'h-full w-full flex-1 transition-all',
    props.modelValue === 100
      ? 'bg-gradient-to-r from-emerald-100 from-10% via-emerald-300 via-50% to-emerald-500 to-90%'
      : 'bg-primary'
  );
});
</script>

<template>
  <ProgressRoot
    v-bind="delegatedProps"
    :class="
      cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
        props.class
      )
    "
  >
    <ProgressIndicator
      :class="progressIndicatorClass"
      :style="`transform: translateX(-${100 - (props.modelValue ?? 0)}%);`"
    />
  </ProgressRoot>
</template>
