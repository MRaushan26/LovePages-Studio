import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export function UserDashboard() {
  const { user, token, logout } = useAuth();
  const [websites, setWebsites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWebsites = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await api.get('/websites/mine/list', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWebsites(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load your websites.');
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchWebsites();
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this surprise website? This cannot be undone.')) return;
    try {
      setError('');
      await api.delete(`/websites/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWebsites((prev) => prev.filter((w) => w._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete this website.');
    }
  };

  return (
    <section className="section mt-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="pill">Your space</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-50">
            Hi {user?.name || 'there'}, here are your surprise websites
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            You can revisit, share, and create new LovePages from here.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="btn-ghost text-xs text-slate-300 hover:text-slate-50"
        >
          Logout
        </button>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Link to="/templates" className="btn-primary">
          Create new website
        </Link>
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-slate-400">Loading your websites…</p>
        ) : error ? (
          <p className="text-sm text-red-400">{error}</p>
        ) : websites.length === 0 ? (
          <p className="text-sm text-slate-400">
            You have not created any surprise websites yet. Start with a template above.
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {websites.map((w) => (
              <div
                key={w._id}
                className="card flex flex-col justify-between hover:border-love-pink/70"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-50">
                        {w.recipientName}{' '}
                        <span className="text-xs font-normal text-slate-400">/site/{w.slug}</span>
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Created {new Date(w.createdAt).toLocaleString()}
                      </p>
                      {w.expiryDate && (
                        <p className="mt-1 text-xs text-slate-400">
                          Expires {new Date(w.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(w._id)}
                      className="rounded-full border border-red-500/70 bg-red-500/10 px-3 py-1 text-[11px] text-red-200 hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-xs text-slate-400">Click to open the live surprise page.</p>
                  <Link
                    to={`/site/${w.slug}`}
                    className="text-xs font-semibold text-love-pink hover:text-love-purple"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

