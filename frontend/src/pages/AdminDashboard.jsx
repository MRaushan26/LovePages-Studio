import { useEffect, useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export function AdminDashboard() {
  const { token, user } = useAuth();
  const [overview, setOverview] = useState(null);
  const [websites, setWebsites] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchData = async () => {
    try {
      setError('');
      setLoading(true);
      const [ov, ws, os, us] = await Promise.all([
        api.get('/admin/overview', { headers: authHeaders }),
        api.get('/admin/websites', { headers: authHeaders }),
        api.get('/admin/orders', { headers: authHeaders }),
        api.get('/admin/users', { headers: authHeaders })
      ]);
      setOverview(ov.data);
      setWebsites(ws.data);
      setOrders(os.data);
      setUsers(us.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Unable to load admin data.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBan = async (id) => {
    try {
      await api.post(`/admin/users/${id}/ban`, {}, { headers: authHeaders });
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, banned: !u.banned } : u))
      );
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to update user.');
    }
  };

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const handleDeleteWebsite = async (id) => {
    if (!window.confirm('Delete this generated website? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/websites/${id}`, { headers: authHeaders });
      setWebsites((prev) => prev.filter((w) => w._id !== id));
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to delete website.');
    }
  };

  return (
    <section className="section mt-8">
      <p className="pill">Admin · Internal view</p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-50 sm:text-3xl">
        LovePages Studio dashboard
      </h1>
      <p className="mt-2 max-w-2xl text-sm text-slate-400">
        Use this screen to review orders, track revenue, and manage generated surprise websites.
      </p>

      <div className="card mt-6 max-w-xl">
        <p className="text-xs text-slate-400">
          Logged in as <span className="font-semibold text-slate-100">{user?.email}</span>
        </p>
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
      </div>

      {overview && (
        <div className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          <div className="card">
            <p className="text-xs text-slate-400">Total revenue</p>
            <p className="mt-1 text-xl font-semibold text-love-gold">₹{overview.totalRevenue}</p>
          </div>
          <div className="card">
            <p className="text-xs text-slate-400">Total orders</p>
            <p className="mt-1 text-xl font-semibold text-slate-50">{overview.totalOrders}</p>
          </div>
          <div className="card">
            <p className="text-xs text-slate-400">Active websites</p>
            <p className="mt-1 text-xl font-semibold text-emerald-400">
              {overview.activeWebsites}
            </p>
          </div>
          <div className="card">
            <p className="text-xs text-slate-400">Total sites</p>
            <p className="mt-1 text-xl font-semibold text-slate-50">{overview.totalWebsites}</p>
          </div>
          <div className="card">
            <p className="text-xs text-slate-400">Total users</p>
            <p className="mt-1 text-xl font-semibold text-slate-50">{overview.totalUsers}</p>
          </div>
        </div>
      )}

      {users.length > 0 && (
        <div className="card mt-6">
          <h2 className="text-sm font-semibold text-slate-50">Users</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {users.map((u) => (
              <div
                key={u._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-slate-900/70 px-3 py-2"
              >
                <div>
                  <p className="font-medium">
                    {u.name || 'Unnamed'}{' '}
                    <span className="text-slate-400">· {u.email}</span>
                    {u.banned && (
                      <span className="ml-2 rounded-full bg-red-500/20 px-2 py-0.5 text-[10px] text-red-200">
                        Banned
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Role: {u.role} · Joined {new Date(u.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleBan(u._id)}
                  className={`rounded-full px-3 py-1 text-[11px] transition ${
                    u.banned
                      ? 'border border-emerald-400 text-emerald-200 hover:bg-emerald-500/10'
                      : 'border border-red-500/70 text-red-200 hover:bg-red-500/10'
                  }`}
                >
                  {u.banned ? 'Unban' : 'Ban'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {websites.length > 0 && (
        <div className="card mt-6">
          <h2 className="text-sm font-semibold text-slate-50">Generated websites</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {websites.map((w) => (
              <div
                key={w._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-900/70 px-3 py-2"
              >
                <div>
                  <p className="font-medium">
                    {w.recipientName}{' '}
                    <span className="text-slate-400">· /site/{w.slug}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Created {new Date(w.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteWebsite(w._id)}
                  className="rounded-full border border-red-500/70 px-3 py-1 text-[11px] text-red-200 hover:bg-red-500/10"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <div className="card mt-6">
          <h2 className="text-sm font-semibold text-slate-50">Recent orders</h2>
          <div className="mt-3 space-y-2 text-xs text-slate-300">
            {orders.map((o) => (
              <div
                key={o._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-slate-900/70 px-3 py-2"
              >
                <div>
                  <p className="font-medium">
                    ₹{o.amount}{' '}
                    <span
                      className={`ml-2 rounded-full px-2 py-0.5 text-[10px] ${
                        o.status === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : 'bg-slate-700/60 text-slate-300'
                      }`}
                    >
                      {o.status}
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {o.website?.recipientName || '—'} · {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

