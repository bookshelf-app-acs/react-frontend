import axios from 'axios';

const KONG_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const createInstance = (baseURL) => {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
  );

  return instance;
};

export const authApi = createInstance(`${KONG_URL}/auth`);
export const libraryApi = createInstance(`${KONG_URL}/library`);
export const notificationApi = createInstance(`${KONG_URL}/notification`);