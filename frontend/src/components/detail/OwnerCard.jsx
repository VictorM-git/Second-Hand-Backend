import { getInitials } from '../../utils/format.js';

// Tarjeta "Publicado por" con avatar de iniciales.
export default function OwnerCard({ owner }) {
  return (
    <div className="detail__card owner">
      <p className="owner__label">Publicado por</p>
      <div className="owner__row">
        <span className="owner__avatar" aria-hidden="true">{getInitials(owner.name)}</span>
        <div>
          <p className="owner__name">{owner.name}</p>
          <p className="owner__location">{owner.location}</p>
        </div>
      </div>
    </div>
  );
}
