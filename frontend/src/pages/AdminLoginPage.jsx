import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/admin/login', form);
      login(res.data);
      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login as admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section mt-10 max-w-md">
      <p className="pill">Admin access</p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-50">Admin login</h1>
      <p className="mt-2 text-sm text-slate-400">
        Restricted dashboard for managing users, orders, and websites.
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300">Admin email</label>
          <input
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-love-pink/40 focus:ring-2"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300">Password</label>
          <input
            name="password"
            type="password"
            required
            value={form.password}
            onChange={handleChange}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-love-pink/40 focus:ring-2"
          />
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Login as admin'}
        </button>
      </form>
    </section>
  );
}

