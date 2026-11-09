import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ExplorePage from './pages/ExplorePage.jsx';
import ItemDetailPage from './pages/ItemDetailPage.jsx';
import MyRequestsPage from './pages/MyRequestsPage.jsx';
import ContactProfilePage from './pages/ContactProfilePage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import MyPublicationsPage from './pages/MyPublicationsPage.jsx';
import PublishItemPage from './pages/PublishItemPage.jsx';
import RequestItemPage from './pages/RequestItemPage.jsx';
import AdminDashboardPage from './pages/AdminDashboardPage.jsx';
import AdminUsersPage from './pages/AdminUsersPage.jsx';
import AdminCategoriesPage from './pages/AdminCategoriesPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RoleRoute from './components/RoleRoute.jsx';
import AppLayout from './components/layout/AppLayout.jsx';

// Vista temporal para rutas inexistentes.
function NotFound() {
  return <div className="container-xl py-5"><h1>Página no encontrada</h1></div>;
}

export default function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/recuperar-contrasena" element={<ForgotPasswordPage />} />

      {/* Rutas privadas: requieren sesión y comparten navbar (según rol) + footer */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Compartidas: usuario y administrador (RQF005) */}
          <Route path="/explorar" element={<ExplorePage />} />
          <Route path="/articulos/:id" element={<ItemDetailPage />} />

          {/* Solo usuarios */}
          <Route element={<RoleRoute role="user" />}>
            <Route path="/articulos/:id/solicitud" element={<RequestItemPage />} />
            <Route path="/mis-publicaciones" element={<MyPublicationsPage />} />
            <Route path="/publicaciones/nueva" element={<PublishItemPage />} />
            <Route path="/publicaciones/:id/editar" element={<PublishItemPage />} />
            <Route path="/mis-solicitudes" element={<MyRequestsPage />} />
            <Route path="/mis-solicitudes/:id/contacto" element={<ContactProfilePage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>

          {/* Solo administrador */}
          <Route element={<RoleRoute role="admin" />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/usuarios" element={<AdminUsersPage />} />
            <Route path="/admin/categorias" element={<AdminCategoriesPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
