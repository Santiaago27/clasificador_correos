import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RoleRoute({ allowedRoles = [] }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-slate-600">Cargando permisos...</div>;
  }

  if (!user || !allowedRoles.includes(user.role.name)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}
