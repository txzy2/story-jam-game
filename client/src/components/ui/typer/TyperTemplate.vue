<script setup lang="ts">
import {ref, onMounted} from 'vue';
import Typed from 'typed.js';

interface Props {
  strings: string[];
  typeSpeed?: number;
  backSpeed?: number;
  onComplete?: () => void;
}

const props = defineProps<Props>();

const typedElement = ref<HTMLElement | null>(null);

onMounted(() => {
  if (typedElement.value) {
    const options: Typed.Options = {
      strings: props.strings,
      typeSpeed: props.typeSpeed || 50,
      backSpeed: props.backSpeed || 25,
      loop: false,
      onComplete: () => {
        const cursor = typedElement.value?.nextElementSibling as HTMLElement;
        if (cursor) {
          cursor.style.display = 'none';
        }
        if (props.onComplete) {
          props.onComplete();
        }
      }
    };

    new Typed(typedElement.value, options);
  }
});
</script>

<template>
  <div>
    <!-- <pre><span ref="typedElement"></span></pre> -->
    <span ref="typedElement"></span>
  </div>
</template>
