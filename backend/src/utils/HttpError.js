// Error con código HTTP. El middleware de errores lo convierte en la respuesta JSON:
// { message, errors? }  (errors = { campo: 'mensaje' }, igual que los formularios del frontend)
export class HttpError extends Error {
  constructor(status, message, errors) {
    super(message);
    this.status = status;
    if (errors) this.errors = errors;
  }
}

// Lanza un 400 si algún campo tiene error. El mensaje general es el del primer campo con error.
export function throwIfErrors(errors) {
  const found = Object.fromEntries(Object.entries(errors).filter(([, message]) => message));
  const messages = Object.values(found);
  if (messages.length) throw new HttpError(400, messages[0], found);
}
