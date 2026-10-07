"use client";

import { useEffect, useState } from "react";
import { readSession, subscribeAuth, type Session } from "@/lib/auth";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    setSession(readSession());
    return subscribeAuth(setSession);
  }, []);

  return session;
}
