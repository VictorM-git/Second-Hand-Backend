import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout.jsx';
import FormField from '../components/auth/FormField.jsx';
import useForm from '../hooks/useForm.js';
import { required, validateEmail, validatePhone, validatePassword, validateMatch } from '../utils/validators.js';
import { register } from '../services/authService.js';
import { localities } from '../data/localities.js';

// RQF001 - Registrar usuario
export default function RegisterPage() {
  const navigate = useNavigate();

  const validate = (v) => ({
    name: required(v.name),
    email: validateEmail(v.email),
    phone: validatePhone(v.phone),
    location: required(v.location) && 'Selecciona tu localidad.',
    password: validatePassword(v.password),
    confirmPassword: v.confirmPassword ? validateMatch(v.confirmPassword, v.password) : 'Repite tu contraseña.',
  });

  const { values, errors, submitError, submitting, handleChange, handleSubmit } = useForm(
    { name: '', email: '', phone: '', location: '', password: '', confirmPassword: '' },
    validate,
    async (v) => {
      await register(v);
      navigate('/login');
    }
  );

  return (
    <AuthLayout
      tagline="Tu comunidad ya tiene lo que necesitas"
      description="Con una cuenta puedes publicar tus artículos y solicitar los de otros miembros de forma directa."
      mobileNote="Crea tu cuenta para publicar, buscar y pedir artículos dentro de tu comunidad."
      title="Crear cuenta"
      subtitle={<>¿Ya tienes cuenta? <Link to="/login">Inicia sesión.</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate>
        <FormField id="name" label="Nombre completo" placeholder="Ana Camila Gómez" autoComplete="name"
                   value={values.name} onChange={handleChange} error={errors.name} />
        <FormField id="email" label="Correo electrónico" type="email" placeholder="tu@correo.com" autoComplete="email"
                   value={values.email} onChange={handleChange} error={errors.email} />
        <FormField id="phone" label="Teléfono de contacto" type="tel" placeholder="300 000 0000" autoComplete="tel"
                   value={values.phone} onChange={handleChange} error={errors.phone} />
        <FormField id="location" label="Ubicación" as="select"
                   value={values.location} onChange={handleChange} error={errors.location}>
          <option value="">Selecciona tu localidad</option>
          {localities.map((l) => <option key={l} value={l}>{l}</option>)}
        </FormField>
        <FormField id="password" label="Contraseña" type="password" placeholder="Mínimo 8 caracteres"
                   autoComplete="new-password" value={values.password} onChange={handleChange} error={errors.password} />
        <FormField id="confirmPassword" label="Confirmar contraseña" type="password" placeholder="Repetir contraseña"
                   autoComplete="new-password" value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

        {submitError && <p className="auth__alert" role="alert">{submitError}</p>}

        <button type="submit" className="btn auth__submit" disabled={submitting}>
          {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
        </button>
      </form>
    </AuthLayout>
  );
}
