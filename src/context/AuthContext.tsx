"use client";

import { createContext, useContext, useRef, useState, useEffect, useCallback } from "react";
import { authService } from "@/services/auth.api";
import { LoginUser, RegisterUser, AuthContextType, AuthUser } from "@/types/user.type";
import { AppError } from "@/lib/error";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const pendingAction = useRef<(() => void) | null>(null);

  const syncUser = useCallback(async () => {
    try {
      const res = await authService.me();
      setUser(res?.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    syncUser();
  }, [syncUser]);

  const completeAuth = useCallback(async () => {
    const action = pendingAction.current;
    pendingAction.current = null;
    setModalOpen(false);
    action?.();
  }, []);

  const requireAuth = useCallback(
    (action?: () => void) => {
      if (user) return action?.();
      pendingAction.current = action ?? null;
      setModalOpen(true);
    },
    [user]
  );

  const closeAuth = useCallback(() => {
    pendingAction.current = null;
    setModalOpen(false);
  }, []);

  const login = useCallback(
    async (data: LoginUser) => {
      await authService.login(data);
      await syncUser();
      await completeAuth();
    },
    [syncUser, completeAuth]
  );

  const register = useCallback(
    async (data: RegisterUser) => {
      await authService.register(data);
      await syncUser();
      await completeAuth();
    },
    [syncUser, completeAuth]
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    setUser(null);
  }, []);

  const googleLogin = useCallback(
    async (credential: string) => {
      await authService.google(credential);
      await syncUser();
      await completeAuth();
    },
    [syncUser, completeAuth]
  );

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