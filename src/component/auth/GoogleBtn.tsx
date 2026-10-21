"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";

import { useAuth } from "@/context/AuthContext";

export default function GoogleButton({ onError }: { onError: (msg: string) => void }) {
    const { googleLogin } = useAuth();
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
            <GoogleLogin
                onSuccess={(res) =>
                    res.credential && googleLogin(res.credential).catch((e) => onError(e.message))
                }
                onError={() => onError("Google sign-in failed")}
            />
        </GoogleOAuthProvider>
    );
}