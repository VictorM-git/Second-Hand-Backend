import { useState } from 'react';

// Galería: imagen principal + miniaturas seleccionables.
export default function ImageGallery({ images, title }) {
  const [selected, setSelected] = useState(0);
  const [broken, setBroken] = useState([]); // imágenes que no cargaron (se ocultan)
  const visible = images.map((src, i) => ({ src, i })).filter(({ i }) => !broken.includes(i));
  const markBroken = (i) => setBroken((b) => (b.includes(i) ? b : [...b, i]));

  return (
    <div className="gallery">
      <img className="gallery__main" src={images[selected]} alt={title}
           onError={() => markBroken(selected)} />
      {visible.length > 1 && (
        <div className="gallery__thumbs">
          {visible.map(({ src, i }) => (
            <button key={src} type="button" className="gallery__thumb"
                    aria-pressed={i === selected} aria-label={`Ver foto ${i + 1}`}
                    onClick={() => setSelected(i)}>
              <img src={src} alt="" onError={() => markBroken(i)} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
