import { getInitials } from '../utils/format.js';

// Avatar circular: muestra la foto si existe y, si no, las iniciales del nombre.
// El texto accesible lo aporta quien lo usa (botón, título, etc.).
export default function Avatar({ src, name, size = 36, ring = false }) {
  const style = { width: size, height: size, fontSize: Math.round(size * 0.38) };
  const cls = `avatar${ring ? ' avatar--ring' : ''}`;
  return src
    ? <img src={src} alt="" className={cls} style={style} />
    : <span className={cls} style={style} aria-hidden="true">{getInitials(name)}</span>;
}
