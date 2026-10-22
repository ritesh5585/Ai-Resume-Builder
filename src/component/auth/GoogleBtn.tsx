"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "@/context/AuthContext";

export default function GoogleButton({ onError }: { onError: (msg: string) => void }) {
  const { googleLogin } = useAuth();

  return (
    <div className="w-full [&>div]:!w-full [&_iframe]:!w-full">
      <GoogleLogin
        onSuccess={(res) =>
          res.credential
            ? googleLogin(res.credential).catch((e: any) => onError(e?.message || "Google sign-in failed"))
            : onError("No credential received from Google")
        }
        onError={() => onError("Google sign-in was cancelled or failed")}
        theme="outline"
        size="large"
        shape="rectangular"
        text="continue_with"
      />
    </div>
  );
}