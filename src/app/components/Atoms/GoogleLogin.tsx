"use client";
import { useEffect } from "react";

interface GoogleLoginProps {
  onLogin: (response: any) => void;
}

export default function GoogleLogin({ onLogin }: GoogleLoginProps) {
  useEffect(() => {
    /* global google */
    if (typeof window !== "undefined" && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: onLogin,
        scope: "https://www.googleapis.com/auth/calendar",
      });

      (window as any).google.accounts.id.renderButton(
        document.getElementById("googleLoginBtn"),
        { theme: "outline", size: "large" }
      );
    }
  }, [onLogin]);

  return <div id="googleLoginBtn"></div>;
}
