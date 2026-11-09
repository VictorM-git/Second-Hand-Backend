import { useState } from 'react';
import CategoryModal from '../components/admin/CategoryModal.jsx';
import Chip from '../components/Chip.jsx';
import useCategoriesAdmin from '../hooks/useCategoriesAdmin.js';

// RQF010 - Gestionar categorías: registrar, modificar e inactivar.
export default function AdminCategoriesPage() {
  const { categories, loading, error, busyId, create, update, toggle } = useCategoriesAdmin();
  const [modal, setModal] = useState(null); // null = cerrado · { category: null } = nueva · { category } = editar

  const closeModal = () => setModal(null);
  const handleSave = (name) => (modal.category ? update(modal.category.id, name) : create(name));

  return (
    <div className="page container-xl">
      <div className="page__head page__head--row">
        <div>
          <h1>Categorías</h1>
          <p>Con estas se clasifican todos los artículos publicados.</p>
        </div>
        <button type="button" className="btn btn-sh btn-sm" onClick={() => setModal({ category: null })}>
          + Nueva categoría
        </button>
      </div>

      {loading && <p role="status">Cargando categorías…</p>}
      {error && <p role="alert" className="text-danger">{error}</p>}

      {categories.length > 0 && (
        <div className="admin-card">
          <table className="admin-table admin-table--categories">
            <thead>
              <tr><th>Nombre</th><th>Artículos asociados</th><th>Estado</th><th className="text-end">Acciones</th></tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td className="c-name">{c.name}</td>
                  <td className="c-count">{c.articleCount}</td>
                  <td className="c-state"><Chip variant={c.status === 'Activa' ? 'green' : 'grey'}>{c.status}</Chip></td>
                  <td className="c-actions">
                    <button type="button" className="btn btn-sh-outline btn-sm" onClick={() => setModal({ category: c })}>Editar</button>
                    {c.status === 'Activa' ? (
                      <button type="button" className="btn btn-sh-outline btn-sm" disabled={busyId === c.id}
                              onClick={() => toggle(c)}>Inactivar</button>
                    ) : (
                      <button type="button" className="btn btn-sh btn-sm" disabled={busyId === c.id}
                              onClick={() => toggle(c)}>Activar</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && <CategoryModal category={modal.category} onSave={handleSave} onClose={closeModal} />}
    </div>
  );
}
