import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api.js';

const AuthContext = createContext(null);

function getLocalUsers() {
  try {
    return JSON.parse(localStorage.getItem('lp_local_users') || '{}');
  } catch {
    return {};
  }
}

function setLocalUsers(users) {
  localStorage.setItem('lp_local_users', JSON.stringify(users));
}

function createLocalToken(email) {
  return `local:${btoa(email.toLowerCase())}`;
}

function getLocalUserFromToken(token) {
  if (!token?.startsWith('local:')) return null;
  try {
    const email = atob(token.slice(6));
    const users = getLocalUsers();
    return users[email] || null;
  } catch {
    return null;
  }
}

function createLocalUser({ name, email, password }) {
  const users = getLocalUsers();
  const normalized = email.toLowerCase().trim();
  if (users[normalized]) {
    return { exists: true, user: users[normalized] };
  }
  const user = {
    id: `local-${Date.now()}`,
    name,
    email: normalized,
    role: 'user',
    password
  };
  users[normalized] = user;
  setLocalUsers(users);
  return { exists: false, user };
}

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

      const localUser = getLocalUserFromToken(token);
      if (localUser) {
        setUser(localUser);
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

  const loginWithLocal = ({ email, password }) => {
    const users = getLocalUsers();
    const normalized = email?.toLowerCase().trim();
    const found = users[normalized];
    if (found && found.password === password) {
      const localToken = createLocalToken(found.email);
      login({ token: localToken, user: { ...found, password: undefined } });
      return true;
    }
    return false;
  };

  const signupWithLocal = ({ name, email, password }) => {
    const { exists, user: newUser } = createLocalUser({ name, email, password });
    if (exists) return { success: false, message: 'An account with this email already exists.' };
    const localToken = createLocalToken(newUser.email);
    login({ token: localToken, user: { ...newUser, password: undefined } });
    return { success: true };
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
    loginWithLocal,
    signupWithLocal,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

