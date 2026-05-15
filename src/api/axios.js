import axios from 'axios';

const KONG_URL = 'http://localhost:8000';

const createInstance = (basePath) => {
  const instance = axios.create({ baseURL: `${KONG_URL}${basePath}` });

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

export const authApi = createInstance('/auth');
export const libraryApi = createInstance('/library');
export const notificationApi = createInstance('/notification');