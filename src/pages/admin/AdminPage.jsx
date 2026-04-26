import { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { AdminBooks } from './AdminBooks';
import { AdminAuthors } from './AdminAuthors';
import { AdminLoans } from './AdminLoans';

export const AdminPage = () => {
  const [tab, setTab] = useState('books');

  const tabs = [
    { id: 'books', label: '📚 Books' },
    { id: 'authors', label: '✍️ Authors' },
    { id: 'loans', label: '📋 Loans' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Admin Panel</h2>

        <div className="flex gap-2 mb-6 border-b border-slate-200">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
                tab === t.id
                  ? 'bg-white border border-b-white border-slate-200 text-slate-800 -mb-px'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-b-xl rounded-tr-xl border border-slate-200 shadow-sm p-6">
          {tab === 'books' && <AdminBooks />}
          {tab === 'authors' && <AdminAuthors />}
          {tab === 'loans' && <AdminLoans />}
        </div>
      </div>
    </div>
  );
};