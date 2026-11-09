import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Restringe un grupo de rutas a un rol (RQNF002). Si el rol no coincide, lleva al inicio de su rol.
export default function RoleRoute({ role }) {
  const { user } = useAuth();
  const current = user?.role ?? 'user';
  return current === role
    ? <Outlet />
    : <Navigate to={current === 'admin' ? '/admin' : '/explorar'} replace />;
}
