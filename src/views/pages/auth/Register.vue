<script setup>

</script>

<template>
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style=" border-radius: 53px;box-shadow: grey 0 0 10px 0;">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <img src="../../../assets/logo.png" alt="Lulitaire Logo" class="max-w-64 mx-auto" />
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Créer un compte Lulitaire</div>
                        <span class="text-muted-color font-medium">Inscrivez-vous pour continuer.</span>
                    </div>
                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Adresse mail" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Mot de passe</label>
                        <Password id="password1" v-model="password" placeholder="Mot de passe" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>
                        <label for="password2" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Confirmer le mot de passe</label>
                        <Password id="password2" v-model="password2" placeholder="Confirmer le mot de passe" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>
                        <RouterLink  to="/auth/login" class="font-medium no-underline flex items-end justify-between mt-2 mb-8 gap-8 text-right cursor-pointer text-primary">Se connecter</RouterLink>

                        <Button label="S'inscrire" class="w-full"  @click="register"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">

</style>
