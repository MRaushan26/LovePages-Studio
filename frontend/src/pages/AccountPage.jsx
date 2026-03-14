import { useState } from 'react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export function AccountPage() {
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      setMessage(res.data?.message || 'Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to change password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section mt-10 max-w-md">
      <p className="pill">Your account</p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-50">Account settings</h1>
      <p className="mt-2 text-sm text-slate-400">
        Manage your profile details and access all your generated surprise websites.
      </p>

      <div className="card mt-6 space-y-4">
        <div>
          <p className="text-xs text-slate-400">Name</p>
          <p className="mt-1 text-sm text-slate-100">{user?.name || '—'}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400">Email</p>
          <p className="mt-1 text-sm text-slate-100">{user?.email || '—'}</p>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-50">Change password</h2>
          <div>
            <label className="block text-xs font-medium text-slate-300">Current password</label>
            <input
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              required
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-love-pink/40 focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300">New password</label>
            <input
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              required
              minLength={6}
              className="mt-1 w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 outline-none ring-love-pink/40 focus:ring-2"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300">Confirm new password</label>
            <input
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

        <button
          type="button"
          onClick={logout}
          className="btn-ghost w-full text-center text-sm"
        >
          Logout
        </button>
      </div>
    </section>
  );
}
