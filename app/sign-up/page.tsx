import type { Metadata } from "next";
import { AuthScreen } from "@/components/auth/auth-screen";

export const metadata: Metadata = {
  title: "Sign Up · Lithos",
  description: "Create a Lithos account.",
};

export default function SignUpPage() {
  return <AuthScreen initialMode="signup" />;
}
