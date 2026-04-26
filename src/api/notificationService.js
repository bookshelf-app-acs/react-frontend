import { notificationApi } from './axios';

export const getMyNotifications = () =>
  notificationApi.get('/api/v1/notifications/me');

export const getUnreadCount = () =>
  notificationApi.get('/api/v1/notifications/me/unread-count');

export const markAsRead = (id) =>
  notificationApi.patch(`/api/v1/notifications/${id}/read`);

export const getAllNotifications = () =>
  notificationApi.get('/api/v1/notifications');