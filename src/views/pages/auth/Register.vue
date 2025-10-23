<script setup>
import { useToast } from 'primevue/usetoast';

const toast = useToast();
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import userService from '@/service/UsersService';
import { useUserStore } from '@/store/UserStore';

const userStore = useUserStore();
const router = useRouter();
const password = ref('');
const password2 = ref('');
const REGEX_LOWERCASE = /(?=.*[a-z])/;
const REGEX_UPPERCASE = /(?=.*[A-Z])/;
const REGEX_NUMBER = /(?=.*\d)/;
const email = ref('');
const register = async () => {
    if (password.value !== password2.value) {
        toast.add({
            severity: 'error',
            summary: 'Erreur',
            detail: 'Les mots de passe ne correspondent pas',
            life: 3000
        });
        return;
    }
    try {
        await userService.register({ mail: email.value, password: password.value });
        await userStore.login(email.value, password.value);
        await router.push('/');
        toast.add({ severity: 'success', summary: 'Succès', detail: `Bienvenue ${email.value}`, life: 3000 });
    } catch (error) {
        console.log('Registration failed:', error);
        if (error.status === 409) {
            toast.add({ severity: 'error', summary: 'Erreur', detail: 'Email déjà utilisé', life: 3000 });
        } else if (error.status === 400) {
            toast.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Le mot de passe doit contenir au minimum 12 caractères, un chiffre et une majuscule',
                life: 3000
            });
        } else {
            toast.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Échec de l'inscription, veuillez réessayer plus tard.",
                life: 3000
            });
        }
    }
};
const isActive = () => {
    return password.value === password2.value && password.value !== '' && password2.value !== '' &&
        REGEX_LOWERCASE.test(password.value) && REGEX_UPPERCASE.test(password.value) &&
        REGEX_NUMBER.test(password.value) && password.value.length >= 12 && REGEX_NUMBER.test(password2.value) &&
        REGEX_LOWERCASE.test(password2.value) && REGEX_UPPERCASE.test(password2.value) && password2.value.length >= 12 && email.value !== '';
}
</script>

<template>
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 53px; box-shadow: grey 0 0 10px 0">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="../../../assets/logo_2.png" alt="Lulitaire Logo" class="max-w-64 mx-auto" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Créer un compte Lulitaire</div>
                        <span class="text-muted-color font-medium">Inscrivez-vous pour continuer.</span>
                    </div>
                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Adresse mail" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Mot de passe</label>
                        <Password id="password1" v-model="password" placeholder="Mot de passe" :toggleMask="true" class="mb-4" fluid :feedback="true">
                            <template #header>
                                <div class="text-surface-900 dark:text-surface-0 font-medium mb-2">Le mot de passe doit contenir :</div>
                            </template>
                            <template #content>
                                <Divider />
                                <ul class="pl-2 my-0 leading-normal">
                                    <li>
                                        <div v-if="REGEX_LOWERCASE.test(password)" style="color: green">✅ Au moins une minuscule</div>
                                        <div v-else style="color: red">❌ Au moins une minuscule</div>
                                    </li>

                                    <li>
                                        <div v-if="REGEX_UPPERCASE.test(password)" style="color: green">✅ Au moins une majuscule</div>
                                        <div v-else style="color: red">❌ Au moins une majuscule</div>
                                    </li>
                                    <li>
                                        <div v-if="REGEX_NUMBER.test(password)" style="color: green">✅ Au moins un nombre</div>
                                        <div v-else style="color: red">❌ Au moins un nombre</div>
                                    </li>
                                    <li>
                                        <div v-if="password.length >= 12" style="color: green">✅ Au moins 12 caractères</div>
                                        <div v-else style="color: red">❌ Au moins 12 caractères</div>
                                    </li>
                                </ul>
                            </template>
                        </Password>
                        <label for="password2" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Confirmer le mot de passe</label>
                        <Password id="password2" v-model="password2" @keydown.enter="register" placeholder="Confirmer le mot de passe" :toggleMask="true" class="mb-4" fluid :feedback="true">
                            <template #header>
                                <div class="text-surface-900 dark:text-surface-0 font-medium mb-2">Le mot de passe doit contenir :</div>
                            </template>
                            <template #content>
                                <Divider />
                                <ul class="pl-2 my-0 leading-normal">
                                    <li>
                                        <div v-if="REGEX_LOWERCASE.test(password2)" style="color: green">✅ Au moins une minuscule</div>
                                        <div v-else style="color: red">❌ Au moins une minuscule</div>
                                    </li>
                                    <li>
                                        <div v-if="REGEX_UPPERCASE.test(password2)" style="color: green">✅ Au moins une majuscule</div>
                                        <div v-else style="color: red">❌ Au moins une majuscule</div>
                                    </li>
                                    <li>
                                        <div v-if="REGEX_NUMBER.test(password2)" style="color: green">✅ Au moins un nombre</div>
                                        <div v-else style="color: red">❌ Au moins un nombre</div>
                                    </li>
                                    <li>
                                        <div v-if="password2.length >= 12" style="color: green">✅ Au moins 12 caractères</div>
                                        <div v-else style="color: red">❌ Au moins 12 caractères</div>
                                    </li>
                                </ul>
                            </template>
                        </Password>
                        <RouterLink to="/auth/login" class="font-medium no-underline flex items-end justify-between mt-2 mb-8 gap-8 text-right cursor-pointer text-primary"> Se connecter </RouterLink>

                        <Button label="S'inscrire" class="w-full" :disabled="!isActive()" @click="register"></Button>
                        <div v-if="password !== password2 && password2 !== ''" class="text-red-600 mt-4 text-center">Les mots de passe ne correspondent pas.</div>

                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
