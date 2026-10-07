"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SpaceLogin } from "@/components/ui/space-login";
import {
  getRememberedEmail,
  resetPassword,
  signIn,
  signInWithProvider,
  signUp,
  type SocialProvider,
} from "@/lib/auth";

type AuthMode = "signin" | "signup" | "reset";

export function AuthScreen({ initialMode }: { initialMode: "signin" | "signup" }) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [defaultEmail, setDefaultEmail] = useState("");

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    setDefaultEmail(getRememberedEmail());
  }, []);

  const finish = async () => {
    await new Promise((resolve) => setTimeout(resolve, 650));
    router.push("/product");
  };

  return (
    <SpaceLogin
      key={`${mode}-${defaultEmail}`}
      mode={mode}
      title={
        mode === "signup" ? "Sign Up" : mode === "reset" ? "Reset Password" : "Sign In"
      }
      subtitle={
        mode === "signup"
          ? "Create a Lithos account to open the maps."
          : mode === "reset"
            ? "Choose a new password for your account."
            : undefined
      }
      defaultEmail={defaultEmail}
      onSignUp={() => router.push(mode === "signin" ? "/sign-up" : "/sign-in")}
      onForgotPassword={() => setMode("reset")}
      onBackToSignIn={() => router.push("/sign-in")}
      onSocialLogin={async (provider: SocialProvider) => {
        signInWithProvider(provider);
        await finish();
      }}
      onSubmit={async ({ email, password, rememberMe, name }) => {
        if (mode === "signup") {
          await signUp({ name: name || "", email, password });
        } else if (mode === "reset") {
          await resetPassword({ email, password });
        } else {
          await signIn({ email, password, rememberMe });
        }
        await finish();
      }}
    />
  );
}
