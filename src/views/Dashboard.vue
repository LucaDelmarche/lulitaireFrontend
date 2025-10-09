<script setup>
import { useUserStore } from '@/store/UserStore';
import { ref, onMounted } from 'vue';
import zonesService from '@/service/ZonesServices';
import { useToast } from 'primevue/usetoast';
import {Tooltip} from 'primevue';

const toast = useToast();

const userStore = useUserStore();
const zones = ref([]);
const newZoneName = ref('');
const showPopupCreate = ref(false);
const selectedZone = ref(null);
const showPopupDelete = ref(false);
onMounted(async () => {
    if (userStore.currentUser) {
        try {
            const response = await zonesService.getZonesByUserId(userStore.currentUser.id);
            zones.value = response.items || response.data; // selon la structure renvoyée
        } catch (error) {
            console.error('Erreur lors de la récupération des zones :', error);
        }
    }
});
const update = (zone) => {
    selectedZone.value = zone
    newZoneName.value = zone.name
    showPopupCreate.value = true
}
const createZone = async () => {
    if (!newZoneName.value) return;
    try {
        if(selectedZone.value === null){
            await zonesService.createZone({
                name: newZoneName.value,
                id_user: userStore.currentUser.id
            });
            toast.add({
                severity: 'success',
                summary: 'Succès',
                detail: `Zone ${newZoneName.value} créée avec succès !`,
                life: 3000
            });
        }
        else {
            await zonesService.editZone({
                name: newZoneName.value,
                id: selectedZone.value.id
            })
            toast.add({
                severity: 'success',
                summary: 'Succès',
                detail: `Zone ${newZoneName.value} modifiée avec succès !`,
                life: 3000
            });
        }
        showPopupCreate.value = false;
        selectedZone.value = null
        newZoneName.value = '';

        // rafraîchir la liste pour récupérer les dernières données
        const fetch = await zonesService.getZonesByUserId(userStore.currentUser.id);
        zones.value = fetch.items || fetch.data;
    } catch (error) {
        if(error.status === 400) {
            toast.add({
                severity: 'error',
                summary: 'Erreur',
                detail: `Le nom de la zone ne peut pas dépasser 100 caractères.`,
                life: 3000
            });
            return;
        }
        else if (error.status === 409) {
            toast.add({
                severity: 'error',
                summary: 'Erreur',
                detail: `Une zone avec ce nom existe déjà.`,
                life: 3000
            });
            return;
        }
        console.error('Erreur lors de la création de la zone :', error);
    }
};

const deleteZone = async (zone) => {
    if (!zone) return;
    console.log(zone)
    try {
        await zonesService.deleteZone(zone.id);
        toast.add({
            severity: 'success',
            summary: 'Succès',
            detail: `Zone ${zone.name} supprimée avec succès !`,
            life: 3000
        });
        showPopupDelete.value = false;
        selectedZone.value = null

        // rafraîchir la liste pour récupérer les dernières données
        const fetch = await zonesService.getZonesByUserId(userStore.currentUser.id);
        zones.value = fetch.items || fetch.data;
    } catch (error) {
        console.error('Erreur lors de la suppression de la zone :', error);
    }
};
const showDelete = (zone) => {
    selectedZone.value = zone
    showPopupDelete.value = true
}
const closePopup = () => {
    showPopupCreate.value = false;
    newZoneName.value = '';
};
const closeDeletePopup = () => {
    showPopupDelete.value = false;
}
</script>

<template>
    <Card class="grid grid-cols-12 gap-8">
        <template #content>
            <div class="col-span-12">
                    <div v-if="userStore.currentUser">
                        <h1 class="text-4xl font-bold mb-6">Bienvenue, {{ userStore.currentUser?.mail.split('@')[0].replace('.', ' ') }}!</h1>

                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                            <!-- Si aucune zone -->
                            <div v-if="zones?.length === 0" class="col-span-full p-6 border border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
                                <p class="mb-3 text-gray-700 text-lg">Vous n'avez pas encore de zones.</p>
                                <button @click="showPopupCreate = true" style="background-color: #3b2a1c" class="inline-block px-4 py-2 text-white font-semibold rounded hover:bg-blue-700 transition">Créer une nouvelle zone</button>
                            </div>

                            <!-- Cartes de zones existantes -->
                            <template v-else>
                                <Card v-for="zone in zones" :key="zone.id" class="rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer flex flex-col justify-between">
                                    <template #content>
                                        <div class="flex justify-between">
                                            <div>
                                                <h2 class="text-xl font-semibold text-gray-800">{{ zone.name }}</h2>
                                            </div>
                                            <div>
                                                <Chip @click="update(zone)" style="border-radius: 50%;" class="p-2 text-blue-800 text-sm font-medium" v-tooltip="`Modifier la zone ${zone.name}`" tooltip-position="top">
                                                    <template #icon>
                                                        <i class="pi pi-pencil" style="color: #3b2a1c"></i>
                                                    </template>
                                                </Chip>
                                                <Chip @click="showDelete(zone)" style="color:red" class="ml-1" v-tooltip="`Supprimer la zone ${zone.name}`" tooltip-position="top">
                                                    <template #icon>
                                                        <i class="pi pi-trash"></i>
                                                    </template>
                                                </Chip>
                                            </div>

                                        </div>
                                        <div class="mt-4">
                                            <a :href="`/zones/${zone.id}`" style="color: #3b2a1c" class=" hover:underline text-sm font-medium"> Accéder à la zone </a>
                                        </div>
                                    </template>

                                </Card>

                                <!-- Carte "Créer une nouvelle zone" -->
                                <div class="rounded-lg shadow-md p-4 hover:shadow-lg transition cursor-pointer flex items-center justify-center" @click="showPopupCreate = true">
                                    <span style="color: #3b2a1c" class="text-lg font-medium hover:underline"> Créer une nouvelle zone </span>
                                </div>
                            </template>
                        </div>

                        <!-- Popup Modal -->
                        <div v-if="showPopupCreate" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                <h2 class="text-2xl font-bold mb-4">Créer une nouvelle zone</h2>
                                <input v-model="newZoneName" autofocus @keydown.enter="createZone" type="text" placeholder="Nom de la zone" class="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />

                                <div class="flex justify-end gap-3">
                                    <button @click="closePopup" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">Annuler</button>
                                    <button @click="createZone" style="background-color: #3b2a1c" class="px-4 py-2 text-white rounded hover:bg-blue-700 transition">Créer</button>
                                </div>
                            </div>
                        </div>
                        <div v-if="showPopupDelete" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                                <h2 class="text-2xl font-bold mb-4">Supprimer la zone</h2>
                                <p class="mb-4">Êtes-vous sûr de vouloir supprimer la zone {{ selectedZone?.name }} ? Cette action est irréversible.</p>
                                <div class="flex justify-end gap-3">
                                    <button @click="closeDeletePopup" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition">Annuler</button>
                                    <button @click="deleteZone(selectedZone)" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">Supprimer</button>
                                </div>
                            </div>
                        </div>
                    </div>
            </div>
        </template>
    </Card>
</template>
