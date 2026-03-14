import { create } from "zustand";

export interface User {
    id?: string;
    name: string;
    email: string;
}

interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    setAccessToken: (token: string) => void;
    setRefreshToken: (token: string) => void;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
    user: JSON.parse(localStorage.getItem("user") || "null"),
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    isAuthenticated: !!localStorage.getItem("accessToken"),

    setUser: (user: User) => {
        localStorage.setItem("user", JSON.stringify(user));
        set({ user });
    },

    setAccessToken: (accessToken: string) => {
        localStorage.setItem("accessToken", accessToken);
        set({ accessToken, isAuthenticated: true });
    },

    setRefreshToken: (refreshToken: string) => {
        localStorage.setItem("refreshToken", refreshToken);
        set({ refreshToken });
    },

    login: ( accessToken: string, refreshToken: string) => {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        set({ accessToken, refreshToken, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({accessToken: null, refreshToken: null, isAuthenticated: false });
    },
}));

export default useAuthStore;
