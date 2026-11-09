import { createContext, useContext, useState } from 'react';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'sh_session';

// Lee la sesión guardada (si existe) para mantenerla al recargar la página.
function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

// Proveedor global de autenticación: expone el usuario y las acciones de login/logout/actualizar perfil.
export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  const saveSession = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setSession(data);
  };

  const login = async (credentials) => {
    const data = await authService.login(credentials); // { user, token }
    saveSession(data);
    return data.user; // permite redirigir según el rol
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setSession(null);
  };

  // Combina los cambios con el usuario actual y los guarda (RQF003)
  const updateUser = async (changes) => {
    const user = await authService.updateProfile({ ...session.user, ...changes });
    saveSession({ ...session, user });
  };

  const value = {
    user: session?.user ?? null,
    token: session?.token ?? null,
    isAuthenticated: Boolean(session),
    isAdmin: session?.user?.role === 'admin',
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook de acceso al contexto
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
