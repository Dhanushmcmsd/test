import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "Sign In · Lithos",
  description: "Sign in to Lithos.",
};

export default function SignInPage() {
  return <AuthScreen initialMode="signin" />;
}
