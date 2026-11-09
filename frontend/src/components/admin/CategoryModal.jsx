import { useEffect } from 'react';
import FormField from '../auth/FormField.jsx';
import useForm from '../../hooks/useForm.js';

// Ventana para crear (category = null) o editar una categoría.
// onSave(nombre) puede lanzar un error (p. ej. nombre repetido) y se muestra dentro de la ventana.
export default function CategoryModal({ category, onSave, onClose }) {
  const isEdit = Boolean(category);

  const { values, errors, submitError, submitting, handleChange, handleSubmit } = useForm(
    { name: category?.name ?? '' },
    (v) => ({ name: v.name.trim() ? '' : 'Escribe el nombre de la categoría.' }),
    async (v) => {
      await onSave(v.name);
      onClose();
    }
  );

  // Esc cierra la ventana
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-sh" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-sh__box field-light" role="dialog" aria-modal="true" aria-labelledby="category-modal-title">
        <h2 id="category-modal-title">{isEdit ? 'Editar categoría' : 'Nueva categoría'}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <FormField id="name" label="Nombre" maxLength={40} autoFocus placeholder="Ej: Instrumentos musicales"
                     value={values.name} onChange={handleChange} error={errors.name} />
          {submitError && <p className="auth__alert" role="alert">{submitError}</p>}
          <div className="form-actions mt-3">
            <button type="button" className="btn btn-sh-outline" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn btn-sh" disabled={submitting}>
              {submitting ? 'Guardando…' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
