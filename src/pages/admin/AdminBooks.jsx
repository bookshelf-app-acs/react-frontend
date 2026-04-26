import { useState, useEffect } from 'react';
import { getBooks, createBook, deleteBook, getAuthors } from '../../api/libraryService';

export const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [form, setForm] = useState({ title: '', authorId: '', genre: '', totalCopies: 1 });
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState('');

  const fetchAll = async () => {
    const [bRes, aRes] = await Promise.all([getBooks({}), getAuthors()]);
    setBooks(bRes.data);
    setAuthors(aRes.data);
  };

  useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createBook({ ...form, totalCopies: Number(form.totalCopies) });
      setMessage('Book added!');
      setForm({ title: '', authorId: '', genre: '', totalCopies: 1 });
      setShowForm(false);
      fetchAll();
    } catch (e) {
      setMessage(e.response?.data?.error_message || 'Failed to add book.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return;
    try {
      await deleteBook(id);
      fetchAll();
    } catch (e) {
      setMessage(e.response?.data?.error_message || 'Failed to delete book.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-700">Manage Books</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm bg-slate-800 text-white px-4 py-1.5 rounded-lg hover:bg-slate-700"
        >
          {showForm ? 'Cancel' : '+ Add Book'}
        </button>
      </div>

      {message && (
        <div className="mb-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm">
          {message} <button onClick={() => setMessage('')} className="ml-1 font-bold">×</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-slate-50 rounded-lg p-4 mb-4 flex flex-wrap gap-3">
          <input
            placeholder="Title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            required
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm flex-1 min-w-40"
          />
          <select
            value={form.authorId}
            onChange={e => setForm({ ...form, authorId: e.target.value })}
            required
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm flex-1 min-w-40"
          >
            <option value="">Select author</option>
            {authors.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
          <input
            placeholder="Genre (optional)"
            value={form.genre}
            onChange={e => setForm({ ...form, genre: e.target.value })}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-36"
          />
          <input
            type="number" min="1"
            placeholder="Copies"
            value={form.totalCopies}
            onChange={e => setForm({ ...form, totalCopies: e.target.value })}
            className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm w-24"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-green-500">
            Add
          </button>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-600 border-b">
            <tr>
              <th className="px-3 py-2">Title</th>
              <th className="px-3 py-2">Author</th>
              <th className="px-3 py-2">Genre</th>
              <th className="px-3 py-2 text-center">Available</th>
              <th className="px-3 py-2 text-center">Total</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {books.map(b => (
              <tr key={b.id} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-3 py-2 font-medium">{b.title}</td>
                <td className="px-3 py-2 text-slate-500">{b.authorName}</td>
                <td className="px-3 py-2 text-slate-400">{b.genre || '—'}</td>
                <td className="px-3 py-2 text-center">{b.availableCopies}</td>
                <td className="px-3 py-2 text-center">{b.totalCopies}</td>
                <td className="px-3 py-2 text-right">
                  <button onClick={() => handleDelete(b.id)} className="text-red-500 hover:text-red-700 text-xs">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};