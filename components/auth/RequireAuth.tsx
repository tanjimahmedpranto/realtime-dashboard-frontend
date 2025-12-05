"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMeQuery } from "@/lib/apiSlice";

interface RequireAuthProps {
  children: ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const { data, error, isLoading } = useMeQuery();

  useEffect(() => {
    if (!isLoading) {
      const unauthenticated =
        error ||
        !data ||
        !("email" in data) ||
        !data.email;

      if (unauthenticated) {
        router.replace("/login");
      }
    }
  }, [isLoading, error, data, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-600">
        Checking authentication...
      </div>
    );
  }

  // While redirecting away, render nothing
  const unauthenticated =
    error ||
    !data ||
    !("email" in data) ||
    !data.email;

  if (unauthenticated) {
    return null;
  }

  return <>{children}</>;
}
