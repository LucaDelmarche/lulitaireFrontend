<script setup>
import {useUserStore} from '@/store/UserStore';
const userStore = useUserStore();

</script>

<template>
    <div class="grid grid-cols-12 gap-8">

        <div class="col-span-12 xl:col-span-6">
            <div v-if="userStore.currentUser">
                <h1 class="text-4xl font-bold mb-4">Bienvenue, {{ userStore.currentUser?.mail }}!</h1>
                <p class="text-lg mb-8">Voici un aperçu de votre tableau de bord.</p>
            </div>
        </div>
        <div class="col-span-12 xl:col-span-6">
        </div>
    </div>
</template>
