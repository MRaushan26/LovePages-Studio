import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/create', label: 'Create' },
  { to: '/about', label: 'About' }
];

export function Layout({ children }) {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div className="min-h-screen gradient-orbit">
      <header className="sticky top-0 z-30 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl">
        <div className="section flex items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-love-pink to-love-purple shadow-lg shadow-pink-500/40">
              <span className="text-xl">❤</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-wide text-slate-50">
                LovePages <span className="text-love-pink">Studio</span>
              </div>
              <div className="text-xs text-slate-400">Moments that live on the web</div>
            </div>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition hover:text-white ${isActive ? 'text-love-pink' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {user && !isAdmin && (
              <>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `transition hover:text-white ${isActive ? 'text-love-pink' : ''}`
                  }
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/account"
                  className={({ isActive }) =>
                    `transition hover:text-white ${isActive ? 'text-love-pink' : ''}`
                  }
                >
                  Account
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `transition hover:text-white ${isActive ? 'text-love-pink' : ''}`
                }
              >
                Admin
              </NavLink>
            )}
          </nav>
          <div className="flex items-center gap-3">
            {!user && (
              <Link to="/login" className="btn-ghost text-xs sm:text-sm">
                Login
              </Link>
            )}
            {user && (
              <button
                type="button"
                onClick={logout}
                className="hidden text-xs text-slate-400 hover:text-slate-100 md:inline"
              >
                Logout
              </button>
            )}
            <Link to="/create" className="btn-primary text-xs sm:text-sm">
              Create a surprise
            </Link>
          </div>
        </div>
      </header>
      <main className="pb-16 pt-6">{children}</main>
      <footer className="border-t border-slate-800/60 bg-slate-950/60 py-6 text-xs text-slate-500">
        <div className="section flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p>© {new Date().getFullYear()} LovePages Studio. Crafted for celebrations.</p>
          <p className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Instant web surprises · No coding needed
          </p>
        </div>
      </footer>
    </div>
  );
}

