import { defineStore } from 'pinia';
import userService from '../service/UsersService';
import { apiClient } from '@/service/ApiClient';

export const useUserStore = defineStore('user', {
    state: () => ({
        currentUser: null,
    }),
    actions: {
        async login(email, password) {
            try {
                const data = await userService.login(email, password);
                this.currentUser = data;
                return data;
            } catch (error) {
                this.currentUser = null;
                throw error;
            }
        },
        async fetchCurrentUser() {
            try {
                const res = await apiClient.get('users/current', {
                    withCredentials: true
                });
                this.currentUser = res.data;
            } catch (error) {
                this.currentUser = null;
            }
        },
        logout() {
            this.currentUser = null;
            // tu peux aussi appeler userService.logout() si nécessaire
        },
    },
});
