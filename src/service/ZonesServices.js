import { apiClient } from '@/service/ApiClient';
const zonesServices = {
    getZonesByUserId: async () => {
        try {
            const response = await apiClient.get(`/zones?page=1&pageSize=10`,);
            return response.data; // array of zones
        } catch (error) {
            throw error;
        }},
    createZone: async (zoneData) => {
        try {
            const response = await apiClient.post(`/zones`, zoneData);
            return response.data; // newly created zone info, etc.
        } catch (error) {
            throw error;
        }},
    editZone: async (data) => {
        try {
            await apiClient.patch(`/zones/${data.id}`, {name:data.name});
        }
        catch (error) {
            throw error;
        }
    },
    deleteZone: async (zoneId) => {
        try {
            const response = await apiClient.delete(`/zones/${zoneId}`);
            return response.data; // success message or deleted zone info
        } catch (error) {
            throw error;
        }}
}

export default zonesServices;
