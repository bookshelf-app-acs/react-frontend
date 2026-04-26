import axios from 'axios';

const AUTH_URL = 'http://localhost:8081';
const LIBRARY_URL = 'http://localhost:8082';
const NOTIFICATION_URL = 'http://localhost:8084';

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

export const authApi = createInstance(AUTH_URL);
export const libraryApi = createInstance(LIBRARY_URL);
export const notificationApi = createInstance(NOTIFICATION_URL);