import { create } from "solid-zustand";

/**
 * Auth Session Store
 *
 * Mengelola state sesi pengguna aktif, profil, dan izin hak akses secara reaktif di sisi klien.
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export interface AuthState {
  user: UserProfile | null;
  permissions: Array<string>;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  setPermissions: (permissions: Array<string>) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  permissions: [],
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: user !== null }),
  setPermissions: (permissions) => set({ permissions }),
  clearAuth: () => set({ user: null, permissions: [], isAuthenticated: false }),
}));
