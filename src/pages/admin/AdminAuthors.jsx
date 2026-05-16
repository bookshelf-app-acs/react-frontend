import { useState, useEffect } from 'react';
import { getAuthors, createAuthor, deleteAuthor } from '../../api/libraryService';

export const AdminAuthors = () => {
  const [authors, setAuthors] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');

  const fetchAuthors = async () => {
    const res = await getAuthors();
    setAuthors(res.data);
  };

  useEffect(() => { fetchAuthors(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createAuthor({ firstName, lastName });
      setFirstName('');
      setLastName('');
      setMessage('');
      fetchAuthors();
    } catch (e) {
      setMessage(e.response?.data?.error_message || 'Failed to add author.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete author?')) return;
    try {
      await deleteAuthor(id);
      fetchAuthors();
    } catch (e) {
      setMessage(e.response?.data?.error_message || 'Failed to delete author.');
    }
  };

  const fullName = (a) => `${a.firstName ?? ''} ${a.lastName ?? ''}`.trim() || a.name;

  return (
    <div>
      <h3 className="font-semibold text-slate-700 mb-4">Manage Authors</h3>
      {message && <div className="mb-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 text-sm">{message}</div>}

      <form onSubmit={handleCreate} className="flex gap-3 mb-6">
        <input
          placeholder="First name"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          required
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm flex-1"
        />
        <input
          placeholder="Last name"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          required
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm flex-1"
        />
        <button type="submit" className="bg-slate-800 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-slate-700">
          Add Author
        </button>
      </form>

      <div className="flex flex-col gap-2">
        {authors.map(a => (
          <div key={a.id} className="flex items-center justify-between border border-slate-200 rounded-lg px-4 py-2">
            <span className="text-sm font-medium text-slate-700">{fullName(a)}</span>
            <button onClick={() => handleDelete(a.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};
