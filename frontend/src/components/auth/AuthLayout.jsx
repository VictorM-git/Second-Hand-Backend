import AuthBrand from './AuthBrand.jsx';

/**
 * Estructura compartida de Entrar / Crear cuenta / Olvidé mi contraseña.
 * - Escritorio (lg+): dos paneles (marca a la izquierda, formulario blanco a la derecha).
 * - Tablet y móvil: una sola columna verde con todo centrado.
 */
export default function AuthLayout({ tagline, mobileTagline, description, title, subtitle, mobileNote, children }) {
  return (
    <div className="auth">
      <aside className="auth__brand-panel">
        <AuthBrand tagline={tagline} mobileTagline={mobileTagline} description={description} />
      </aside>

      <main className="auth__form-panel">
        <div className="auth__form-wrap">
          <h1 className="auth__title">{title}</h1>
          <p className="auth__subtitle">{subtitle}</p>
          {children}
          {mobileNote && <p className="auth__mobile-note d-md-none">{mobileNote}</p>}
        </div>
      </main>
    </div>
  );
}
