import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import Aura from '@primeuix/themes/aura';
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import MdiVue from 'mdi-vue/v3'
import { mdiAccount, mdiHome, mdiFood } from '@mdi/js'
import '@/assets/styles.scss';
import { createPinia } from 'pinia';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: '.app-dark'
        }
    }
});
app.use(MdiVue, {
    icons: {
        mdiAccount,
        mdiHome,
        mdiFood
    }
})
app.use(ToastService);
app.use(ConfirmationService);

app.mount('#app');
