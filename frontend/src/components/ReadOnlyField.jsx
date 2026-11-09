// Dato de solo lectura (etiqueta + valor) para las vistas de consulta.
// Debe usarse dentro de un <dl>. `plain` quita el recuadro (útil para chips).
export default function ReadOnlyField({ label, children, plain = false }) {
  return (
    <div className="ro-field">
      <dt>{label}</dt>
      <dd className={plain ? 'ro-field__plain' : undefined}>{children}</dd>
    </div>
  );
}
