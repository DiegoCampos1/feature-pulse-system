import Cookies from "js-cookie";
import { create } from "zustand";

import api from "@/lib/api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  User,
} from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  hydrate: () => {
    const token = Cookies.get("access_token");
    if (token) {
      set({ isAuthenticated: true });
      api
        .get<User>("/auth/me/")
        .then(({ data }) => set({ user: data, isAuthenticated: true, isLoading: false }))
        .catch(() => {
          Cookies.remove("access_token");
          Cookies.remove("refresh_token");
          set({ user: null, isAuthenticated: false, isLoading: false });
        });
    } else {
      set({ isLoading: false });
    }
  },

  login: async (credentials: LoginRequest) => {
    const { data } = await api.post<LoginResponse>("/auth/login/", credentials);
    Cookies.set("access_token", data.access, { sameSite: "lax" });
    Cookies.set("refresh_token", data.refresh, { sameSite: "lax" });
    set({ isAuthenticated: true });
    const { data: user } = await api.get<User>("/auth/me/");
    set({ user, isLoading: false });
  },

  register: async (credentials: RegisterRequest) => {
    const { data } = await api.post<RegisterResponse>("/auth/register/", credentials);
    Cookies.set("access_token", data.tokens.access, { sameSite: "lax" });
    Cookies.set("refresh_token", data.tokens.refresh, { sameSite: "lax" });
    set({ user: data.user, isAuthenticated: true, isLoading: false });
  },

  logout: () => {
    Cookies.remove("access_token");
    Cookies.remove("refresh_token");
    set({ user: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const { data } = await api.get<User>("/auth/me/");
      set({ user: data, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
