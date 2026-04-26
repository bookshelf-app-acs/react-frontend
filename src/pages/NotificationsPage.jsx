import { useState, useEffect } from 'react';
import { getMyNotifications, markAsRead } from '../api/notificationService';
import { Navbar } from '../components/Navbar';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await getMyNotifications();
      setNotifications(res.data);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifications();
    } catch {}
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter(n => !n.isRead);
    await Promise.all(unread.map(n => markAsRead(n.id)));
    fetchNotifications();
  };

  const typeLabel = {
    LOAN_CONFIRMED: { icon: '📖', label: 'Loan confirmed' },
    RETURN_DUE_SOON: { icon: '⏰', label: 'Return due soon' },
    RETURN_OVERDUE: { icon: '🚨', label: 'Overdue' },
    RESERVATION_AVAILABLE: { icon: '✅', label: 'Available' },
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-2 text-sm font-normal text-slate-500">({unreadCount} unread)</span>
            )}
          </h2>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-blue-600 hover:underline"
            >
              Mark all as read
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : notifications.length === 0 ? (
          <p className="text-slate-500">No notifications yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {notifications.map(n => {
              const meta = typeLabel[n.type] || { icon: '🔔', label: n.type };
              return (
                <div
                  key={n.id}
                  className={`bg-white rounded-xl border shadow-sm p-4 flex items-start gap-4 ${!n.isRead ? 'border-blue-300 bg-blue-50' : 'border-slate-200'}`}
                >
                  <span className="text-2xl">{meta.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{meta.label}</p>
                    <p className="text-sm text-slate-800 mt-0.5">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                  </div>
                  {!n.isRead && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="text-xs text-blue-600 hover:underline whitespace-nowrap mt-1"
                    >
                      Mark read
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};