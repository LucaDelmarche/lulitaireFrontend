<script setup>
import {onMounted} from 'vue';
import { useUserStore } from './store/UserStore';

onMounted(async()=> {
    const userStore = useUserStore();
    await userStore.fetchCurrentUser();
})

</script>

<template>
    <Toast />
    <router-view />
</template>

<style scoped></style>
