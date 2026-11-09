// Solicitudes realizadas por el usuario (RQF008). Datos de prueba.
// date: fecha de la solicitud · acceptedAt: fecha de aceptación (solo si status = 'Aceptada')
export const mockRequests = [
  {
    id: '1', itemId: '4', title: 'Chaqueta impermeable talla M', image: '/images/items/chaqueta.jpg',
    type: 'Donación', counterpart: 'Camilo Ruiz', date: '2026-09-04', status: 'Pendiente',
    note: 'Esperando respuesta del donante. Recibirás una notificación cuando haya novedad.',
  },
  {
    id: '2', itemId: '7', title: 'Física universitaria, Sears', image: '/images/items/item-7.jpg',
    type: 'Intercambio', counterpart: 'Daniela León', date: '2026-09-01', status: 'Aceptada', acceptedAt: '2026-09-03',
    note: 'Tu solicitud fue aceptada. Contacta al miembro para coordinar la entrega.',
    contact: {
      name: 'Daniela León', email: 'daniela@correo.com', phone: '310 555 1234',
      location: 'Teusaquillo', instagram: '@danielaleon', photo: null, memberSince: '2026-03-01',
    },
  },
  {
    id: '3', itemId: '17', title: 'Lámpara de escritorio LED', image: '/images/items/item-17.jpg',
    type: 'Donación', counterpart: 'Andrés Gil', date: '2026-08-25', status: 'Rechazada',
    note: 'El artículo ya no está disponible o el donante no pudo atender tu solicitud.',
  },
];
