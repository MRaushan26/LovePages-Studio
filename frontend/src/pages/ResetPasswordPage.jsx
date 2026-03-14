import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api.js';

export function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/reset-password', { token, password });
      setMessage(res.data?.message || 'Password updated successfully.');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section mt-10 max-w-md">
      <p className="pill">Reset password</p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-50">Create a new password</h1>
      <p className="mt-2 text-sm text-slate-400">
        Enter a new password for your account. You will be redirected to login after success.
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300">New password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-love-pink/40 focus:ring-2"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-300">Confirm password</label>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            type="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-love-pink/40 focus:ring-2"
          />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}
        {message && <p className="text-xs text-emerald-300">{message}</p>}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center disabled:opacity-60"
        >
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </section>
  );
}
