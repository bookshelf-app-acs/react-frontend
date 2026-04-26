import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CatalogPage } from './pages/CatalogPage';
import { MyLoansPage } from './pages/MyLoansPage';
import { MyReservationsPage } from './pages/MyReservationsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AdminPage } from './pages/admin/AdminPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/catalog" element={
            <ProtectedRoute><CatalogPage /></ProtectedRoute>
          } />
          <Route path="/my-loans" element={
            <ProtectedRoute><MyLoansPage /></ProtectedRoute>
          } />
          <Route path="/my-reservations" element={
            <ProtectedRoute><MyReservationsPage /></ProtectedRoute>
          } />
          <Route path="/notifications" element={
            <ProtectedRoute><NotificationsPage /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;