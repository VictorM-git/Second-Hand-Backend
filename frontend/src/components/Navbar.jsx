import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

// Barra superior: logo a la izquierda, acciones de sesión a la derecha.
export default function Navbar() {
  return (
    <header className="sh-navbar py-3">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/" aria-label="Second Hand, ir al inicio">
          <img src={logo} alt="Second Hand" className="sh-logo" />
        </Link>
        <nav className="d-flex gap-2" aria-label="Cuenta">
          <Link to="/login" className="btn btn-sh-outline">Iniciar sesión</Link>
          <Link to="/registro" className="btn btn-sh">Crear cuenta</Link>
        </nav>
      </div>
    </header>
  );
}
