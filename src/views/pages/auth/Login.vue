<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';
import {useUserStore} from '@/store/UserStore';
const email = ref('');
const password = ref('');
const toast = useToast();
const router = useRouter();
const userStore = useUserStore();

const login = async() => {
    try {

        await userStore.login(email.value, password.value);
        toast.add({ severity: 'success', summary: 'Succès', detail: `Bienvenue ${userStore.currentUser.mail}`, life: 3000 });
        await router.push('/');
    }
    catch (error) {
        console.log('Login failed:', error);
        if(error.status === 401) {
            toast.add({severity:'error', summary: 'Erreur', detail: 'Email ou mot de passe incorrect', life: 3000});
        }
    }
}
</script>

<template>
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style=" border-radius: 53px;box-shadow: grey 0 0 10px 0;">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="../../../assets/logo_2.png" alt="Lulitaire Logo" class="max-w-64 mx-auto" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Bienvenue sur Lulitaire !</div>
                        <span class="text-muted-color font-medium">Connectez-vous pour continuer.</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Adresse mail" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Mot de passe</label>
                        <Password id="password1" @keydown.enter="login" v-model="password" placeholder="Mot de passe" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <RouterLink to="/auth/register" class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">S'inscrire</RouterLink>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Mot de passe oublié ?</span>
                        </div>
                        <Button label="Se connecter" class="w-full"  @click="login"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
