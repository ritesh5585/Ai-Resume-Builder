"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import AuthCard from "@/component/auth/AuthCard";

export default function RegisterPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center bg-[#fafafa]">
        <div className="w-8 h-8 border-2 border-zinc-300 border-t-[#1c3933] rounded-full animate-spin" />
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-gradient-to-b from-[#f9fafb] to-[#f3f4f6]">
      <AuthCard
        initialMode="register"
        showCloseButton={false}
        onSuccess={() => router.push("/")}
      />
    </div>
  );
}