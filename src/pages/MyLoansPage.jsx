import { useState, useEffect } from 'react';
import { getMyLoans, returnBook } from '../api/libraryService';
import { Navbar } from '../components/Navbar';

export const MyLoansPage = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const fetchLoans = async () => {
    try {
      const res = await getMyLoans();
      setLoans(res.data);
    } catch {
      setMessage('Failed to load loans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLoans(); }, []);

  const handleReturn = async (loanId) => {
    try {
      await returnBook(loanId);
      setMessage('Book returned successfully!');
      fetchLoans();
    } catch (e) {
      setMessage(e.response?.data?.error_message || 'Could not return book.');
    }
  };

  const statusColor = {
    ACTIVE: 'bg-blue-100 text-blue-700',
    RETURNED: 'bg-green-100 text-green-700',
    OVERDUE: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">My Loans</h2>

        {message && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
            {message}
            <button onClick={() => setMessage('')} className="ml-2 font-bold">×</button>
          </div>
        )}

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : loans.length === 0 ? (
          <p className="text-slate-500">You have no loans.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {loans.map(loan => (
              <div key={loan.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-800">{loan.bookTitle}</p>
                  <p className="text-sm text-slate-500">{loan.bookAuthor}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Borrowed: {new Date(loan.loanDate).toLocaleDateString()} |
                    Due: {new Date(loan.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[loan.status] || 'bg-slate-100 text-slate-600'}`}>
                    {loan.status}
                  </span>
                  {loan.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleReturn(loan.id)}
                      className="text-xs bg-slate-800 text-white px-3 py-1 rounded-lg hover:bg-slate-700"
                    >
                      Return
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