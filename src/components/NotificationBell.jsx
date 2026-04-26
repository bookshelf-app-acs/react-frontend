import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUnreadCount, getMyNotifications, markAsRead } from '../api/notificationService';

export const NotificationBell = () => {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchCount = async () => {
    try {
      const res = await getUnreadCount();
      setCount(res.data.count);
    } catch {}
  };

  const fetchNotifications = async () => {
    try {
      const res = await getMyNotifications();
      setNotifications(res.data.slice(0, 5)); // ultimele 5
    } catch {}
  };

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000); // polling la 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpen = () => {
    if (!open) fetchNotifications();
    setOpen(!open);
  };

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      fetchCount();
      fetchNotifications();
    } catch {}
  };

  const typeLabel = {
    LOAN_CONFIRMED: '📖',
    RETURN_DUE_SOON: '⏰',
    RETURN_OVERDUE: '🚨',
    RESERVATION_AVAILABLE: '✅',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button onClick={handleOpen} className="relative p-1">
        <span className="text-xl">🔔</span>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-100 border-b">
            <span className="font-semibold text-sm">Notifications</span>
            <button
              onClick={() => { setOpen(false); navigate('/notifications'); }}
              className="text-xs text-blue-600 hover:underline"
            >
              See all
            </button>
          </div>

          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`px-4 py-3 border-b last:border-0 flex items-start gap-2 ${!n.isRead ? 'bg-blue-50' : ''}`}
              >
                <span className="text-lg">{typeLabel[n.type] || '🔔'}</span>
                <div className="flex-1">
                  <p className="text-xs text-slate-700">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.isRead && (
                  <button
                    onClick={() => handleMarkRead(n.id)}
                    className="text-xs text-blue-500 hover:underline whitespace-nowrap"
                  >
                    Mark read
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};