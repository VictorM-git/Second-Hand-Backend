import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout.jsx';
import FormField from '../components/auth/FormField.jsx';
import useForm from '../hooks/useForm.js';
import { validateEmail, required } from '../utils/validators.js';
import { useAuth } from '../context/AuthContext.jsx';

// RQF002 - Iniciar sesión
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const redirectTo = location.state?.from?.pathname ?? '/explorar'; // vuelve a donde iba el usuario

  const validate = (v) => ({
    email: validateEmail(v.email),
    password: required(v.password) && 'Ingresa tu contraseña.',
  });

  const { values, errors, submitError, submitting, handleChange, handleSubmit } = useForm(
    { email: '', password: '' },
    validate,
    async (v) => {
      await login(v);
      navigate(redirectTo, { replace: true });
    }
  );

  return (
    <AuthLayout
      tagline="Nada nuevo se fabricó para esto"
      description="Entra con tu cuenta para publicar, buscar y pedir artículos dentro de tu comunidad."
      mobileNote="Entra con tu cuenta para publicar, buscar y pedir artículos dentro de tu comunidad."
      title="Entrar"
      subtitle={<>¿Todavía no tienes cuenta? <Link to="/registro">Crea una en un minuto.</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormField id="email" label="Correo electrónico" type="email" placeholder="tu@correo.com"
                   autoComplete="email" value={values.email} onChange={handleChange} error={errors.email} />
        <FormField id="password" label="Contraseña" type="password" placeholder="••••••••"
                   autoComplete="current-password" value={values.password} onChange={handleChange} error={errors.password} />

        {submitError && <p className="auth__alert" role="alert">{submitError}</p>}

        <button type="submit" className="btn auth__submit" disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar'}
        </button>
        <p className="auth__link-center"><Link to="/recuperar-contrasena">Olvidé mi contraseña</Link></p>
      </form>
    </AuthLayout>
  );
}
