import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data?.message || 'If an account exists, a reset link has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section mt-10 max-w-md">
      <p className="pill">Forgot password</p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-50">Reset your password</h1>
      <p className="mt-2 text-sm text-slate-400">
        Enter your email and we'll send a link to reset your password. Check your inbox for the link.
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
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
          {loading ? 'Sending…' : 'Send reset link'}
        </button>

        <button
          type="button"
          onClick={() => navigate('/login')}
          className="btn-ghost w-full text-center text-sm"
        >
          Back to login
        </button>
      </form>
    </section>
  );
}
