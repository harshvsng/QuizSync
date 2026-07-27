"use client";

import React, { ReactNode, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { sessionAPI } from "@/api/auth";
import { useRouter } from "next/navigation";
import { IUserSession } from "@/types/auth";

interface ProviderProps {
  children: ReactNode;
}

export default function Provider({ children }: ProviderProps) {
  const { user, setUser } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (user === undefined) {
      sessionAPI().then((response) => {
        if (!response.success) {
          localStorage.removeItem(`accessToken`);
          setUser(null);
          return;
        }
        setUser(response.data as IUserSession);
      });
    }
  }, [router, setUser, user]);

  return <>{children}</>;
}
