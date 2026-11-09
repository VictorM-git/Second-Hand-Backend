import { createCollection } from './collection.js';

const requests = createCollection();

// Solicitud de donación o intercambio sobre un artículo (RQF006 y RQF008)
// Campos: id, itemId, requesterId (quien pide), ownerId (dueño del artículo, quien responde),
//         type ('Donación' | 'Intercambio'), offeredItemId y offeredTitle (solo en intercambios),
//         message, status ('Pendiente' | 'Aceptada' | 'Rechazada'), acceptedAt,
//         hiddenForOwner (el dueño la eliminó de su lista), createdAt (fecha de la solicitud)
export const Request = {
  ...requests,
  create: (data) => requests.insert({
    offeredItemId: null,
    offeredTitle: null,
    message: '',
    status: 'Pendiente',
    acceptedAt: null,
    hiddenForOwner: false,
    ...data,
  }),
};
