// Campo de formulario reutilizable: label + input (o select) + mensaje de error accesible.
export default function FormField({ id, label, error, as = 'input', children, ...props }) {
  const Control = as;
  const errorId = `${id}-error`;
  return (
    <div className="auth-field">
      <label htmlFor={id} className="auth-field__label">{label}</label>
      <Control
        id={id}
        name={id}
        className={`auth-field__control${error ? ' is-invalid' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? errorId : undefined}
        {...props}
      >
        {children}
      </Control>
      {error && <p id={errorId} className="auth-field__error" role="alert">{error}</p>}
    </div>
  );
}
