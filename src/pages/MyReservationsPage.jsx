import { useState, useEffect } from 'react';
import { getMyReservations, cancelReservation } from '../api/libraryService';
import { Navbar } from '../components/Navbar';

export const MyReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchReservations = async () => {
    try {
      const res = await getMyReservations();
      setReservations(res.data);
    } catch {
      setMessage('Failed to load reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReservations(); }, []);

  const handleCancel = async (id) => {
    try {
      await cancelReservation(id);
      setMessage('Reservation cancelled.');
      fetchReservations();
    } catch (e) {
      setMessage(e.response?.data?.error_message || 'Could not cancel.');
    }
  };

  const statusColor = {
    PENDING: 'bg-amber-100 text-amber-700',
    FULFILLED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-slate-100 text-slate-500',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">My Reservations</h2>

        {message && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
            {message}
            <button onClick={() => setMessage('')} className="ml-2 font-bold">×</button>
          </div>
        )}

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : reservations.length === 0 ? (
          <p className="text-slate-500">You have no reservations.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {reservations.map(r => (
              <div key={r.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{r.bookTitle}</p>
                  <p className="text-sm text-slate-500">{r.bookAuthor}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Reserved: {new Date(r.reservationDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[r.status] || 'bg-slate-100'}`}>
                    {r.status}
                  </span>
                  {r.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(r.id)}
                      className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-400"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};