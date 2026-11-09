import { useRef, useState } from 'react';
import { resizeImage } from '../../utils/image.js';

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED = ['image/jpeg', 'image/png'];

// Zona para arrastrar o elegir una fotografía. Devuelve la imagen (data URL) con onChange.
export default function PhotoUploader({ value, onChange, error }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState('');

  const open = () => inputRef.current?.click();

  const handleFile = async (file) => {
    if (!file) return;
    if (!ACCEPTED.includes(file.type)) { setLocalError('Solo se permiten imágenes JPG o PNG.'); return; }
    if (file.size > MAX_BYTES) { setLocalError('La imagen debe pesar máximo 5 MB.'); return; }
    setLocalError('');
    setBusy(true);
    try {
      onChange(await resizeImage(file));
    } catch {
      setLocalError('No pudimos leer la imagen. Prueba con otra.');
    } finally {
      setBusy(false);
    }
  };

  const message = error || localError;

  return (
    <>
      <div
        className={`dropzone${dragging ? ' is-dragging' : ''}`}
        role="button" tabIndex={0}
        aria-label={value ? 'Cambiar fotografía' : 'Agregar fotografía'}
        onClick={open}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files?.[0]); }}
      >
        {value ? (
          <img className="dropzone__preview" src={value} alt="Vista previa de la fotografía" />
        ) : (
          <>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
              <rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="m21 16-5-5-8 8" />
            </svg>
            <span>{busy ? 'Procesando imagen…' : 'Arrastra una imagen o búscala en tu equipo'}</span>
          </>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png" hidden
             onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }} />

      <p className="photo__hint">
        JPG o PNG, hasta 5 MB.
        {value && <button type="button" className="photo__remove" onClick={() => onChange('')}>Quitar foto</button>}
      </p>
      {message && <p className="auth-field__error" role="alert">{message}</p>}
    </>
  );
}
