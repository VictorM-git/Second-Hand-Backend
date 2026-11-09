import logo from '../../assets/logo-white.svg';

// Bloque de marca: logo + frase + descripción.
// En escritorio vive en el panel verde izquierdo; en tablet/móvil queda arriba del formulario.
export default function AuthBrand({ tagline, mobileTagline, description }) {
  return (
    <div className="auth-brand">
      <img src={logo} alt="Second Hand" className="auth-brand__logo" />
      <div className="auth-brand__text">
        <h2 className="auth-brand__tagline d-none d-lg-block">{tagline}</h2>
        <p className="auth-brand__tagline auth-brand__tagline--sm d-lg-none">{mobileTagline ?? tagline}</p>
        {description && <p className="auth-brand__desc d-none d-md-block">{description}</p>}
      </div>
    </div>
  );
}
