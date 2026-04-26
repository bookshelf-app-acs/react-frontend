import { useState, useEffect } from 'react';
import { getAllLoans } from '../../api/libraryService';

export const AdminLoans = () => {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllLoans().then(r => setLoans(r.data)).finally(() => setLoading(false));
  }, []);

  const statusColor = {
    ACTIVE: 'bg-blue-100 text-blue-700',
    RETURNED: 'bg-green-100 text-green-700',
    OVERDUE: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <h3 className="font-semibold text-slate-700 mb-4">All Loans</h3>
      {loading ? <p className="text-slate-500">Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 border-b">
              <tr>
                <th className="px-3 py-2">Book</th>
                <th className="px-3 py-2">User</th>
                <th className="px-3 py-2">Borrowed</th>
                <th className="px-3 py-2">Due</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {loans.map(l => (
                <tr key={l.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-3 py-2 font-medium">{l.bookTitle}</td>
                  <td className="px-3 py-2 text-slate-500">{l.userEmail}</td>
                  <td className="px-3 py-2 text-slate-400">{new Date(l.loanDate).toLocaleDateString()}</td>
                  <td className="px-3 py-2 text-slate-400">{new Date(l.dueDate).toLocaleDateString()}</td>
                  <td className="px-3 py-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColor[l.status] || 'bg-slate-100'}`}>
                      {l.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};