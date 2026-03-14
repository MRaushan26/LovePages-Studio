import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/auth/login', form);
      login(res.data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse?.credential;
    if (!token) return;
    try {
      setLoading(true);
      setError('');
      const res = await api.post('/auth/google', { token });
      login(res.data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login with Google.');
    } finally {
      setLoading(false);
    }
  };

  const googleClientId = useMemo(() => import.meta.env.VITE_GOOGLE_CLIENT_ID, []);

  return (
    <section className="section mt-10 max-w-md">
      <p className="pill">Welcome back</p>
      <h1 className="mt-3 text-2xl font-semibold text-slate-50">Login to your account</h1>
      <p className="mt-2 text-sm text-slate-400">
        Continue where you left off and manage your surprise websites.
      </p>

      <form onSubmit={handleSubmit} className="card mt-6 space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-300">Email</label>
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
          {loading ? 'Logging in…' : 'Login'}
        </button>

        {googleClientId ? (
          <>
            <div className="flex items-center justify-center gap-3">
              <span className="h-px flex-1 bg-slate-700" />
              <span className="text-xs text-slate-500">or</span>
              <span className="h-px flex-1 bg-slate-700" />
            </div>

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google sign-in failed. Please try again.')}
              size="large"
            />
          </>
        ) : (
          <p className="text-xs text-slate-400">
            Google Sign-In is currently disabled because the app is not configured with a
            Google Client ID.
          </p>
        )}

        <div className="flex flex-col gap-2 text-center text-xs text-slate-400">
          <Link to="/forgot-password" className="text-love-pink hover:text-love-purple">
            Forgot password?
          </Link>
          <p>
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-love-pink hover:text-love-purple">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}

