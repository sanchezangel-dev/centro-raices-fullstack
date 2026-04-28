import axios from 'axios';

const api = axios.create({
  baseURL: 'https://centro-raices-fullstack.onrender.com/api'
});

// Interceptor para pegar el token en el Header
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;