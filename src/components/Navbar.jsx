import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { NotificationBell } from './NotificationBell';

export const Navbar = () => {
  const { user, logoutUser, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <nav className="bg-slate-800 text-white px-6 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-6">
        <Link to="/catalog" className="text-xl font-bold tracking-tight hover:text-slate-300">
          📚 BookShelf
        </Link>
        <Link to="/catalog" className="text-sm hover:text-slate-300">Catalog</Link>
        <Link to="/my-loans" className="text-sm hover:text-slate-300">My Loans</Link>
        <Link to="/my-reservations" className="text-sm hover:text-slate-300">My Reservations</Link>
        {isAdmin() && (
          <Link to="/admin" className="text-sm text-amber-400 hover:text-amber-300">Admin Panel</Link>
        )}
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <span className="text-sm text-slate-300">{user?.name}</span>
        <button
          onClick={handleLogout}
          className="text-sm bg-slate-600 hover:bg-slate-500 px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};