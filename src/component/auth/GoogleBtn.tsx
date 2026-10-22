"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";

export default function GoogleButton({ onError }: { onError: (msg: string) => void }) {
    const { googleLogin } = useAuth();
    const clientId =
        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
        process.env.GOOGLE_CLIENT_ID ||
        "";

    if (!clientId) {
        return (
            <div className="w-full py-2.5 px-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs text-center">
                Missing Google Client ID. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID in .env.local
            </div>
        );
    }

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className="w-full flex justify-center">
                <GoogleLogin
                    onSuccess={(res) => {
                        if (res.credential) {
                            googleLogin(res.credential).catch((e: any) =>
                                onError(e?.message || "Google sign-in failed")
                            );
                        } else {
                            onError("No credential received from Google");
                        }
                    }}
                    onError={() => onError("Google sign-in was cancelled or failed")}
                    theme="outline"
                    size="large"
                    shape="rectangular"
                    text="continue_with"
                    width="350"
                />
            </div>
        </GoogleOAuthProvider>
    );
}