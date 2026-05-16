import { libraryApi } from './axios';

// Books
export const getBooks = (params) =>
  libraryApi.get('/api/v1/books', { params });

export const getBook = (id) =>
  libraryApi.get(`/api/v1/books/${id}`);

export const createBook = (data) =>
  libraryApi.post('/api/v1/books', data);

export const updateBook = (id, data) =>
  libraryApi.put(`/api/v1/books/${id}`, data);

export const deleteBook = (id) =>
  libraryApi.delete(`/api/v1/books/${id}`);

// Authors
export const getAuthors = () =>
  libraryApi.get('/api/v1/authors');

export const createAuthor = (data) =>
  libraryApi.post('/api/v1/authors', data);

export const deleteAuthor = (id) =>
  libraryApi.delete(`/api/v1/authors/${id}`);

// Loans
export const getMyLoans = () =>
  libraryApi.get('/api/v1/loans/my');

export const getAllLoans = () =>
  libraryApi.get('/api/v1/loans');

export const borrowBook = (bookId) =>
  libraryApi.post('/api/v1/loans', { bookId });

export const returnBook = (loanId) =>
    libraryApi.put(`/api/v1/loans/${loanId}/return`);

// Reservations
export const getMyReservations = () =>
  libraryApi.get('/api/v1/reservations/my');

export const getAllReservations = () =>
  libraryApi.get('/api/v1/reservations');

export const reserveBook = (bookId) =>
  libraryApi.post('/api/v1/reservations', { bookId });

export const cancelReservation = (id) =>
  libraryApi.delete(`/api/v1/reservations/${id}`);