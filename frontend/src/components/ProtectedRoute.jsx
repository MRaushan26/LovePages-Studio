import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, token, isAdmin, initializing } = useAuth();

  if (initializing) {
    return (
      <div className="section mt-10 text-center text-sm text-slate-300">
        Checking your session…
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to={requireAdmin ? '/admin/login' : '/login'} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

