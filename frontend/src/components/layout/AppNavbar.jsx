import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Avatar from '../Avatar.jsx';
import logo from '../../assets/logo.svg';

// Navbar para usuarios con sesión. Escritorio/tablet: enlaces + buscador + avatar.
// Móvil: botón hamburguesa que despliega los enlaces y el buscador.
export default function AppNavbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);   // menú móvil
  const [userMenuOpen, setUserMenuOpen] = useState(false); // menú del avatar
  const [term, setTerm] = useState('');
  const userRef = useRef(null);

  // Cierra el menú del avatar al hacer clic fuera
  useEffect(() => {
    const onClick = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setMenuOpen(false);
    navigate(term.trim() ? `/explorar?q=${encodeURIComponent(term.trim())}` : '/explorar');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClass = ({ isActive }) => `app-nav__link${isActive ? ' active' : ''}`;
  const closeMenu = () => setMenuOpen(false);

  // Buscador reutilizado en escritorio (dentro del header) y móvil (dentro del menú)
  const searchForm = (extraClass) => (
    <form className={`app-nav__search ${extraClass}`} onSubmit={handleSearch} role="search">
      <input type="search" value={term} onChange={(e) => setTerm(e.target.value)}
             placeholder="Buscar artículos" aria-label="Buscar artículos" />
    </form>
  );

  return (
    <header className="app-nav">
      <div className="container-xl app-nav__inner">
        <button type="button" className="app-nav__burger d-md-none" aria-label="Abrir menú"
                aria-expanded={menuOpen} aria-controls="app-menu" onClick={() => setMenuOpen((o) => !o)}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link to="/explorar" className="app-nav__brand" aria-label="Second Hand, ir a Explorar">
          <img src={logo} alt="Second Hand" />
        </Link>

        <nav id="app-menu" className={`app-nav__links${menuOpen ? ' is-open' : ''}`} aria-label="Principal">
          <NavLink to="/explorar" className={linkClass} onClick={closeMenu}>Explorar</NavLink>
          <NavLink to="/mis-publicaciones" className={linkClass} onClick={closeMenu}>Mis publicaciones</NavLink>
          <NavLink to="/mis-solicitudes" className={linkClass} onClick={closeMenu}>Mis solicitudes</NavLink>
          {searchForm('app-nav__search--menu d-md-none')}
        </nav>

        {searchForm('app-nav__search--desktop d-none d-md-flex')}

        <div className="app-nav__user" ref={userRef}>
          <button type="button" className="app-nav__avatar" aria-label="Menú de usuario"
                  aria-expanded={userMenuOpen} onClick={() => setUserMenuOpen((o) => !o)}>
            <Avatar src={user?.photo} name={user?.name} size={34} />
          </button>
          {userMenuOpen && (
            <div className="app-nav__menu">
              <p className="app-nav__menu-name">{user?.name}</p>
              <Link to="/perfil" className="app-nav__menu-item" onClick={() => setUserMenuOpen(false)}>Mi perfil</Link>
              <button type="button" className="app-nav__menu-item" onClick={handleLogout}>Cerrar sesión</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
