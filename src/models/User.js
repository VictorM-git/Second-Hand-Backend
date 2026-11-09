import bcrypt from 'bcrypt';
import { createCollection } from './collection.js';

const SALT_ROUNDS = 10;
const users = createCollection();

// Usuario de la plataforma (RQF001, RQF003, RQF009). El administrador es un usuario con role 'admin'.
// Campos: id, name, email, password (hash de bcrypt), phone, location, bio, photo, instagram,
//         role ('user' | 'admin'), status ('Activo' | 'Inactivo'), createdAt (fecha de registro)
export const User = {
  ...users,

  findByEmail: (email) => users.findOne((user) => user.email === String(email).trim().toLowerCase()),

  // Crea el usuario guardando el hash de la contraseña, nunca el texto plano
  async create({ password, ...data }) {
    return users.insert({
      phone: '',
      location: '',
      bio: '',
      photo: null,
      instagram: '',
      role: 'user',
      status: 'Activo',
      ...data,
      email: String(data.email).trim().toLowerCase(),
      password: await bcrypt.hash(password, SALT_ROUNDS),
    });
  },

  // Compara una contraseña en texto plano con el hash guardado
  checkPassword: (user, plain) => bcrypt.compare(plain, user.password),
};
