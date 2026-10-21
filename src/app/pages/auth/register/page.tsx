"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
    const router = useRouter();
    const { user, register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) router.replace("/");
    }, [user, router]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (!name.trim()) return setError("Name is required");
        if (!email.trim()) return setError("Email is required");
        if (!email.includes("@")) return setError("Enter a valid email address");
        if (password.length < 6)
            return setError("Password must be at least 6 characters");

        try {
            setLoading(true);

            await register(name.trim(), email.trim(), password);

            router.replace("/");
        } catch (err: any) {
            setError(err?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
            <div className="w-full max-w-sm">
                {/* Header */}
                <h1 className="text-2xl font-semibold text-gray-900 text-center">
                    Create your account
                </h1>
                <p className="text-sm text-gray-500 text-center mt-1 mb-8">
                    Get started in a few seconds
                </p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your full name"
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            disabled={loading}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent disabled:bg-gray-50"
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-md">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-2.5 rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {loading ? "Creating account..." : "Create account"}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-sm text-gray-500 text-center mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="text-black font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}