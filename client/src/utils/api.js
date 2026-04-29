import axios from 'axios';

const clearSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('artify_user');
    window.dispatchEvent(new Event('userChanged'));
};

const getTokenPayload = (token) => {
    try {
        const payload = token.split('.')[1];
        return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    } catch {
        return null;
    }
};

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        const payload = getTokenPayload(token);
        if (payload?.exp && payload.exp * 1000 < Date.now()) {
            clearSession();
            return Promise.reject(new Error('Session expired. Please log in again.'));
        }
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const message = error.response?.data?.message || '';
            if (message.toLowerCase().includes('invalid token') || message.toLowerCase().includes('blacklisted')) {
                clearSession();
            }
        }
        return Promise.reject(error);
    }
);

export default api;
