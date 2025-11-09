import { create } from "zustand";
import type { User } from "../types/user.type";

interface AuthState {
  isAuth: boolean | null;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: null,
  user: null,
  login: (user: User) => set({ isAuth: true, user }),
  logout: () => set({ isAuth: false, user: null }),
}));
