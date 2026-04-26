import { authApi } from './axios';

export const login = (email, password) =>
  authApi.post('/api/v1/auth/login', { email, password });

export const register = (name, email, password) =>
  authApi.post('/api/v1/auth/register', { name, email, password });

export const getMe = () =>
  authApi.get('/api/v1/users/me');

export const getAllUsers = () =>
  authApi.get('/api/v1/users');

export const deleteUser = (id) =>
  authApi.delete(`/api/v1/users/${id}`);