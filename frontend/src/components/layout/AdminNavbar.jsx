import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import logo from '../../assets/logo.svg';

// Navbar del administrador: Panel, Usuarios, Categorías y Explorar. En móvil usa menú hamburguesa.
export default function AdminNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userRef = useRef(null);

  // Cierra el menú del avatar al hacer clic fuera
  useEffect(() => {
    const onClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };
  const linkClass = ({ isActive }) => `app-nav__link${isActive ? ' active' : ''}`;
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="app-nav">
      <div className="container-xl app-nav__inner">
        <button type="button" className="app-nav__burger d-md-none" aria-label="Abrir menú"
                aria-expanded={menuOpen} aria-controls="admin-menu" onClick={() => setMenuOpen((o) => !o)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/admin" className="app-nav__brand" aria-label="Second Hand, ir al panel">
          <img src={logo} alt="Second Hand" />
        </Link>
        <span className="admin-badge d-none d-md-inline-block">ADMIN</span>

        <nav id="admin-menu" className={`app-nav__links app-nav__links--admin${menuOpen ? ' is-open' : ''}`} aria-label="Administración">
          <NavLink to="/admin" end className={linkClass} onClick={closeMenu}>Panel</NavLink>
          <NavLink to="/admin/usuarios" className={linkClass} onClick={closeMenu}>Usuarios</NavLink>
          <NavLink to="/admin/categorias" className={linkClass} onClick={closeMenu}>Categorías</NavLink>
          <NavLink to="/explorar" className={linkClass} onClick={closeMenu}>Explorar</NavLink>
        </nav>

        <div className="admin-right">
          <span className="admin-badge d-md-none">ADMIN</span>
          <div className="app-nav__user" ref={userRef}>
            <button type="button" className="app-nav__avatar app-nav__avatar--admin" aria-label="Menú de administrador"
                    aria-expanded={userMenuOpen} onClick={() => setUserMenuOpen((o) => !o)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </button>
            {userMenuOpen && (
              <div className="app-nav__menu">
                <p className="app-nav__menu-name">{user?.name}</p>
                <button type="button" className="app-nav__menu-item" onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
