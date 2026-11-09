import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="sh-footer">
      <div className="container d-flex flex-column flex-sm-row justify-content-between gap-3">
        <div>
          <div className="sh-footer__brand">Second Hand</div>
          <div className="sh-footer__copy">© 2026 Second Hand. Todos los derechos reservados.</div>
        </div>
        <nav aria-label="Información legal" className="align-self-sm-center">
          <Link to="/terminos">Términos</Link>
          <Link to="/privacidad">Privacidad</Link>
          <Link to="/contacto">Contacto</Link>
        </nav>
      </div>
    </footer>
  );
}
