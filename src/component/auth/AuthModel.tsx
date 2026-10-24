"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthCard from "@/component/auth/AuthCard";

export default function AuthModal() {
  const { modalOpen, closeAuth, authMode } = useAuth();

  useEffect(() => {
    if (!modalOpen) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAuth();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modalOpen, closeAuth]);

  if (!modalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm transition-opacity"
      onClick={closeAuth}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <AuthCard
          initialMode={authMode}
          showCloseButton
          onClose={closeAuth}
          onSuccess={closeAuth}
        />
      </div>
    </div>
  );
}