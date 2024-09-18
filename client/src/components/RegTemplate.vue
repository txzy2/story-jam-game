<script setup lang="ts">
import {ref, computed} from 'vue';

import * as z from 'zod';
import {toTypedSchema} from '@vee-validate/zod';

import {useUserStore} from '@/stores/storage';

import {Button} from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
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
import {path} from '@/utils/imgs';
import {useColorMode} from '@vueuse/core';
import axios from 'axios';

const userStorage = useUserStore();
const colorMode = useColorMode();

const isDialogOpen = ref(true);
const username = ref('');
const maxLength: number = 15;

const remainingCharacters = computed(() => username.value.length);
const isFormValid = computed(() => username.value.trim().length > 0);

const selectedValue = ref(path.man1);

const formSchema = toTypedSchema(
  z.object({
    username: z.string().min(2).max(50)
  })
);

async function submitForm(event: Event) {
  event.preventDefault();
  if (isFormValid.value) {
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const values: {[key: string]: string} = {};
    formData.forEach((value, key) => {
      values[key] = value.toString();
    });

    console.log(values, selectedValue.value);

    const user = await axios.post(`http://localhost:4200/api/user/add`, {
      username: values.username,
      avatar: selectedValue.value
    });

    if (user.status === 200) {
      console.log(user.data);
      userStorage.setUser(user.data);
    }
  }
}
</script>

<template>
  <Form v-if="isDialogOpen" :validation-schema="formSchema">
    <Dialog>
      <DialogTrigger as-child>
        <Button
          :class="{
            'anim_gradient--dark': colorMode === 'dark',
            'anim_gradient--light': colorMode === 'light'
          }"
        >
          Заполнить профиль
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактирование профиля</DialogTitle>
          <DialogDescription class="text-[13px] me-auto"
            >Перед стартом заполни свой профиль</DialogDescription
          >
        </DialogHeader>

        <form
          class="flex gap-2 items-center"
          @submit="submitForm"
          id="dialogForm"
        >
          <FormItem class="flex items-center w-[30%]">
            <Select variant="ghost" v-model="selectedValue">
              <SelectTrigger class="h-[100px]">
                <SelectValue placeholder="Аватар" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem :value="path.man1">
                    <img :src="path.man1" width="70" height="70" />
                  </SelectItem>
                  <SelectItem :value="path.man2">
                    <img :src="path.man2" width="70" height="70" />
                  </SelectItem>
                  <SelectItem :value="path.women1">
                    <img :src="path.women1" width="70" height="70" />
                  </SelectItem>
                  <SelectItem :value="path.women2">
                    <img :src="path.women2" width="70" height="70" />
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FormItem>
          <FormField v-slot="{componentField}" name="username" class="flex-1">
            <FormItem class="flex gap-1">
              <FormControl>
                <Input
                  type="text"
                  placeholder="Никнейм"
                  v-bind="componentField"
                  v-model="username"
                  :maxLength="maxLength"
                />

                <p class="text-[13px]">{{ remainingCharacters }}/15</p>
              </FormControl>
            </FormItem>
          </FormField>
        </form>

        <DialogFooter class="flex items-center justify-between">
          <Button type="submit" form="dialogForm" :disabled="!isFormValid">
            Применить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>
