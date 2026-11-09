import { Outlet } from 'react-router-dom';
import AppNavbar from './AppNavbar.jsx';
import AdminNavbar from './AdminNavbar.jsx';
import Footer from '../Footer.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

// Estructura de las páginas privadas: navbar según el rol + contenido + footer.
export default function AppLayout() {
  const { isAdmin } = useAuth();
  return (
    <div className="app-shell">
      {isAdmin ? <AdminNavbar /> : <AppNavbar />}
      <main className="app-shell__main"><Outlet /></main>
      <Footer />
    </div>
  );
}
