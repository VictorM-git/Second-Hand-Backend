import { useMemo } from 'react';
import { getActiveCategoryNames } from '../services/categoriesService.js';

// Nombres de las categorías activas (las que el administrador dejó habilitadas)
export default function useActiveCategories() {
  return useMemo(() => getActiveCategoryNames(), []);
}
