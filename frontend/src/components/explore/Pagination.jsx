import { getPageNumbers } from '../../utils/format.js';

// Paginación numerada accesible. Se oculta si solo hay una página.
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="pager" aria-label="Paginación de artículos">
      <button type="button" className="pager__btn" disabled={page === 1}
              onClick={() => onChange(page - 1)} aria-label="Página anterior">‹</button>

      {getPageNumbers(page, totalPages).map((p, i) =>
        p === '…'
          ? <span key={`gap-${i}`} className="pager__gap" aria-hidden="true">…</span>
          : <button key={p} type="button" className="pager__btn"
                    aria-current={p === page ? 'page' : undefined}
                    aria-label={`Página ${p}`} onClick={() => onChange(p)}>{p}</button>
      )}

      <button type="button" className="pager__btn" disabled={page === totalPages}
              onClick={() => onChange(page + 1)} aria-label="Página siguiente">›</button>
    </nav>
  );
}
