// Solicitudes que otros usuarios hicieron sobre MIS publicaciones (RQF006). Datos de prueba.
// itemId apunta a una de mis publicaciones (ver myItems.mock.js).
export const seedReceivedRequests = [
  {
    id: 'rr1', itemId: 'm1', itemTitle: 'Cálculo de una variable, Stewart',
    requester: { name: 'Laura Pérez', photo: null },
    type: 'Donación', offeredTitle: null, status: 'Pendiente',
    message: 'Lo necesito para el curso de este semestre, puedo recogerlo cuando te sirva.',
  },
  {
    id: 'rr2', itemId: 'm2', itemTitle: 'Escritorio plegable',
    requester: { name: 'Miguel Torres', photo: null },
    type: 'Intercambio', offeredTitle: 'una silla giratoria', status: 'Rechazada',
    message: '¿Tengo una silla en buen estado, te interesa?',
  },
  {
    id: 'rr3', itemId: 'm3', itemTitle: 'Calculadora científica Casio',
    requester: { name: 'Sara Mora', photo: null },
    type: 'Donación', offeredTitle: null, status: 'Aceptada', message: '',
  },
];
