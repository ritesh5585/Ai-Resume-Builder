"use client";

import { createContext, useContext, useRef, useState } from "react";
import { authService } from "@/services/auth.api";
import { AuthUser, LoginUser, RegisterUser, AuthContextType } from "@/types/user.type";
import { AppError } from "@/lib/error";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const pendingAction = useRef<(() => void) | null>(null);

    const completeAuth = async () => {
        const action = pendingAction.current;
        pendingAction.current = null;
        action?.();
    };

    const requireAuth = (action?: () => void) => {
        if (user) return action?.();
        pendingAction.current = action ?? null;
        setModalOpen(true);
    };

    const closeAuth = () => {
        pendingAction.current = null;
        setModalOpen(false);
    };

    const login = async (data: LoginUser) => {
        await authService.login(data);
        await completeAuth();
    };

    const register = async (data: RegisterUser) => {
        await authService.register(data);
        await completeAuth();
    };

    const logout = async () => setUser(null);
    const googleLogin = async () => { };

    return (
        <AuthContext.Provider
            value={{ user, loading, modalOpen, requireAuth, closeAuth, login, register, googleLogin, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new AppError("useAuth must be used inside <AuthProvider>", 400);
    return ctx;
}