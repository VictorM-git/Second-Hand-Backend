import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout.jsx';
import FormField from '../components/auth/FormField.jsx';
import useForm from '../hooks/useForm.js';
import { validateEmail } from '../utils/validators.js';
import { requestPasswordReset } from '../services/authService.js';

// Recuperar contraseña: pide el correo y "envía" un enlace.
export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const { values, errors, submitError, submitting, handleChange, handleSubmit } = useForm(
    { email: '' },
    (v) => ({ email: validateEmail(v.email) }),
    async (v) => {
      await requestPasswordReset(v);
      setSent(true);
    }
  );

  return (
    <AuthLayout
      tagline="Recupera el acceso a tu cuenta"
      mobileTagline="Nada nuevo se fabricó para esto"
      description="Te enviaremos un enlace para restablecer tu contraseña."
      title="Olvidé mi contraseña"
      subtitle={<>¿Recordaste tu contraseña? <Link to="/login">Inicia sesión.</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormField id="email" label="Correo electrónico" type="email" placeholder="tu@correo.com"
                   autoComplete="email" value={values.email} onChange={handleChange} error={errors.email} />

        {submitError && <p className="auth__alert" role="alert">{submitError}</p>}
        {sent && <p className="auth__success" role="status">Listo, enviamos el enlace a {values.email}.</p>}

        <button type="submit" className="btn auth__submit" disabled={submitting}>
          {submitting ? 'Enviando…' : 'Enviar enlace'}
        </button>
        <p className="auth__note">Revisa tu bandeja de entrada y la carpeta de spam.</p>
      </form>
    </AuthLayout>
  );
}
