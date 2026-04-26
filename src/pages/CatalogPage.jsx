import { useState, useEffect } from 'react';
import { getBooks, borrowBook, reserveBook, getAuthors } from '../api/libraryService';
import { Navbar } from '../components/Navbar';

export const CatalogPage = () => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('');
  const [filterAvailable, setFilterAvailable] = useState(false);
  const [message, setMessage] = useState('');

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.title = search;
      if (filterAuthor) params.authorId = filterAuthor;
      if (filterAvailable) params.available = true;
      const res = await getBooks(params);
      setBooks(res.data);
    } catch {
      setMessage('Failed to load books.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAuthors().then(r => setAuthors(r.data)).catch(() => {});
    fetchBooks();
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [filterAuthor, filterAvailable]);

  const handleBorrow = async (bookId) => {
    try {
      await borrowBook(bookId);
      setMessage('Book borrowed successfully!');
      fetchBooks();
    } catch (e) {
      setMessage(e.response?.data?.error_message || 'Could not borrow book.');
    }
  };

  const handleReserve = async (bookId) => {
    try {
      await reserveBook(bookId);
      setMessage('Book reserved successfully!');
      fetchBooks();
    } catch (e) {
      setMessage(e.response?.data?.error_message || 'Could not reserve book.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Book Catalog</h2>

        {message && (
          <div className="mb-4 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
            {message}
            <button onClick={() => setMessage('')} className="ml-2 font-bold">×</button>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchBooks()}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 w-56"
          />
          <select
            value={filterAuthor}
            onChange={(e) => setFilterAuthor(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            <option value="">All authors</option>
            {authors.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={filterAvailable}
              onChange={(e) => setFilterAvailable(e.target.checked)}
              className="accent-slate-700"
            />
            Available only
          </label>
          <button
            onClick={fetchBooks}
            className="bg-slate-800 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-700"
          >
            Search
          </button>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="text-slate-500">No books found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map(book => (
              <div key={book.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col gap-3">
                <div>
                  <h3 className="font-semibold text-slate-800">{book.title}</h3>
                  <p className="text-sm text-slate-500">{book.authorName}</p>
                  {book.genre && <p className="text-xs text-slate-400 mt-0.5">{book.genre}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    book.availableCopies > 0
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {book.availableCopies > 0 ? `${book.availableCopies} available` : 'Unavailable'}
                  </span>
                  <div className="flex gap-2">
                    {book.availableCopies > 0 ? (
                      <button
                        onClick={() => handleBorrow(book.id)}
                        className="text-xs bg-slate-800 text-white px-3 py-1 rounded-lg hover:bg-slate-700"
                      >
                        Borrow
                      </button>
                    ) : (
                      <button
                        onClick={() => handleReserve(book.id)}
                        className="text-xs bg-amber-500 text-white px-3 py-1 rounded-lg hover:bg-amber-400"
                      >
                        Reserve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};