import { Link, useNavigate } from 'react-router-dom';
import FormField from '../auth/FormField.jsx';
import PhotoUploader from './PhotoUploader.jsx';
import useForm from '../../hooks/useForm.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { conditions } from '../../data/categories.js';
import useActiveCategories from '../../hooks/useActiveCategories.js';
import { localities } from '../../data/localities.js';
import { required } from '../../utils/validators.js';
import { createMyItem, updateMyItem } from '../../services/myItemsService.js';

// Formulario para publicar (item = null) o editar (item = publicación existente) un artículo. RQF004.
export default function ItemForm({ item }) {
  const isEdit = Boolean(item);
  const { user } = useAuth();
  const navigate = useNavigate();
  // Solo categorías activas; al editar se conserva la actual aunque ya esté inactiva
  const activeCategories = useActiveCategories();
  const categoryOptions = item && !activeCategories.includes(item.category)
    ? [item.category, ...activeCategories]
    : activeCategories;

  const validate = (v) => ({
    title: required(v.title) || (v.title.trim().length > 80 ? 'Máximo 80 caracteres.' : ''),
    category: v.category ? '' : 'Selecciona una categoría.',
    condition: v.condition ? '' : 'Selecciona el estado.',
    description: v.description.trim().length >= 20 ? '' : 'Describe el artículo en al menos 20 caracteres.',
    location: v.location ? '' : 'Selecciona la ubicación de entrega.',
    photo: v.photo ? '' : 'Agrega una fotografía del artículo.',
  });

  const { values, errors, submitError, submitting, handleChange, setValue, handleSubmit } = useForm(
    {
      title: item?.title ?? '',
      category: item?.category ?? '',
      condition: item?.condition ?? '',
      description: item ? item.description.join('\n\n') : '',
      location: item?.location ?? user?.location ?? '',
      photo: item?.image ?? '',
    },
    validate,
    async (v) => {
      if (isEdit) {
        await updateMyItem(item.id, v);
      } else {
        await createMyItem(v, { name: user.name, location: `${v.location}, Bogotá` });
      }
      navigate('/mis-publicaciones', { state: { message: isEdit ? 'Cambios guardados.' : 'Artículo publicado.' } });
    }
  );

  return (
    <form className="publish-grid" onSubmit={handleSubmit} noValidate>
      <section className="card-sh field-light publish-grid__photo" aria-labelledby="photo-title">
        <h2 id="photo-title" className="photo__label">Fotografía</h2>
        <PhotoUploader value={values.photo} onChange={(url) => setValue('photo', url)} error={errors.photo} />
      </section>

      <section className="card-sh field-light publish-grid__form" aria-label="Datos del artículo">
        <div className="field-grid">
          <div className="field-grid__full">
            <FormField id="title" label="Título" placeholder="Ej: Cálculo de una variable, Stewart" maxLength={80}
                       value={values.title} onChange={handleChange} error={errors.title} />
          </div>
          <FormField id="category" label="Categoría" as="select"
                     value={values.category} onChange={handleChange} error={errors.category}>
            <option value="">Selecciona una categoría</option>
            {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </FormField>
          <FormField id="condition" label="Estado" as="select"
                     value={values.condition} onChange={handleChange} error={errors.condition}>
            <option value="">Selecciona el estado</option>
            {conditions.map((c) => <option key={c} value={c}>{c}</option>)}
          </FormField>
          <div className="field-grid__full">
            <FormField id="description" label="Descripción" as="textarea" rows={5}
                       placeholder="Cuenta en qué estado está, qué le falta y por qué lo dejas ir."
                       value={values.description} onChange={handleChange} error={errors.description} />
          </div>
          <div className="field-grid__full">
            <FormField id="location" label="Ubicación de entrega" as="select"
                       value={values.location} onChange={handleChange} error={errors.location}>
              <option value="">Selecciona la localidad</option>
              {localities.map((l) => <option key={l} value={l}>{l}, Bogotá</option>)}
            </FormField>
          </div>
        </div>
      </section>

      <div className="publish-grid__actions">
        {submitError && <p className="auth__alert" role="alert">{submitError}</p>}
        <div className="form-actions">
          <Link to="/mis-publicaciones" className="btn btn-sh-outline">Cancelar</Link>
          <button type="submit" className="btn btn-sh" disabled={submitting}>
            {submitting ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Publicar'}
          </button>
        </div>
      </div>
    </form>
  );
}
