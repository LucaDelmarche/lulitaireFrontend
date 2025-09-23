import { apiClient } from "./ApiClient";
const userService = {
    login: async (email, password) => {

        try {
            const response = await apiClient.post(`/users/login`, { email, password });
            return response.data; // token, user info, etc.
        } catch (error) {
            throw error;
        }
}
};
export default userService;
