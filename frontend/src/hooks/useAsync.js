import { useEffect, useState } from 'react';

// Ejecuta una función async al montar (o cuando cambian las dependencias)
// y devuelve { data, loading, error }.
export default function useAsync(asyncFn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let active = true; // evita actualizar estado si el componente se desmontó
    setState((s) => ({ ...s, loading: true, error: null }));
    asyncFn()
      .then((data) => active && setState({ data, loading: false, error: null }))
      .catch(() => active && setState({ data: null, loading: false, error: 'No pudimos cargar la información. Intenta de nuevo.' }));
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
