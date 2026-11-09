import { Item } from '../models/Item.js';
import { Request } from '../models/Request.js';

// Indicadores del perfil: publicaciones y solicitudes hechas
export function getUserStats(userId) {
  return {
    publications: Item.count((item) => item.ownerId === userId),
    requests: Request.count((request) => request.requesterId === userId),
  };
}
