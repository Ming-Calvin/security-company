<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/modules/user.ts';

const userStore = useUserStore();

onMounted(async () => {

  await userStore.getUserInfo();
  // await userStore.fetchUserInfo();
})
</script>
