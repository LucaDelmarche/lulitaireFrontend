import {apiClient} from '@/service/ApiClient';
const itemsService = {
    getItemsByZoneId: async (zoneId,page = 1, pageSize = 10) => {
        try {
            const response = await apiClient.get(`/items`, {
                params: {
                    idZone: zoneId,
                    page: page,
                    pageSize: pageSize
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }},
    createItem: async (payload) => {
        try {
            console.log(payload)
            const response = await apiClient.post(`/items`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }},
    editItem: async (data) => {
        try {
            await apiClient.patch(`/items/${data.id}`, {name:data.name, description:data.description});
        }
        catch (error) {
            throw error;
        }
    },
    deleteItem: async (itemId) => {
        try {
            const response = await apiClient.delete(`/items/${itemId}`);
            return response.data; // success message or deleted item info
        } catch (error) {
            throw error;
        }}
}

export default itemsService;
