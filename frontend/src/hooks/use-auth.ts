"use client";

import { useEffect } from "react";

import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    store.hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return store;
}
