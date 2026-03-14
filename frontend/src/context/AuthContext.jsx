import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('lp_token') || '');
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!token) {
        setInitializing(false);
        return;
      }
      try {
        const res = await api.get('/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(res.data);
      } catch {
        setToken('');
        localStorage.removeItem('lp_token');
        localStorage.removeItem('lp_user');
      } finally {
        setInitializing(false);
      }
    };
    bootstrap();
  }, [token]);

  const login = ({ token: newToken, user: newUser }) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('lp_token', newToken);
    localStorage.setItem('lp_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('lp_token');
    localStorage.removeItem('lp_user');
  };

  const value = {
    user,
    token,
    isAdmin: user?.role === 'admin',
    initializing,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

