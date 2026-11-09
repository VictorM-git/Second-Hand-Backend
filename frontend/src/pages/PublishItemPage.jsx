import { Link, useParams } from 'react-router-dom';
import ItemForm from '../components/publish/ItemForm.jsx';
import useAsync from '../hooks/useAsync.js';
import { getMyItemById } from '../services/myItemsService.js';

// Publicar un artículo nuevo (/publicaciones/nueva) o editar uno propio (/publicaciones/:id/editar).
export default function PublishItemPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { data: item, loading, error } = useAsync(
    () => (isEdit ? getMyItemById(id) : Promise.resolve(null)),
    [id]
  );

  if (isEdit && loading) return <div className="page container-xl"><p role="status">Cargando publicación…</p></div>;
  if (isEdit && error) return <div className="page container-xl"><p role="alert" className="text-danger">{error}</p></div>;

  if (isEdit && (!item || item.status === 'Entregado')) {
    return (
      <div className="page container-xl">
        <h1 className="detail__title">Esta publicación no se puede editar</h1>
        <p>No existe o ya fue entregada.</p>
        <Link to="/mis-publicaciones">Volver a Mis publicaciones</Link>
      </div>
    );
  }

  return (
    <div className="page container-xl">
      <div className="page__head">
        <h1>{isEdit ? 'Editar artículo' : 'Publicar un artículo'}</h1>
        <p>Entre mejor lo describas, más rápido encuentra dueño.</p>
      </div>
      <ItemForm key={item?.id ?? 'nuevo'} item={item} />
    </div>
  );
}
