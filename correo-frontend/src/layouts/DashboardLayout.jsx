import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';

const linksByRole = {
  usuario: [{ to: '/usuario', label: 'Dashboard usuario' }],
  secretaria: [{ to: '/secretaria', label: 'Dashboard secretaria' }],
  admin: [{ to: '/admin', label: 'Dashboard administrador' }],
};

export default function DashboardLayout({ title, subtitle, children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = linksByRole[user?.role?.name] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-6">
          <div>
            <Link to="/" className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Clasificador de Correos
            </Link>
            <h1 className="mt-2 text-2xl font-bold text-slate-950">{title}</h1>
            <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs uppercase tracking-wide text-slate-500">Rol: {user?.role?.name}</p>
            </div>
            <Button variant="secondary" onClick={handleLogout}>Salir</Button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:grid-cols-[220px_1fr] md:px-6">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Navegación</p>
          <nav className="space-y-2">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2 text-sm font-medium ${isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="space-y-6">{children}</main>
      </div>
    </div>
  );
}
