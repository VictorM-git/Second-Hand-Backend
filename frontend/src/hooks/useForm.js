import { useState } from 'react';

/**
 * Maneja los valores, errores y envío de un formulario.
 * @param {object} initialValues - valores iniciales de los campos
 * @param {function} validate - recibe los valores y devuelve { campo: 'mensaje' }
 * @param {function} onSubmit - función async que se ejecuta si no hay errores
 */
export default function useForm(initialValues, validate, onSubmit) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Cambia un campo por nombre (útil para campos que no son inputs, como la foto)
  const setValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleChange = (e) => setValue(e.target.name, e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate(values);
    setErrors(newErrors);
    setSubmitError('');
    if (Object.values(newErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      await onSubmit(values);
    } catch (err) {
      setSubmitError(err.message || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  return { values, errors, submitError, submitting, handleChange, setValue, handleSubmit };
}
