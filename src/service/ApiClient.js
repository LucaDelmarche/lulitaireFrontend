import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    prefix: '/api',
    withCredentials: true,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.request.use((config) => {
    const AuthToken = JSON.parse(localStorage.getItem('AuthToken'));
    const accessToken = AuthToken ? AuthToken.access : null;
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/users/login') &&!originalRequest.url.includes('/auth/token/refresh')) {
            originalRequest._retry = true;
            try {
                await apiClient.post('/auth/token/refresh/', null);
                return apiClient(originalRequest);
            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export { apiClient };
